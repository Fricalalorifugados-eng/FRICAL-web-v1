import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Users, HardHat, Layers, Star, Upload, Send, CheckCircle, Briefcase, Loader2 } from 'lucide-react'
import { useSeo } from '../hooks/useSeo'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'
import { vacantes, puestosInteres } from '../data/empleo'
import { Check } from 'lucide-react'
import { supabase } from '../lib/supabase'
import styles from './TrabajaConNosotros.module.css'

// ─── Beneficios ───────────────────────────────────────────────────────────────
const BENEFICIOS = [
  {
    icon: Users,
    title: 'Equipo propio y estable',
    desc: 'No trabajamos con subcontratas. Somos un equipo consolidado de técnicos especializados que llevan años ejecutando proyectos juntos.',
  },
  {
    icon: HardHat,
    title: 'Formación técnica continua',
    desc: 'Cada nuevo material, normativa o técnica de instalación la aprendemos y la compartimos. Aquí nadie se queda atrás.',
  },
  {
    icon: Layers,
    title: 'Proyectos técnicos variados',
    desc: 'Un día en una planta química, al siguiente en un edificio de oficinas. La diversidad de proyectos es constante y enriquecedora.',
  },
  {
    icon: Star,
    title: 'Buen ambiente de trabajo',
    desc: 'Lo dicen los que llevan más de diez años con nosotros. El respeto, la comunicación directa y el compañerismo definen cómo trabajamos.',
  },
]

// ─── Formulario initial state ─────────────────────────────────────────────────
const INITIAL_FORM = {
  nombre: '', email: '', telefono: '',
  puesto: '', mensaje: '', cv: null, privacidad: false,
}

// status: 'idle' | 'uploading' | 'sending' | 'sent' | 'error'
export default function TrabajaConNosotros() {
  useSeo({
    title: 'Trabaja con nosotros | FRICAL CALORIFUGADOS, S.L.',
    description: 'Únete al equipo de FRICAL. Técnicos especializados en aislamiento térmico industrial, buen ambiente, proyectos variados en Barcelona y área metropolitana. Consulta nuestras vacantes.',
    url: 'https://fricalcalorifugados.com/trabaja-con-nosotros',
  })

  const heroRef  = useRef(null)
  const benRef   = useRef(null)
  const vacRef   = useRef(null)
  const formRef  = useRef(null)

  const [form, setForm] = useState(INITIAL_FORM)
  const [status, setStatus]   = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      gsap.from(heroRef.current?.querySelectorAll('[data-anim]') || [], {
        y: 40, opacity: 0, duration: 0.75, stagger: 0.1, ease: 'power3.out',
      })
      gsap.from(benRef.current?.querySelectorAll('[data-card]') || [], {
        y: 40, opacity: 0, duration: 0.65, stagger: 0.1, ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: benRef.current, start: 'top 80%' },
      })
      gsap.from(vacRef.current, {
        y: 30, opacity: 0, duration: 0.65, ease: 'power3.out',
        scrollTrigger: { trigger: vacRef.current, start: 'top 82%' },
      })
      gsap.from(formRef.current, {
        y: 30, opacity: 0, duration: 0.65, ease: 'power3.out',
        scrollTrigger: { trigger: formRef.current, start: 'top 82%' },
      })
    })

    return () => ctx.revert()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] || null : value,
    }))
  }

  const scrollToForm = (puesto = '') => {
    if (puesto) setForm(f => ({ ...f, puesto }))
    document.getElementById('candidatura')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    const emailTrimmed = form.email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      setStatus('error')
      setErrorMsg('El email no tiene un formato válido.')
      return
    }

    let cv_url = ''

    // 1. Subir CV si existe
    if (form.cv) {
      setStatus('uploading')
      const safeName = form.cv.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const path = `cvs/${Date.now()}-${safeName}`
      const { error: upErr } = await supabase.storage
        .from('private-uploads')
        .upload(path, form.cv, { contentType: form.cv.type })
      if (upErr) {
        setStatus('error')
        setErrorMsg('No se pudo subir el CV. Comprueba tu conexión e inténtalo de nuevo.')
        return
      }
      cv_url = path
    }

    // 2. Enviar candidatura
    setStatus('sending')
    try {
      const res = await fetch('/api/empleo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre:         form.nombre.trim(),
          email:          emailTrimmed,
          telefono:       form.telefono.trim(),
          puesto_interes: form.puesto,
          mensaje:        form.mensaje.trim(),
          cv_url,
        }),
      })
      let data = {}
      try { data = await res.json() } catch { /* API no corriendo */ }
      if (!res.ok) throw new Error(data.error || `Error del servidor (${res.status}).`)
      setStatus('sent')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message || 'No se pudo enviar la candidatura. Inténtalo de nuevo.')
    }
  }

  const busy = status === 'uploading' || status === 'sending'
  const btnLabel = status === 'uploading' ? 'Subiendo CV...' : status === 'sending' ? 'Enviando...' : 'Enviar candidatura'

  return (
    <>
      <Navbar />
      <main className={styles.page}>

        {/* ── Hero ───────────────────────────────────────────────────────────── */}
        <section className={styles.hero}>
          <div className="container">
            <nav className={styles.breadcrumb} aria-label="Migas de pan">
              <Link to="/">Inicio</Link>
              <span aria-hidden="true">›</span>
              <span>Trabaja con nosotros</span>
            </nav>

            <div ref={heroRef} className={styles.heroInner}>
              <div>
                <span className={styles.eyebrow} data-anim>Únete al equipo</span>
                <h1 className={styles.heroTitle} data-anim>
                  Trabaja en FRICAL,<br />
                  <span className={styles.accent}>haz algo que dura</span>
                </h1>
                <p className={styles.heroDesc} data-anim>
                  Somos un equipo propio de técnicos especializados en aislamiento térmico
                  industrial. Nuestros proyectos son exigentes, variados y técnicamente
                  estimulantes — de plantas químicas a edificios singulares en Barcelona
                  y su área metropolitana.
                </p>
                <div className={styles.heroActions} data-anim>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => scrollToForm()}
                  >
                    <Send size={15} aria-hidden="true" />
                    Enviar candidatura
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => document.getElementById('vacantes')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Ver vacantes
                  </button>
                </div>
              </div>

              <div className={styles.heroBadges} data-anim>
                {[
                  { icon: Users, title: 'Equipo propio', sub: 'Sin subcontratas' },
                  { icon: Star, title: '25+ años', sub: 'De historia y oficio' },
                  { icon: Briefcase, title: 'Barcelona', sub: 'Área metropolitana' },
                ].map(({ icon: Icon, title, sub }) => (
                  <div key={title} className={styles.heroBadge}>
                    <div className={styles.heroBadgeIcon}>
                      <Icon size={20} aria-hidden="true" />
                    </div>
                    <div>
                      <div className={styles.heroBadgeText}>{title}</div>
                      <div className={styles.heroBadgeSub}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Por qué FRICAL ─────────────────────────────────────────────────── */}
        <section className={styles.benSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className="section-eyebrow">Por qué elegirnos</span>
              <h2 className="section-title">
                Un lugar donde tu trabajo{' '}
                <span className={styles.accent}>importa de verdad</span>
              </h2>
            </div>
            <div ref={benRef} className={styles.benGrid}>
              {BENEFICIOS.map(({ icon: Icon, title, desc }) => (
                <article key={title} className={styles.benCard} data-card>
                  <div className={styles.benIcon}>
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <h3 className={styles.benTitle}>{title}</h3>
                  <p className={styles.benDesc}>{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Vacantes ───────────────────────────────────────────────────────── */}
        <section id="vacantes" className={styles.vacSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className="section-eyebrow">Vacantes actuales</span>
              <h2 className="section-title">
                Posiciones <span className={styles.accent}>abiertas</span>
              </h2>
            </div>

            <div ref={vacRef}>
              {vacantes.length === 0 ? (
                <div className={styles.vacEmpty}>
                  <div className={styles.vacEmptyIcon}>
                    <Briefcase size={28} aria-hidden="true" />
                  </div>
                  <h3 className={styles.vacEmptyTitle}>
                    No hay vacantes abiertas ahora mismo
                  </h3>
                  <p className={styles.vacEmptyDesc}>
                    Pero siempre queremos conocer buen talento. Envíanos tu CV y te
                    tendremos en cuenta para futuros proyectos.
                  </p>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => scrollToForm()}
                  >
                    <Send size={15} aria-hidden="true" />
                    Enviar candidatura espontánea
                  </button>
                </div>
              ) : (
                <div className={styles.vacGrid}>
                  {vacantes.map((v) => (
                    <article key={v.id} className={styles.vacCard}>
                      <div>
                        <h3 className={styles.vacPuesto}>{v.puesto}</h3>
                        <div className={styles.vacMeta}>
                          <span className={styles.vacTag}>{v.tipo}</span>
                          <span className={styles.vacTag}>{v.ubicacion}</span>
                        </div>
                        <p className={styles.vacDesc}>{v.descripcion}</p>
                        {v.requisitos?.length > 0 && (
                          <ul className={styles.vacReqs} aria-label="Requisitos">
                            {v.requisitos.map((r, i) => (
                              <li key={i} className={styles.vacReq}>
                                <Check size={12} className={styles.vacReqIcon} aria-hidden="true" />
                                {r}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => scrollToForm(v.puesto)}
                      >
                        Solicitar
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Formulario candidatura ──────────────────────────────────────────── */}
        <section id="candidatura" className={styles.formSection}>
          <div className="container">
            <div ref={formRef} className={styles.formCard}>
              {status === 'sent' ? (
                <div className={styles.successMsg} role="status">
                  <div className={styles.successIcon}>
                    <CheckCircle size={36} aria-hidden="true" />
                  </div>
                  <h2 className={styles.successTitle}>¡Candidatura recibida!</h2>
                  <p className={styles.successDesc}>
                    Hemos recibido tu solicitud. Revisaremos tu perfil y nos pondremos en
                    contacto contigo si encaja con nuestras necesidades actuales o futuras.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className={styles.formTitle}>Envíanos tu candidatura</h2>
                  <p className={styles.formSub}>
                    Rellena el formulario y adjunta tu CV. Estudiamos todas las candidaturas
                    con atención, aunque no haya vacantes abiertas en este momento.
                  </p>

                  <form onSubmit={handleSubmit} className={styles.form} aria-label="Formulario de candidatura" noValidate>
                    <div className={styles.formRow}>
                      <div className={styles.field}>
                        <label htmlFor="tc-nombre" className={styles.label}>
                          Nombre completo <span aria-hidden="true">*</span>
                        </label>
                        <input
                          id="tc-nombre" name="nombre" type="text" required
                          autoComplete="name"
                          className={styles.input}
                          placeholder="Tu nombre completo"
                          value={form.nombre}
                          onChange={handleChange}
                          disabled={busy}
                        />
                      </div>
                      <div className={styles.field}>
                        <label htmlFor="tc-email" className={styles.label}>
                          Email <span aria-hidden="true">*</span>
                        </label>
                        <input
                          id="tc-email" name="email" type="text" inputMode="email"
                          autoComplete="email"
                          className={styles.input}
                          placeholder="tu@email.com"
                          value={form.email}
                          onChange={handleChange}
                          disabled={busy}
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.field}>
                        <label htmlFor="tc-tel" className={styles.label}>Teléfono</label>
                        <input
                          id="tc-tel" name="telefono" type="text" inputMode="tel"
                          autoComplete="tel"
                          className={styles.input}
                          placeholder="+34 600 000 000"
                          value={form.telefono}
                          onChange={handleChange}
                          disabled={busy}
                        />
                      </div>
                      <div className={styles.field}>
                        <label htmlFor="tc-puesto" className={styles.label}>
                          Puesto de interés <span aria-hidden="true">*</span>
                        </label>
                        <select
                          id="tc-puesto" name="puesto" required
                          className={styles.select}
                          value={form.puesto}
                          onChange={handleChange}
                          disabled={busy}
                        >
                          <option value="">Selecciona un puesto</option>
                          {puestosInteres.map(p => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className={styles.field}>
                      <label htmlFor="tc-mensaje" className={styles.label}>
                        Cuéntanos sobre ti <span aria-hidden="true">*</span>
                      </label>
                      <textarea
                        id="tc-mensaje" name="mensaje" required rows={4}
                        className={styles.textarea}
                        placeholder="Experiencia, habilidades, por qué quieres trabajar en FRICAL..."
                        value={form.mensaje}
                        onChange={handleChange}
                        disabled={busy}
                      />
                    </div>

                    <div className={styles.fileWrap}>
                      <span className={styles.label}>Adjuntar CV</span>
                      <label htmlFor="tc-cv" className={`${styles.fileLabel} ${busy ? styles.fileLabelDisabled : ''}`}>
                        <Upload size={18} className={styles.fileLabelIcon} aria-hidden="true" />
                        {form.cv
                          ? <span className={styles.fileName}>{form.cv.name}</span>
                          : <span>Haz clic para seleccionar tu CV</span>
                        }
                      </label>
                      <input
                        id="tc-cv" name="cv" type="file"
                        accept=".pdf,.doc,.docx"
                        className={styles.fileInput}
                        onChange={handleChange}
                        disabled={busy}
                      />
                      <span className={styles.fileHint}>PDF, DOC o DOCX — máx. 10 MB</span>
                    </div>

                    <div className={styles.checkRow}>
                      <input
                        id="tc-privacidad" name="privacidad" type="checkbox" required
                        className={styles.checkbox}
                        checked={form.privacidad}
                        onChange={handleChange}
                        disabled={busy}
                      />
                      <label htmlFor="tc-privacidad" className={styles.checkLabel}>
                        He leído y acepto la{' '}
                        <a
                          href="/politica-de-privacidad"
                          className={styles.legalLink}
                          target="_blank"
                          rel="noopener"
                        >
                          política de privacidad
                        </a>
                        <span aria-hidden="true"> *</span>
                      </label>
                    </div>

                    {status === 'error' && (
                      <p role="alert" style={{ color: '#e53935', fontSize: '13px', margin: '0 0 4px' }}>
                        {errorMsg}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={busy || !form.nombre || !form.email || !form.puesto || !form.mensaje || !form.privacidad}
                    >
                      {busy
                        ? <><Loader2 size={15} strokeWidth={1.8} style={{ animation: 'spin 1s linear infinite' }} aria-hidden="true" /> {btnLabel}</>
                        : <><Send size={15} aria-hidden="true" /> Enviar candidatura</>
                      }
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
