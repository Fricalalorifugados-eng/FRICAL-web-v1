import { createClient } from '@supabase/supabase-js'

const supabaseUrl    = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Si las variables faltan en el build, exportamos un cliente nulo que
// resuelve silenciosamente con datos vacíos. La web usa los datos de
// respaldo de src/data/ y no se rompe.
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : nullClient()

function nullClient() {
  const empty = (v = null) => Promise.resolve({ data: v, error: null, count: 0 })

  // Cadena de métodos de consulta — todos devuelven la misma cadena
  // para poder encadenar .select().eq().order().then() sin errores.
  const q = {
    select:  ()  => q,
    eq:      ()  => q,
    order:   ()  => q,
    single:  ()  => empty(),
    limit:   ()  => q,
    insert:  ()  => empty(),
    update:  ()  => q,
    delete:  ()  => q,
    then:    (fn) => empty().then(fn),
    catch:   (fn) => empty().catch(fn),
  }

  return {
    from: () => q,
    auth: {
      getSession:         () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange:  () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase no configurado.' } }),
      signOut:            () => Promise.resolve({ error: null }),
      getUser:            () => Promise.resolve({ data: { user: null }, error: null }),
    },
    storage: {
      from: () => ({
        createSignedUrl:      () => Promise.resolve({ data: null, error: { message: 'Storage no disponible.' } }),
        createSignedUploadUrl:() => Promise.resolve({ data: null, error: { message: 'Storage no disponible.' } }),
      }),
    },
  }
}
