// El CV se sube desde el frontend directamente al bucket "private-uploads"
// de Supabase Storage usando el cliente anon (política anon_insert_private_uploads).
// Este endpoint recibe la ruta resultante (cv_path) y registra la candidatura.

import { adminClient, resendClient, badRequest, serverError, missingFields, isValidEmail, esc } from './_lib.js'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' })

  const body = req.body || {}
  const absent = missingFields(body, ['nombre', 'email', 'puesto_interes'])
  if (absent) return badRequest(res, `Campos requeridos: ${absent.join(', ')}.`)
  if (!isValidEmail(body.email)) return badRequest(res, 'El email no tiene un formato válido.')

  const {
    nombre,
    email,
    telefono = '',
    puesto_interes,
    vacante_id = null,
    mensaje = '',
    cv_url = '',
  } = body

  try {
    // 1. Guardar candidatura en BD
    const sb = adminClient()
    const { error: dbErr } = await sb
      .from('applications')
      .insert({
        nombre: nombre.trim(),
        email: email.trim(),
        telefono: telefono.trim(),
        puesto_interes: puesto_interes.trim(),
        vacante_id: vacante_id || null,
        mensaje: mensaje.trim(),
        cv_url: cv_url.trim(),
      })
    if (dbErr) throw dbErr

    // 2. Generar URL firmada del CV para el email (válida 7 días)
    let cvSignedUrl = null
    if (cv_url) {
      // cv_url tiene formato "cvs/nombre-archivo.pdf"
      const { data } = await sb.storage
        .from('private-uploads')
        .createSignedUrl(cv_url, 60 * 60 * 24 * 7)
      cvSignedUrl = data?.signedUrl || null
    }

    // 3. Email (best-effort)
    try {
      const resend = resendClient()
      await resend.emails.send({
        from: process.env.RESEND_FROM,
        to: [process.env.CONTACT_TO_EMAIL],
        replyTo: email.trim(),
        subject: `[Web] Nueva candidatura: ${puesto_interes.trim()}`,
        html: buildEmpleoEmail({ nombre, email, telefono, puesto_interes, mensaje, cvSignedUrl }),
      })
    } catch (emailErr) {
      console.error('[api/empleo] Email failed (non-critical):', emailErr.message)
    }

    return res.status(200).json({ ok: true })
  } catch (e) {
    console.error('[api/empleo]', e)
    return serverError(res, 'No se pudo registrar la candidatura. Inténtalo de nuevo.')
  }
}

function buildEmpleoEmail({ nombre, email, telefono, puesto_interes, mensaje, cvSignedUrl }) {
  const rows = [
    ['Nombre', nombre],
    ['Email', `<a href="mailto:${esc(email)}" style="color:#b8860b">${esc(email)}</a>`],
    telefono && ['Teléfono', `<a href="tel:${esc(telefono)}" style="color:#b8860b">${esc(telefono)}</a>`],
    ['Puesto de interés', puesto_interes],
  ]
    .filter(Boolean)
    .map(([label, value]) => `
      <tr>
        <td style="padding:9px 12px;background:#f5f5f5;font-size:13px;color:#666;width:160px;white-space:nowrap">${label}</td>
        <td style="padding:9px 12px;font-size:13px;color:#1a1a1a">${typeof value === 'string' && !value.includes('<a') ? esc(value) : value}</td>
      </tr>`)
    .join('')

  const cvBlock = cvSignedUrl
    ? `<div style="margin-top:20px">
        <a href="${esc(cvSignedUrl)}" style="display:inline-block;background:#1a6e34;color:#fff;padding:11px 20px;text-decoration:none;border-radius:4px;font-size:13px">Descargar CV (enlace válido 7 días)</a>
       </div>`
    : `<p style="margin-top:16px;font-size:13px;color:#888;font-style:italic">No se adjuntó CV.</p>`

  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f0f0f0;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:6px;overflow:hidden;border:1px solid #ddd">
  <tr><td style="background:#0a0a0a;padding:24px 28px">
    <p style="margin:0 0 4px;color:#b8860b;font-size:11px;letter-spacing:.1em;text-transform:uppercase">FRICAL CALORIFUGADOS, S.L. — RRHH</p>
    <h1 style="margin:0;color:#fff;font-size:18px;font-weight:600">Nueva candidatura recibida</h1>
  </td></tr>
  <tr><td style="padding:28px">
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e0e0e0">
      ${rows}
    </table>
    ${mensaje ? `<div style="margin-top:20px;padding:16px;background:#fafafa;border:1px solid #e0e0e0;border-radius:4px">
      <p style="margin:0 0 8px;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:.05em">Carta de presentación</p>
      <p style="margin:0;font-size:14px;color:#1a1a1a;line-height:1.7;white-space:pre-wrap">${esc(mensaje)}</p>
    </div>` : ''}
    ${cvBlock}
    <div style="margin-top:24px">
      <a href="mailto:${esc(email)}?subject=Tu candidatura en FRICAL" style="display:inline-block;background:#0a0a0a;color:#fff;padding:12px 22px;text-decoration:none;border-radius:4px;font-size:13px">Responder a ${esc(nombre)}</a>
    </div>
  </td></tr>
  <tr><td style="padding:16px 28px;border-top:1px solid #eee;background:#fafafa">
    <p style="margin:0;font-size:11px;color:#aaa;text-align:center">Candidatura recibida desde fricalcalorifugados.com/empleo</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`
}
