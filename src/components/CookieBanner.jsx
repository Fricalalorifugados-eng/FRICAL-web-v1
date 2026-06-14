import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { X } from 'lucide-react'
import { getCookieConsent, setCookieConsent } from '../utils/cookieConsent'
import styles from './CookieBanner.module.css'

const COOKIE_TYPES = [
  {
    id: 'esenciales',
    name: 'Esenciales',
    desc: 'Necesarias para el funcionamiento básico del sitio. No pueden desactivarse.',
    required: true,
  },
  {
    id: 'analiticas',
    name: 'Analíticas',
    desc: 'Nos permiten medir el tráfico y el comportamiento de los visitantes para mejorar el sitio.',
    required: false,
  },
  {
    id: 'marketing',
    name: 'Marketing',
    desc: 'Permiten mostrar publicidad relevante y medir el rendimiento de campañas externas.',
    required: false,
  },
]

function Toggle({ id, checked, disabled, onChange }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={disabled ? undefined : onChange}
      disabled={disabled}
      className={[
        styles.toggle,
        checked ? styles.toggleOn : '',
        disabled ? styles.toggleDisabled : '',
      ].join(' ')}
    >
      <span className={styles.toggleThumb} aria-hidden="true" />
      <span className={styles.srOnly}>{checked ? 'activado' : 'desactivado'}</span>
    </button>
  )
}

export default function CookieBanner() {
  const [show, setShow] = useState(false)
  const [configOpen, setConfigOpen] = useState(false)
  const [prefs, setPrefs] = useState({ analiticas: false, marketing: false })
  const bannerRef   = useRef(null)
  const modalRef    = useRef(null)
  const triggerRef  = useRef(null)  // button that opened the modal, to restore focus

  // Show banner only if no prior consent
  useEffect(() => {
    if (!getCookieConsent()) setShow(true)
  }, [])

  // Slide-up entrance animation
  useEffect(() => {
    if (!show || !bannerRef.current) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    gsap.fromTo(
      bannerRef.current,
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', delay: 0.9 },
    )
  }, [show])

  // Focus trap + Esc inside modal
  useEffect(() => {
    if (!configOpen || !modalRef.current) return

    const modal = modalRef.current
    const getFocusable = () =>
      [...modal.querySelectorAll(
        'button:not([disabled]), [href], input, [tabindex]:not([tabindex="-1"])',
      )]

    setTimeout(() => getFocusable()[0]?.focus(), 40)

    const handleKey = (e) => {
      if (e.key === 'Escape') { closeConfig(); return }
      if (e.key !== 'Tab') return
      const nodes = getFocusable()
      const first = nodes[0]
      const last  = nodes[nodes.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus() }
      }
    }

    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [configOpen])

  const openConfig = (e) => {
    triggerRef.current = e.currentTarget
    setConfigOpen(true)
  }

  const closeConfig = () => {
    setConfigOpen(false)
    setTimeout(() => triggerRef.current?.focus(), 40)
  }

  const saveAndHide = (newPrefs) => {
    setCookieConsent(newPrefs)
    setConfigOpen(false)
    setShow(false)
  }

  const acceptAll  = () => saveAndHide({ analiticas: true,  marketing: true  })
  const rejectAll  = () => saveAndHide({ analiticas: false, marketing: false })
  const savePrefs  = () => saveAndHide(prefs)

  const togglePref = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }))

  if (!show) return null

  return (
    <>
      {/* ── Cookie banner ───────────────────────────────── */}
      <div
        ref={bannerRef}
        role="region"
        aria-label="Aviso de cookies"
        className={styles.banner}
      >
        <div className={styles.inner}>
          <p className={styles.text}>
            Usamos cookies propias y de terceros para mejorar tu experiencia y analizar el
            tráfico. Puedes gestionar tus preferencias o consultar nuestra{' '}
            <Link to="/politica-de-cookies" className={styles.textLink}>
              política de cookies
            </Link>
            .
          </p>

          <div className={styles.actions}>
            <button onClick={openConfig} className={styles.btnSecondary}>
              Configurar
            </button>
            <button onClick={rejectAll} className={styles.btnSecondary}>
              Rechazar
            </button>
            <button onClick={acceptAll} className={styles.btnAccept}>
              Aceptar todas
            </button>
          </div>
        </div>
      </div>

      {/* ── Configuration modal ─────────────────────────── */}
      {configOpen && (
        <div
          className={styles.overlay}
          role="presentation"
          onClick={(e) => { if (e.target === e.currentTarget) closeConfig() }}
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-modal-title"
            className={styles.modal}
          >
            {/* Header */}
            <div className={styles.modalHeader}>
              <h2 id="cookie-modal-title" className={styles.modalTitle}>
                Preferencias de cookies
              </h2>
              <button
                onClick={closeConfig}
                className={styles.closeBtn}
                aria-label="Cerrar configuración de cookies"
              >
                <X size={16} strokeWidth={1.8} aria-hidden="true" />
              </button>
            </div>

            <p className={styles.modalIntro}>
              Elige qué tipos de cookies permites. Las cookies esenciales siempre están activas
              para garantizar el funcionamiento del sitio.
            </p>

            {/* Cookie type list */}
            <ul className={styles.cookieList}>
              {COOKIE_TYPES.map(({ id, name, desc, required }) => (
                <li key={id} className={styles.cookieItem}>
                  <div className={styles.cookieInfo}>
                    <span className={styles.cookieName}>{name}</span>
                    <span className={styles.cookieDesc}>{desc}</span>
                    {required && (
                      <span className={styles.cookieBadge}>Siempre activas</span>
                    )}
                  </div>
                  <Toggle
                    id={`toggle-${id}`}
                    checked={required ? true : (prefs[id] ?? false)}
                    disabled={required}
                    onChange={() => togglePref(id)}
                  />
                </li>
              ))}
            </ul>

            {/* Modal actions */}
            <div className={styles.modalActions}>
              <button onClick={closeConfig} className={styles.btnSecondary}>
                Cancelar
              </button>
              <button onClick={savePrefs} className={styles.btnAccept}>
                Guardar preferencias
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
