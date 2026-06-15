// Helpers compartidos para las funciones serverless.
// Este archivo NO se convierte en ruta porque empieza por "_".

import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

// Cliente Supabase con service_role (privilegios totales, solo servidor)
export function adminClient() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Faltan variables de entorno SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY')
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

// Cliente Resend
export function resendClient() {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('Falta la variable de entorno RESEND_API_KEY')
  return new Resend(key)
}

// Respuestas de error normalizadas
export function badRequest(res, msg) {
  return res.status(400).json({ error: msg })
}
export function serverError(res, msg = 'Error interno del servidor.') {
  return res.status(500).json({ error: msg })
}

// Devuelve array con los campos requeridos que faltan o son vacíos
export function missingFields(body, required) {
  const absent = required.filter(
    f => body[f] === undefined || body[f] === null || String(body[f]).trim() === ''
  )
  return absent.length ? absent : null
}

// Verifica el JWT de Supabase en el header Authorization
export async function requireAdmin(req, res) {
  const header = req.headers['authorization'] || ''
  if (!header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No autorizado.' })
    return null
  }
  const token = header.slice(7)
  try {
    const sb = adminClient()
    const { data: { user }, error } = await sb.auth.getUser(token)
    if (error || !user) {
      res.status(401).json({ error: 'Token inválido o expirado.' })
      return null
    }
    return user
  } catch (e) {
    console.error('[requireAdmin]', e)
    res.status(500).json({ error: 'Error al verificar la sesión.' })
    return null
  }
}

// Escapa HTML para plantillas de email
export function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Valida formato de email mínimo
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))
}
