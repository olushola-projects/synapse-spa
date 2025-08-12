/// <reference types="vite/client" />

interface ImportMetaEnv {
  // SECURITY FIX: Removed VITE_NEXUS_API_KEY - use edge function proxy instead
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_APP_ENV: string
  readonly VITE_API_BASE_URL: string
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
