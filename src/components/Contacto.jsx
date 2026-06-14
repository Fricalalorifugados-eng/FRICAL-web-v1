import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'
import { contacto } from '../data/contacto'
import { IconTelefono, IconEmail, IconLocation, IconClock } from './Icons'
import styles from './Contacto.module.css'

// TODO (Fase 2): sustituir el mailto: por una llamada POST a /api/contacto
// que envíe el mensaje directamente desde el servidor (Resend / Nodemailer).
// El flujo actual abre el gestor de correo del usuario como fallback.

const SERVICIOS_OPCIONES = [
  { value: '', label: 'Selecciona un servicio' },
  { value: 'aislamiento', label: 'Aislamiento y Calorifugado' },
  { value: 'conductos', label: 'Conductos de Ventilación' },
  { value: 'climatizacion', label: 'Climatización Industrial' },
  { value: 'otro', label: 'Otro / No sé aún' },
]

export default function Contacto({ servicioInicial = '', compact = false }) {
  const sectionRef = useRef(null)
  const leftRef    = useRef(null)
  const rightRef   = useRef(null)

  const [form, setForm] = useState({
    nombre:     '',
    email:      '',
    telefono:   '',
    servicio:   servicioInicial,
    mensaje:    '',
    privacidad: false,
  })
  const [sent, setSent] = useState(false)

  useEffect(() => {
    setForm((prev) => ({ ...prev, servicio: servicioInicial }))
  }, [servicioInicial])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      if (!compact && leftRef.current) {
        gsap.from(leftRef.current.children, {
          x: -40,
          opacity: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
        })
      }
      if (rightRef.current) {
        gsap.from(rightRef.current, {
          x: compact ? 0 : 40,
          y: compact ? 30 : 0,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [compact])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  // TODO (Fase 2): reemplazar por POST /api/contacto → envío real desde servidor.
  // Por ahora abre el gestor de correo del usuario con los datos prefilled.
  const handleSubmit = (e) => {
    e.preventDefault()

    const servicioLabel =
      SERVICIOS_OPCIONES.find((o) => o.value === form.servicio)?.label || form.servicio || 'No especificado'

    const subject = encodeURIComponent(`Solicitud de presupuesto — ${servicioLabel}`)
    const body = encodeURIComponent(
      `Nombre: ${form.nombre}\n` +
      `Email: ${form.email}\n` +
      `Teléfono: ${form.telefono || 'No facilitado'}\n` +
      `Servicio: ${servicioLabel}\n\n` +
      `Mensaje:\n${form.mensaje}`
    )

    window.location.href = `mailto:${contacto.email}?subject=${subject}&body=${body}`
    setSent(true)
  }

  const formBlock = (
    <div ref={rightRef} className={`${styles.right} ${compact ? styles.rightCompact : ''}`}>
      {sent ? (
        <div className={styles.successMsg} role="status">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <circle cx="24" cy="24" r="23" stroke="#7ed957" strokeWidth="2" />
            <path d="M14 24l8 8 12-14" stroke="#7ed957" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h3>Mensaje preparado</h3>
          <p>
            Se ha abierto tu gestor de correo con la consulta lista para enviar a{' '}
            <strong>{contacto.email}</strong>. Si prefieres contactarnos directamente,
            llámanos al <a href={`tel:${contacto.telefono.replace(/\s/g, '')}`}>{contacto.telefono}</a>.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form} aria-label="Formulario de contacto" noValidate>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="nombre" className={styles.label}>Nombre <span aria-hidden="true">*</span></label>
              <input id="nombre" name="nombre" type="text" required autoComplete="name" className={styles.input} placeholder="Tu nombre completo" value={form.nombre} onChange={handleChange} />
            </div>
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>Email <span aria-hidden="true">*</span></label>
              <input id="email" name="email" type="email" required autoComplete="email" className={styles.input} placeholder="tu@empresa.com" value={form.email} onChange={handleChange} />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="telefono" className={styles.label}>Teléfono</label>
              <input id="telefono" name="telefono" type="tel" autoComplete="tel" className={styles.input} placeholder="+34 600 000 000" value={form.telefono} onChange={handleChange} />
            </div>
            <div className={styles.field}>
              <label htmlFor="servicio" className={styles.label}>Servicio de interés</label>
              <select id="servicio" name="servicio" className={styles.select} value={form.servicio} onChange={handleChange}>
                {SERVICIOS_OPCIONES.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.field}>
            <label htmlFor="mensaje" className={styles.label}>Mensaje <span aria-hidden="true">*</span></label>
            <textarea id="mensaje" name="mensaje" required rows={4} className={styles.textarea} placeholder="Descríbenos tu instalación y qué necesitas..." value={form.mensaje} onChange={handleChange} />
          </div>
          <div className={styles.checkRow}>
            <input id="privacidad" name="privacidad" type="checkbox" required className={styles.checkbox} checked={form.privacidad} onChange={handleChange} />
            <label htmlFor="privacidad" className={styles.checkLabel}>
              He leído y acepto la{' '}
              <a href="/politica-de-privacidad" className={styles.legalLink} target="_blank" rel="noopener">política de privacidad</a>
              <span aria-hidden="true"> *</span>
            </label>
          </div>
          <button type="submit" className={`btn-primary ${styles.submitBtn}`}>
            Enviar consulta
            <ArrowRight size={16} strokeWidth={1.6} aria-hidden="true" />
          </button>
        </form>
      )}
    </div>
  )

  if (compact) {
    return (
      <section id="contacto" ref={sectionRef} className={`${styles.section} ${styles.sectionCompact}`}>
        <div className="container">
          {formBlock}
        </div>
      </section>
    )
  }

  return (
    <section id="contacto" ref={sectionRef} className={styles.section}>
      <div className="container">
        <div className={styles.inner}>
          <div ref={leftRef} className={styles.left}>
            <span className="section-eyebrow">Contacto</span>
            <h2 className="section-title">
              Hablemos de{' '}
              <span className={styles.accent}>tu proyecto</span>
            </h2>
            <p className={styles.body}>
              Rellena el formulario o contáctanos directamente. Respondemos en menos de
              24 horas en días laborables.
            </p>

            <ul className={styles.infoList}>
              <li className={styles.infoItem}>
                <div className={styles.infoIcon}><IconTelefono /></div>
                <div>
                  <span className={styles.infoLabel}>Teléfonos</span>
                  <a href={`tel:${contacto.telefono.replace(/\s/g, '')}`} className={styles.infoValue}>
                    {contacto.telefono} — Rubén Pérez
                  </a>
                  <a href={`tel:${contacto.telefono2.replace(/\s/g, '')}`} className={`${styles.infoValue} ${styles.infoValue2}`}>
                    {contacto.telefono2} — Sergio Pérez
                  </a>
                </div>
              </li>
              <li className={styles.infoItem}>
                <div className={styles.infoIcon}><IconEmail /></div>
                <div>
                  <span className={styles.infoLabel}>Email</span>
                  <a href={`mailto:${contacto.email}`} className={styles.infoValue}>{contacto.email}</a>
                  <a href={`mailto:${contacto.emailRuben}`} className={`${styles.infoValue} ${styles.infoValue2}`}>{contacto.emailRuben}</a>
                  <a href={`mailto:${contacto.emailSergio}`} className={`${styles.infoValue} ${styles.infoValue2}`}>{contacto.emailSergio}</a>
                </div>
              </li>
              <li className={styles.infoItem}>
                <div className={styles.infoIcon}><IconLocation /></div>
                <div>
                  <span className={styles.infoLabel}>Dirección</span>
                  <span className={styles.infoValue}>{contacto.direccion}</span>
                  <span className={`${styles.infoValue} ${styles.infoValue2}`}>{contacto.zona}</span>
                </div>
              </li>
              <li className={styles.infoItem}>
                <div className={styles.infoIcon}><IconClock /></div>
                <div>
                  <span className={styles.infoLabel}>Horario</span>
                  <span className={styles.infoValue}>{contacto.horario}</span>
                </div>
              </li>
            </ul>
          </div>

          {formBlock}
        </div>
      </div>
    </section>
  )
}
