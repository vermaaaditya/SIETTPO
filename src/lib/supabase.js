import { createClient } from '@supabase/supabase-js'

const env = import.meta.env

const supabaseUrl = env.VITE_SUPABASE_URL
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY

const missingEnv = [
  !supabaseUrl ? 'VITE_SUPABASE_URL' : null,
  !supabaseAnonKey ? 'VITE_SUPABASE_ANON_KEY' : null,
].filter(Boolean)

export const supabaseEnvError =
  missingEnv.length > 0
    ? `Missing Supabase configuration: ${missingEnv.join(', ')}`
    : null

export const supabase =
  supabaseEnvError === null
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null
