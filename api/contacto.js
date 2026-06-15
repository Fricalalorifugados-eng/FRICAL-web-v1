import { adminClient, resendClient, badRequest, serverError, missingFields, isValidEmail, esc } from './_lib.js'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' })

  const body = req.body || {}
  const absent = missingFields(body, ['nombre', 'email', 'mensaje'])
  if (absent) return badRequest(res, `Campos requeridos: ${absent.join(', ')}.`)
  if (!isValidEmail(body.email)) return badRequest(res, 'El email no tiene un formato válido.')

  const { nombre, empresa = '', email, telefono = '', servicio = '', mensaje } = body

  try {
    // 1. Guardar en BD (crítico)
    const sb = adminClient()
    const { error: dbErr } = await sb
      .from('messages')
      .insert({ nombre: nombre.trim(), empresa: empresa.trim(), email: email.trim(), telefono: telefono.trim(), servicio: servicio.trim(), mensaje: mensaje.trim() })
    if (dbErr) throw dbErr

    // 2. Email (best-effort: si falla, el mensaje ya está guardado en BD y visible en el panel)
    try {
      const resend = resendClient()
      await resend.emails.send({
        from: process.env.RESEND_FROM,
        to: [process.env.CONTACT_TO_EMAIL],
        replyTo: email.trim(),
        subject: `[Web] Contacto de ${nombre.trim()}`,
        html: buildContactoEmail({ nombre, empresa, email, telefono, servicio, mensaje }),
      })
    } catch (emailErr) {
      console.error('[api/contacto] Email failed (non-critical):', emailErr.message)
    }

    return res.status(200).json({ ok: true })
  } catch (e) {
    console.error('[api/contacto]', e)
    return serverError(res, 'No se pudo procesar el mensaje. Inténtalo de nuevo.')
  }
}

function buildContactoEmail({ nombre, empresa, email, telefono, servicio, mensaje }) {
  const rows = [
    ['Nombre', nombre],
    empresa && ['Empresa', empresa],
    ['Email', `<a href="mailto:${esc(email)}" style="color:#b8860b">${esc(email)}</a>`],
    telefono && ['Teléfono', `<a href="tel:${esc(telefono)}" style="color:#b8860b">${esc(telefono)}</a>`],
    servicio && ['Servicio', servicio],
  ]
    .filter(Boolean)
    .map(([label, value]) => `
      <tr>
        <td style="padding:9px 12px;background:#f5f5f5;font-size:13px;color:#666;width:130px;white-space:nowrap">${label}</td>
        <td style="padding:9px 12px;font-size:13px;color:#1a1a1a">${typeof value === 'string' && !value.includes('<a') ? esc(value) : value}</td>
      </tr>`)
    .join('')

  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f0f0f0;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:6px;overflow:hidden;border:1px solid #ddd">
  <tr><td style="background:#0a0a0a;padding:24px 28px">
    <p style="margin:0 0 4px;color:#b8860b;font-size:11px;letter-spacing:.1em;text-transform:uppercase">FRICAL CALORIFUGADOS, S.L.</p>
    <h1 style="margin:0;color:#fff;font-size:18px;font-weight:600">Nuevo mensaje de contacto</h1>
  </td></tr>
  <tr><td style="padding:28px">
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e0e0e0">
      ${rows}
    </table>
    <div style="margin-top:24px;padding:16px;background:#fafafa;border:1px solid #e0e0e0;border-radius:4px">
      <p style="margin:0 0 8px;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:.05em">Mensaje</p>
      <p style="margin:0;font-size:14px;color:#1a1a1a;line-height:1.7;white-space:pre-wrap">${esc(mensaje)}</p>
    </div>
    <div style="margin-top:24px">
      <a href="mailto:${esc(email)}?subject=Re: consulta FRICAL" style="display:inline-block;background:#0a0a0a;color:#fff;padding:12px 22px;text-decoration:none;border-radius:4px;font-size:13px">Responder a ${esc(nombre)}</a>
    </div>
  </td></tr>
  <tr><td style="padding:16px 28px;border-top:1px solid #eee;background:#fafafa">
    <p style="margin:0;font-size:11px;color:#aaa;text-align:center">Mensaje recibido desde el formulario de contacto de fricalcalorifugados.com</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`
}
