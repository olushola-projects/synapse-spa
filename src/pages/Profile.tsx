
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

// Define the jurisdictions available
const jurisdictions = [
  { id: "eu", label: "European Union (EU)" },
  { id: "uk", label: "United Kingdom (UK)" },
  { id: "us", label: "United States (US)" },
  { id: "sg", label: "Singapore" },
  { id: "hk", label: "Hong Kong" },
  { id: "au", label: "Australia" },
  { id: "ca", label: "Canada" },
];

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  jurisdiction: z.array(z.string()).optional(),
  modelPreference: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, updateProfile } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      jurisdiction: user?.jurisdiction || [],
      modelPreference: user?.modelPreference || "",
    },
  });

  // Update form values when user data is available
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        jurisdiction: user.jurisdiction || [],
        modelPreference: user.modelPreference || "",
      });
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await updateProfile(data);
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  if (isLoading || !user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse">Loading profile...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container max-w-4xl py-8">
        <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <div className="flex justify-between mb-2">
                    <span>Member since:</span>
                    <span>April 2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last login:</span>
                    <span>Today</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Change Avatar
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input {...field} disabled />
                          </FormControl>
                          <FormDescription>
                            You cannot change your email address
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Separator className="my-6" />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Model Preference</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Select your preferred AI model for agentic tasks
                      </p>
                      <FormField
                        control={form.control}
                        name="modelPreference"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>AI Model</FormLabel>
                            <FormControl>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select a model" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="gemini-2.5-pro">Gemini 2.5 Pro (Google)</SelectItem>
                                  <SelectItem value="text-embedding-3-small">DeepSeek Embedding Small</SelectItem>
                                  <SelectItem value="text-embedding-3-large">DeepSeek Embedding Large</SelectItem>
                                  <SelectItem value="sentence-transformers/all-MiniLM-L6-v2">MiniLM-L6-v2 (HF)</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormDescription>
                              This will be used as your default model for agentic workflows.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Jurisdictional Interests</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Select the jurisdictions you're interested in for content and regulatory updates
                      </p>
                      
                      <FormField
                        control={form.control}
                        name="jurisdiction"
                        render={() => (
                          <FormItem>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {jurisdictions.map((item) => (
                                <FormField
                                  key={item.id}
                                  control={form.control}
                                  name="jurisdiction"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={item.id}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(item.id)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...field.value || [], item.id])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) => value !== item.id
                                                    )
                                                  )
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          {item.label}
                                        </FormLabel>
                                      </FormItem>
                                    )
                                  }}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Save Changes
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
