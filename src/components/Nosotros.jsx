import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Nosotros.module.css'

const PUNTOS = [
  'Equipo propio de técnicos especializados — sin subcontratas',
  'Proyectos en sector químico, alimentario, energético, naval y farmacéutico',
  'Materiales certificados: lana de roca, espuma elastomérica, silicato y PUR',
  'Servicio de mantenimiento y revisión posventa con garantía',
  'Documentación técnica completa: memoria, planos y certificados de material',
]

export default function Nosotros() {
  const sectionRef = useRef(null)
  const textRef = useRef(null)
  const imageRef = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      gsap.from(textRef.current.children, {
        x: -40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      })

      gsap.from(imageRef.current, {
        x: 50,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="nosotros" ref={sectionRef} className={styles.section}>
      <div className="container">
        <div className={styles.inner}>
          <div ref={textRef} className={styles.text}>
            <span className="section-eyebrow">Quiénes somos</span>
            <h2 className="section-title">
              Más de 25 años en aislamiento{' '}
              <span className={styles.accent}>térmico industrial</span>
            </h2>
            <p className={styles.body}>
              FRICAL CALORIFUGADOS, S.L. nació con un objetivo claro: aportar soluciones
              técnicas de aislamiento térmico realmente eficaces para la industria de
              Barcelona y su área metropolitana. Hoy, con un equipo propio consolidado,
              ejecutamos proyectos de cualquier escala — desde una instalación singular
              hasta plantas industriales completas — manteniendo siempre los mismos
              estándares de calidad y seguridad.
            </p>
            <ul className={styles.list} aria-label="Puntos diferenciales">
              {PUNTOS.map((p, i) => (
                <li key={i} className={styles.listItem}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="8" cy="8" r="7" stroke="#7ed957" strokeWidth="1.2" />
                    <path d="M5 8l2.5 2.5L11 5.5" stroke="#7ed957" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {p}
                </li>
              ))}
            </ul>
            <a href="#contacto" className="btn-primary" style={{ marginTop: '36px', display: 'inline-flex' }}
              onClick={(e) => { e.preventDefault(); document.querySelector('#contacto')?.scrollIntoView({ behavior: 'smooth' }) }}>
              Hablar con un técnico
            </a>
          </div>

          <div ref={imageRef} className={styles.imageWrap}>
            <div className={styles.imagePlaceholder} aria-label="Instalación FRICAL en planta industrial">
              <div className={styles.imgPattern} aria-hidden="true" />
              <div className={styles.imgOverlay} aria-hidden="true" />
              <div className={styles.imgLines} aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={styles.imgLine} style={{ top: `${16 + i * 16}%` }} />
                ))}
              </div>
              <div className={styles.imgLabel} aria-hidden="true">
                <span>Instalación</span>
                <span>industrial</span>
              </div>
            </div>

            <div className={styles.badge} aria-label="25 más años de experiencia">
              <span className={styles.badgeNum}>25<span>+</span></span>
              <span className={styles.badgeText}>años de<br />experiencia</span>
            </div>

            <div className={styles.pill} aria-hidden="true">
              <span className={styles.pillDot} />
              Esplugues · Barcelona
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
