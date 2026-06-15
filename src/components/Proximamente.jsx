import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useProximos } from '../hooks/useContent'
import styles from './Proximamente.module.css'

const CAT_COLORS = {
  Aislamiento: '#7ed957',
  Conductos:   '#5bbfe8',
  Climatización: '#e8a95b',
}

function ProximoCard({ proyecto }) {
  return (
    <article className={styles.card}>
      <div
        className={styles.imgWrap}
        style={{ background: proyecto.gradiente }}
      >
        {/* Scanlines texture — fondo oscuro con profundidad */}
        <div className={styles.scanlines} aria-hidden="true" />

        {/* "PRÓXIMAMENTE" — protagonista visual centrado */}
        <div className={styles.proximamenteWrap} aria-hidden="true">
          <div className={styles.proximamenteInner}>
            <span className={styles.proximamenteLine} />
            <span className={styles.proximamenteText}>PRÓXIMAMENTE</span>
            <span className={styles.proximamenteLine} />
          </div>
          {/* Barre de luz que cruza el texto */}
          <div className={styles.lightSweep} />
        </div>

        {/* Degradado inferior para legibilidad del texto */}
        <div className={styles.overlay} aria-hidden="true" />

        {/* Contenido: categorías + título + descripción */}
        <div className={styles.content}>
          <div className={styles.textBlock}>
            <div className={styles.cats} aria-label="Categorías">
              {proyecto.categorias.map((c) => (
                <span
                  key={c}
                  className={styles.cat}
                  style={{
                    color: CAT_COLORS[c] || 'var(--frical-green)',
                    borderColor: `${CAT_COLORS[c] || 'var(--frical-green)'}44`,
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
            <h3 className={styles.title}>{proyecto.titulo}</h3>
            <p className={styles.desc}>{proyecto.descripcion}</p>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function Proximamente() {
  const proximos   = useProximos()
  const sectionRef = useRef(null)
  const headerRef  = useRef(null)
  const gridRef    = useRef(null)

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

      gsap.from(gridRef.current.querySelectorAll('article'), {
        y: 60,
        opacity: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="proximamente-title"
    >
      <div className="container">
        <div ref={headerRef} className={styles.header}>
          <span className="section-eyebrow">Lo que viene</span>
          <h2 id="proximamente-title" className="section-title">
            Próximos{' '}
            <span className={styles.accent}>proyectos</span>
          </h2>
          <p className="section-subtitle">
            Obras en curso y proyectos confirmados que incorporaremos próximamente
            a nuestra cartera de trabajos.
          </p>
        </div>

        <div ref={gridRef} className={styles.grid}>
          {proximos.map((p) => (
            <ProximoCard key={p.id} proyecto={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
