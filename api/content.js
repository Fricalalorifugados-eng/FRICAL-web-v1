// CRUD protegido para el panel admin.
// Solo accesible con un JWT de Supabase válido (usuario autenticado).
//
// GET    /api/content?table=services             → lista todas las filas
// POST   /api/content?table=services             → inserta una fila
// PUT    /api/content?table=services&id=...      → actualiza por id/key
// DELETE /api/content?table=services&id=...      → elimina por id/key

import { adminClient, requireAdmin, badRequest, serverError, esc } from './_lib.js'

// Tablas permitidas y qué campo es su PK
const ALLOWED = {
  site_content:          'key',
  contact_info:          'id',
  services:              'id',
  projects:              'id',
  upcoming_projects:     'id',
  sectors:               'id',
  testimonials:          'id',
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end()

  // Autenticación
  const user = await requireAdmin(req, res)
  if (!user) return

  const { table, id, order = 'orden', dir = 'asc' } = req.query

  // Validar tabla
  if (!table || !ALLOWED[table]) {
    return badRequest(res, `Tabla no válida. Tablas permitidas: ${Object.keys(ALLOWED).join(', ')}.`)
  }
  const pkField = ALLOWED[table]
  const sb = adminClient()

  try {
    // ── GET ──────────────────────────────────────────────────────────────────
    if (req.method === 'GET') {
      const { data, error } = await sb
        .from(table)
        .select('*')
        .order(order, { ascending: dir !== 'desc' })
      if (error) throw error
      return res.status(200).json({ data })
    }

    // ── POST (insert) ────────────────────────────────────────────────────────
    if (req.method === 'POST') {
      const body = req.body
      if (!body || typeof body !== 'object') return badRequest(res, 'El cuerpo de la petición debe ser un objeto JSON.')
      const { data, error } = await sb.from(table).insert(body).select()
      if (error) throw error
      return res.status(201).json({ data: data[0] })
    }

    // ── PUT (update) ─────────────────────────────────────────────────────────
    if (req.method === 'PUT') {
      if (!id) return badRequest(res, `Se requiere el parámetro "id" en la URL (campo ${pkField}).`)
      const body = req.body
      if (!body || typeof body !== 'object') return badRequest(res, 'El cuerpo de la petición debe ser un objeto JSON.')
      // Eliminar el pk del body para no sobreescribirlo
      const payload = { ...body }
      delete payload[pkField]
      payload.updated_at = new Date().toISOString()

      const { data, error } = await sb
        .from(table)
        .update(payload)
        .eq(pkField, id)
        .select()
      if (error) throw error
      if (!data?.length) return res.status(404).json({ error: 'Registro no encontrado.' })
      return res.status(200).json({ data: data[0] })
    }

    // ── DELETE ───────────────────────────────────────────────────────────────
    if (req.method === 'DELETE') {
      if (!id) return badRequest(res, `Se requiere el parámetro "id" en la URL (campo ${pkField}).`)
      const { error } = await sb.from(table).delete().eq(pkField, id)
      if (error) throw error
      return res.status(200).json({ ok: true })
    }

    return res.status(405).json({ error: 'Método no permitido.' })
  } catch (e) {
    console.error(`[api/content] ${req.method} ${table}`, e)
    return serverError(res, e.message || 'Error en la base de datos.')
  }
}
