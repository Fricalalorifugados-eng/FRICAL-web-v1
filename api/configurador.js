// El adjunto (planos/fotos) se sube desde el frontend directamente a "private-uploads".
// Este endpoint recibe la ruta del adjunto (adjunto_url) y el estado completo del wizard.

import { adminClient, resendClient, badRequest, serverError, missingFields, isValidEmail, esc } from './_lib.js'

const LABEL = {
  tipos: { aislamiento: 'Aislamiento de tuberías', calorifugado: 'Calorifugado de depósitos/equipos', conductos: 'Conductos de ventilación', sectorizacion: 'Sectorización RF120' },
  temperatura: { frio: 'Frío industrial', ambiente: 'Temperatura ambiente (hasta 80°C)', media: '100 – 250°C', alta: 'Más de 250°C' },
  material: { 'lana-roca': 'Lana de roca', 'espuma-elastomerica': 'Espuma elastomérica', 'fibra-vidrio': 'Fibra de vidrio', poliuretano: 'Poliuretano inyectado', 'no-se': 'A determinar por FRICAL' },
  acabado: { aluminio: 'Aluminio estucado', inoxidable: 'Inoxidable AISI 304/316', galvanizado: 'Chapa galvanizada', blanca: 'Chapa lacada blanca', 'sin-acabado': 'Sin acabado exterior' },
  plazo: { urgente: 'Urgente (menos de 2 semanas)', medio: '1 – 3 meses', 'sin-prisa': 'Sin prisa (planificación)' },
  sector: { quimico: 'Industria química', alimentario: 'Industria alimentaria', energetico: 'Sector energético', naval: 'Sector naval', farmaceutico: 'Industria farmacéutica', edificacion: 'Edificación / construcción', otro: 'Otro sector' },
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' })

  const body = req.body || {}
  const absent = missingFields(body, ['nombre', 'email', 'configuracion'])
  if (absent) return badRequest(res, `Campos requeridos: ${absent.join(', ')}.`)
  if (!isValidEmail(body.email)) return badRequest(res, 'El email no tiene un formato válido.')

  const {
    nombre,
    empresa = '',
    email,
    telefono = '',
    configuracion,
    tipos_trabajo = [],
    sector = '',
    ubicacion = '',
    plazo = '',
    adjunto_url = '',
  } = body

  if (typeof configuracion !== 'object' || Array.isArray(configuracion)) {
    return badRequest(res, 'El campo "configuracion" debe ser un objeto.')
  }

  try {
    // 1. Guardar en BD
    const sb = adminClient()
    const { error: dbErr } = await sb
      .from('configurator_requests')
      .insert({
        nombre: nombre.trim(),
        empresa: empresa.trim(),
        email: email.trim(),
        telefono: telefono.trim(),
        configuracion,
        tipos_trabajo: Array.isArray(tipos_trabajo) ? tipos_trabajo : [],
        sector: sector.trim(),
        ubicacion: ubicacion.trim(),
        plazo: plazo.trim(),
        adjunto_url: adjunto_url.trim(),
      })
    if (dbErr) throw dbErr

    // 2. URL firmada del adjunto (válida 7 días)
    let adjuntoSignedUrl = null
    if (adjunto_url) {
      const { data } = await sb.storage
        .from('private-uploads')
        .createSignedUrl(adjunto_url, 60 * 60 * 24 * 7)
      adjuntoSignedUrl = data?.signedUrl || null
    }

    // 3. Email (best-effort)
    try {
      const resend = resendClient()
      await resend.emails.send({
        from: process.env.RESEND_FROM,
        to: [process.env.CONTACT_TO_EMAIL],
        replyTo: email.trim(),
        subject: `[Web] Solicitud de presupuesto de ${nombre.trim()}`,
        html: buildConfiguradorEmail({ nombre, empresa, email, telefono, configuracion, tipos_trabajo, sector, ubicacion, plazo, adjuntoSignedUrl }),
      })
    } catch (emailErr) {
      console.error('[api/configurador] Email failed (non-critical):', emailErr.message)
    }

    return res.status(200).json({ ok: true })
  } catch (e) {
    console.error('[api/configurador]', e)
    return serverError(res, 'No se pudo enviar la solicitud. Inténtalo de nuevo.')
  }
}

function buildConfiguradorEmail({ nombre, empresa, email, telefono, configuracion, tipos_trabajo, sector, ubicacion, plazo, adjuntoSignedUrl }) {
  const tiposLabel = (Array.isArray(tipos_trabajo) ? tipos_trabajo : [])
    .map(t => LABEL.tipos[t] || t).join(', ') || '—'

  const fields = [
    ['Nombre', nombre],
    empresa && ['Empresa', empresa],
    ['Email', `<a href="mailto:${esc(email)}" style="color:#b8860b">${esc(email)}</a>`],
    telefono && ['Teléfono', `<a href="tel:${esc(telefono)}" style="color:#b8860b">${esc(telefono)}</a>`],
    ['Tipo de trabajo', tiposLabel],
    sector && ['Sector', LABEL.sector[sector] || sector],
    ubicacion && ['Ubicación', ubicacion],
    plazo && ['Plazo', LABEL.plazo[plazo] || plazo],
  ]
    .filter(Boolean)
    .map(([label, value]) => `
      <tr>
        <td style="padding:9px 12px;background:#f5f5f5;font-size:13px;color:#666;width:160px;white-space:nowrap">${label}</td>
        <td style="padding:9px 12px;font-size:13px;color:#1a1a1a">${typeof value === 'string' && !value.includes('<a') ? esc(value) : value}</td>
      </tr>`)
    .join('')

  // Resumen técnico de la configuración
  const technicalRows = buildTechnicalRows(configuracion)

  const adjuntoBlock = adjuntoSignedUrl
    ? `<div style="margin-top:20px"><a href="${esc(adjuntoSignedUrl)}" style="display:inline-block;background:#1a4a8e;color:#fff;padding:11px 20px;text-decoration:none;border-radius:4px;font-size:13px">Descargar adjunto (planos/fotos, válido 7 días)</a></div>`
    : ''

  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f0f0f0;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:6px;overflow:hidden;border:1px solid #ddd">
  <tr><td style="background:#0a0a0a;padding:24px 28px">
    <p style="margin:0 0 4px;color:#b8860b;font-size:11px;letter-spacing:.1em;text-transform:uppercase">FRICAL CALORIFUGADOS, S.L. — CONFIGURADOR</p>
    <h1 style="margin:0;color:#fff;font-size:18px;font-weight:600">Nueva solicitud de presupuesto</h1>
  </td></tr>
  <tr><td style="padding:28px">
    <h2 style="margin:0 0 16px;font-size:14px;text-transform:uppercase;letter-spacing:.06em;color:#555">Datos de contacto</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e0e0e0">
      ${fields}
    </table>
    ${technicalRows ? `
    <h2 style="margin:28px 0 16px;font-size:14px;text-transform:uppercase;letter-spacing:.06em;color:#555">Configuración técnica</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e0e0e0">
      ${technicalRows}
    </table>` : ''}
    ${adjuntoBlock}
    <div style="margin-top:24px">
      <a href="mailto:${esc(email)}?subject=Tu presupuesto FRICAL" style="display:inline-block;background:#0a0a0a;color:#fff;padding:12px 22px;text-decoration:none;border-radius:4px;font-size:13px">Responder a ${esc(nombre)}</a>
    </div>
  </td></tr>
  <tr><td style="padding:16px 28px;border-top:1px solid #eee;background:#fafafa">
    <p style="margin:0;font-size:11px;color:#aaa;text-align:center">Solicitud recibida desde el configurador de fricalcalorifugados.com</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`
}

function buildTechnicalRows(cfg) {
  const map = {
    'temperaturaAislamiento': ['Temperatura (aislamiento)', LABEL.temperatura],
    'materialAislamiento': ['Material (aislamiento)', LABEL.material],
    'acabadoAislamiento': ['Acabado (aislamiento)', LABEL.acabado],
    'temperaturaCalorifugado': ['Temperatura (calorifugado)', LABEL.temperatura],
    'materialCalorifugado': ['Material (calorifugado)', LABEL.material],
    'acabadoCalorifugado': ['Acabado (calorifugado)', LABEL.acabado],
    'tipoEquipo': ['Tipo de equipo', { deposito: 'Depósito', caldera: 'Caldera', intercambiador: 'Intercambiador', valvulas: 'Válvulas y bridas', otro: 'Otro' }],
    'metrosLineales': ['Metros lineales', null],
    'grosorAislamiento': ['Espesor aislamiento', null],
    'dimensiones': ['Dimensiones equipo', null],
    'tipoConducto': ['Tipo conducto', { extraccion: 'Extracción', impulsion: 'Impulsión', climatizacion: 'Climatización', retorno: 'Retorno' }],
    'materialConducto': ['Material conducto', { galvanizado: 'Galvanizado', inoxidable: 'Inoxidable AISI 304' }],
    'metrosConducto': ['Metros conducto', null],
  }

  return Object.entries(map)
    .filter(([key]) => cfg[key] !== undefined && cfg[key] !== null && cfg[key] !== '')
    .map(([key, [label, labels]]) => {
      const raw = cfg[key]
      const value = labels ? (labels[raw] || raw) : raw
      return `<tr>
        <td style="padding:8px 12px;background:#f5f5f5;font-size:13px;color:#666;width:200px">${label}</td>
        <td style="padding:8px 12px;font-size:13px;color:#1a1a1a">${esc(String(value))}</td>
      </tr>`
    })
    .join('')
}
