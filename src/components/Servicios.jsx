import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ThermometerSun, Wind, Snowflake, ArrowRight } from 'lucide-react'
import { useServicios } from '../hooks/useContent'
import styles from './Servicios.module.css'

const ICONS = {
  aislamiento: ThermometerSun,
  conductos: Wind,
  climatizacion: Snowflake,
}

export default function Servicios() {
  const servicios = useServicios()
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const cardsRef = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      gsap.from(headerRef.current.children, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: headerRef.current, start: 'top 82%' },
      })

      gsap.from(cardsRef.current.children, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: cardsRef.current, start: 'top 80%' },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="servicios" ref={sectionRef} className={styles.section}>
      <div className="container">
        <div ref={headerRef} className={styles.header}>
          <span className="section-eyebrow">Nuestros servicios</span>
          <h2 className="section-title">
            Soluciones técnicas para<br />
            <span className={styles.accent}>instalaciones industriales</span>
          </h2>
          <p className="section-subtitle">
            Ejecutamos proyectos integrales — desde el estudio técnico inicial hasta la
            entrega y el mantenimiento — con nuestro propio equipo especializado.
          </p>
        </div>

        <div ref={cardsRef} className={styles.grid}>
          {servicios.map((s) => {
            const Icon = ICONS[s.slug || s.id]
            return (
              <article
                key={s.id}
                className={`${styles.card} ${s.destacado ? styles.cardDestacado : ''}`}
              >
                {s.imagen_url && (
                  <div
                    className={styles.cardImgZone}
                    style={{ backgroundImage: `url('${s.imagen_url}')` }}
                    aria-hidden="true"
                  />
                )}
                {s.destacado && (
                  <div className={styles.especialidadBadge} aria-label="Servicio principal">
                    ★ Especialidad
                  </div>
                )}
                <div className={styles.cardGlow} aria-hidden="true" />
                {!s.imagen_url && (
                  <div className={styles.iconWrap} aria-hidden="true">
                    {Icon && <Icon size={36} strokeWidth={1.5} aria-hidden="true" />}
                  </div>
                )}
                <h3 className={styles.cardTitle}>{s.titulo}</h3>
                <p className={styles.cardDesc}>{s.descripcion}</p>
                <Link to={s.enlace || '#'} className={styles.cardLink}>
                  Más información
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
