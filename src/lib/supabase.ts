import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

function createFallbackSupabaseClient() {
  const buildError = (message: string) => ({ message })

  const createQueryBuilder = (message: string) => ({
    select: async () => ({ data: [], error: buildError(message) }),
    insert: async () => ({ data: null, error: buildError(message) }),
    update: async () => ({ data: null, error: buildError(message) }),
    delete: () => ({
      eq: async () => ({ data: null, error: buildError(message) }),
    }),
    eq: async () => ({ data: null, error: buildError(message) }),
  })

  return {
    from: () => createQueryBuilder('Supabase no está configurado. Agrega VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.'),
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => undefined } },
      }),
      signInWithPassword: async () => ({
        data: { session: null, user: null },
        error: buildError('Supabase no está configurado. Agrega tus credenciales al entorno.'),
      }),
      signOut: async () => ({
        error: buildError('Supabase no está configurado. Agrega tus credenciales al entorno.'),
      }),
    },
  } as unknown as SupabaseClient
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createFallbackSupabaseClient()