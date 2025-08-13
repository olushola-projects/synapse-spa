-- Fix infinite recursion in admin_users RLS policies by creating a security definer function
-- First, create a security definer function to check user roles safely
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
BEGIN
  -- Direct query without RLS to avoid recursion
  RETURN (SELECT role FROM public.admin_users WHERE user_id = auth.uid() LIMIT 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Drop existing problematic admin_users policies that cause recursion
DROP POLICY IF EXISTS "Admin users can view their own data" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin users" ON public.admin_users;

-- Create new safe admin_users policies using the security definer function
CREATE POLICY "Admin users can view their own data" 
ON public.admin_users 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Super admins can manage admin users" 
ON public.admin_users 
FOR ALL 
USING (public.get_current_user_role() = 'super_admin');

-- Now fix waitlist policies to ensure proper security
DROP POLICY IF EXISTS "Authenticated users can join waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "Only super admins can modify waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "Only verified admins can access waitlist data" ON public.waitlist;

-- Create secure waitlist policies
CREATE POLICY "Authenticated users can insert waitlist entries" 
ON public.waitlist 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only verified admins can read waitlist data" 
ON public.waitlist 
FOR SELECT 
USING (public.get_current_user_role() IN ('admin', 'super_admin'));

CREATE POLICY "Only super admins can update waitlist" 
ON public.waitlist 
FOR UPDATE 
USING (public.get_current_user_role() = 'super_admin');

CREATE POLICY "Only super admins can delete waitlist entries" 
ON public.waitlist 
FOR DELETE 
USING (public.get_current_user_role() = 'super_admin');

-- Add audit logging for waitlist access
CREATE OR REPLACE FUNCTION public.log_waitlist_access()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    new_values,
    timestamp
  ) VALUES (
    auth.uid(),
    TG_OP,
    'waitlist',
    COALESCE(NEW.id::text, OLD.id::text),
    CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE to_jsonb(NEW) END,
    now()
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for waitlist audit logging
DROP TRIGGER IF EXISTS waitlist_audit_trigger ON public.waitlist;
CREATE TRIGGER waitlist_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.waitlist
  FOR EACH ROW EXECUTE FUNCTION public.log_waitlist_access();