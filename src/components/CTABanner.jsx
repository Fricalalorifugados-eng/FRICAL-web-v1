import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Phone } from 'lucide-react'
import { contacto } from '../data/contacto'
import styles from './CTABanner.module.css'

export default function CTABanner() {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      gsap.from(contentRef.current.children, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby="cta-title">
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.bgGrid} />
        <div className={styles.bgGlow} />
      </div>
      <div className="container">
        <div ref={contentRef} className={styles.content}>
          <span className={styles.eyebrow}>¿Tienes un proyecto?</span>
          <h2 id="cta-title" className={styles.title}>
            ¿Necesitas aislar tu instalación?
          </h2>
          <p className={styles.subtitle}>
            Cuéntanos tu proyecto y te preparamos un presupuesto detallado sin compromiso
            en menos de 72 horas.
          </p>
          <div className={styles.actions}>
            <Link to="/configurador" className="btn-primary">
              <ArrowRight size={16} aria-hidden="true" />
              Solicitar presupuesto gratuito
            </Link>
            <a href={`tel:${contacto.telefono.replace(/\s/g, '')}`} className="btn-secondary">
              <Phone size={16} aria-hidden="true" />
              Llamar ahora
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
