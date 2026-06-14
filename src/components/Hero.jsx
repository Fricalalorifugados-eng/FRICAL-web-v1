import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import styles from './Hero.module.css'

const STATS = [
  { prefix: '+', value: 25, suffix: ' años', label: 'de experiencia en el sector' },
  { prefix: '+', value: 1000, suffix: '', label: 'proyectos completados' },
  { isText: true, text: ['Servicio', 'Integral'], label: 'diseño, instalación y mantenimiento' },
]

export default function Hero() {
  const sectionRef = useRef(null)
  const eyebrowRef = useRef(null)
  const line1Ref = useRef(null)
  const line2Ref = useRef(null)
  const line3Ref = useRef(null)
  const subtitleRef = useRef(null)
  const ctasRef = useRef(null)
  const statsRef = useRef(null)
  const counter1Ref = useRef(null)
  const counter2Ref = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.6 })

      tl.from(eyebrowRef.current, {
        y: 16,
        opacity: 0,
        duration: 0.55,
        ease: 'power3.out',
      })
        .from([line1Ref.current, line2Ref.current, line3Ref.current], {
          y: 80,
          opacity: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power4.out',
        }, '-=0.25')
        .from(subtitleRef.current, {
          y: 24,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
        }, '-=0.5')
        .from(ctasRef.current.children, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
        }, '-=0.4')
        .from(statsRef.current.children, {
          y: 28,
          opacity: 0,
          duration: 0.5,
          stagger: 0.12,
          ease: 'power3.out',
        }, '-=0.3')

      const runCounter = (ref, target) => {
        const obj = { v: 0 }
        gsap.to(obj, {
          v: target,
          duration: 2.2,
          ease: 'power2.out',
          delay: 1.4,
          onUpdate() {
            if (!ref.current) return
            const rounded = Math.round(obj.v)
            ref.current.textContent =
              rounded >= 1000 ? rounded.toLocaleString('es') : rounded
          },
        })
      }

      runCounter(counter1Ref, 25)
      runCounter(counter2Ref, 1000)
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="inicio" ref={sectionRef} className={styles.hero} aria-label="Presentación de FRICAL">
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.glowLeft} aria-hidden="true" />
      <div className={styles.glowRight} aria-hidden="true" />

      <div className={`container ${styles.content}`}>
        <span ref={eyebrowRef} className="section-eyebrow">
          Especialistas en aislamiento térmico industrial
        </span>

        <h1 className={styles.headline}>
          <span ref={line1Ref} className={styles.line}>
            Calorifugado y aislamiento
          </span>
          <span ref={line2Ref} className={styles.line}>
            para máxima{' '}
            <em className={styles.accent}>EFICIENCIA</em>
          </span>
          <span ref={line3Ref} className={styles.line}>
            en tu instalación
          </span>
        </h1>

        <p ref={subtitleRef} className={styles.subtitle}>
          Desde el calorifugado de tuberías y depósitos hasta redes de ventilación y
          climatización industrial — FRICAL ejecuta proyectos integrales con más de 25
          años de rigor técnico en Barcelona y su área metropolitana.
        </p>

        <div ref={ctasRef} className={styles.ctas}>
          <a href="#contacto" className="btn-primary" onClick={(e) => {
            e.preventDefault()
            document.querySelector('#contacto')?.scrollIntoView({ behavior: 'smooth' })
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Solicitar presupuesto
          </a>
          <a href="#proyectos" className="btn-secondary" onClick={(e) => {
            e.preventDefault()
            document.querySelector('#proyectos')?.scrollIntoView({ behavior: 'smooth' })
          }}>
            Ver proyectos
          </a>
        </div>

        <div ref={statsRef} className={styles.stats} aria-label="Cifras clave">
          <div className={styles.stat}>
            <div className={styles.statVal}>
              <span className={styles.statPrefix}>+</span>
              <span ref={counter1Ref} className={styles.statNum}>25</span>
              <span className={styles.statSuf}> años</span>
            </div>
            <p className={styles.statLabel}>de experiencia en el sector</p>
          </div>

          <div className={styles.statDivider} aria-hidden="true" />

          <div className={styles.stat}>
            <div className={styles.statVal}>
              <span className={styles.statPrefix}>+</span>
              <span ref={counter2Ref} className={styles.statNum}>1.000</span>
            </div>
            <p className={styles.statLabel}>proyectos completados</p>
          </div>

          <div className={styles.statDivider} aria-hidden="true" />

          <div className={styles.stat}>
            <div className={styles.statVal}>
              <span className={styles.statStack}>
                <span>Servicio</span>
                <span>Integral</span>
              </span>
            </div>
            <p className={styles.statLabel}>diseño, instalación y mantenimiento</p>
          </div>
        </div>
      </div>

      <div className={styles.scrollHint} aria-hidden="true">
        <div className={styles.scrollLine} />
      </div>
    </section>
  )
}
