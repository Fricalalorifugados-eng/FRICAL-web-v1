// Genera una URL firmada para que el panel admin suba imágenes
// directamente al bucket "media" en Supabase Storage sin pasar por este servidor.
//
// Flujo:
//   1. Admin panel → POST /api/upload { filename, contentType, folder }
//   2. Servidor verifica JWT, genera signed upload URL
//   3. Admin panel → PUT <signedUrl> con el archivo (fetch nativo)
//   4. Admin panel usa `path` para construir la URL pública final
//
// URL pública: ${SUPABASE_URL}/storage/v1/object/public/media/<path>

import { adminClient, requireAdmin, badRequest, serverError } from './_lib.js'

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/svg+xml',
]

const ALLOWED_FOLDERS = ['proyectos', 'proyectos/proximamente', 'servicios', 'general']

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' })

  // Autenticación
  const user = await requireAdmin(req, res)
  if (!user) return

  const { filename, contentType, folder = 'general' } = req.body || {}

  if (!filename || typeof filename !== 'string' || !filename.trim()) {
    return badRequest(res, 'Se requiere el campo "filename".')
  }
  if (!contentType || !ALLOWED_TYPES.includes(contentType)) {
    return badRequest(res, `Tipo de archivo no permitido. Formatos admitidos: ${ALLOWED_TYPES.join(', ')}.`)
  }
  if (!ALLOWED_FOLDERS.includes(folder)) {
    return badRequest(res, `Carpeta no válida. Carpetas permitidas: ${ALLOWED_FOLDERS.join(', ')}.`)
  }

  // Sanitizar nombre: solo alfanumérico, guiones y punto de extensión
  const safeName = filename
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/-+/g, '-')

  const path = `${folder}/${Date.now()}-${safeName}`

  try {
    const sb = adminClient()
    const { data, error } = await sb.storage
      .from('media')
      .createSignedUploadUrl(path)

    if (error) throw error

    const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/media/${path}`

    return res.status(200).json({
      signedUrl: data.signedUrl,
      token: data.token,
      path,
      publicUrl,
    })
  } catch (e) {
    console.error('[api/upload]', e)
    return serverError(res, 'No se pudo generar la URL de subida.')
  }
}
