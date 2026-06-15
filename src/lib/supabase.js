import { createClient } from '@supabase/supabase-js'

const supabaseUrl    = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Si las variables faltan, exportamos un cliente nulo que resuelve silenciosamente
// con datos vacíos. La web pública usa los datos de respaldo de src/data/ y nunca
// lanza un error que tumbe la app.
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : nullClient()

function nullClient() {
  const empty = () => Promise.resolve({ data: null, error: null, count: 0 })

  // Proxy que acepta CUALQUIER encadenamiento de métodos de Supabase
  // (select, eq, order, insert, update, delete, upsert, range, ilike…)
  // y al hacer then/await resuelve con datos vacíos sin lanzar nunca.
  function makeQuery() {
    const handlers = {
      then:        (fn)  => empty().then(fn),
      catch:       (fn)  => empty().catch(fn),
      finally:     (fn)  => empty().finally(fn),
      single:      ()    => empty(),
      maybeSingle: ()    => empty(),
    }
    return new Proxy(handlers, {
      get(target, prop) {
        if (prop in target) return target[prop]
        return () => makeQuery()
      },
    })
  }

  return {
    from: () => makeQuery(),
    auth: {
      getSession:         () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange:  () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase no configurado.' } }),
      signOut:            () => Promise.resolve({ error: null }),
      getUser:            () => Promise.resolve({ data: { user: null }, error: null }),
    },
    storage: {
      from: () => ({
        upload:                () => Promise.resolve({ data: null, error: { message: 'Storage no disponible.' } }),
        createSignedUrl:       () => Promise.resolve({ data: null, error: { message: 'Storage no disponible.' } }),
        createSignedUploadUrl: () => Promise.resolve({ data: null, error: { message: 'Storage no disponible.' } }),
      }),
    },
  }
}
