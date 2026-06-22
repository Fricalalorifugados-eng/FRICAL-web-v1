import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useProyectos } from '../hooks/useContent'
import styles from './Proyectos.module.css'

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const CAT_COLORS = {
  Aislamiento: '#6FCB6F',
  Conductos: '#5bbfe8',
  Climatización: '#e8a95b',
}

function ProyectoCard({ p }) {
  const mes = MESES[p.fecha.mes - 1]

  // CSS multi-layer: photo on top, gradient as fallback underneath.
  // If photo fails to load the browser silently shows the gradient — no JS error state needed.
  const bgStyle = p.imagen
    ? {
        backgroundImage: `url('${p.imagen}'), ${p.gradiente}`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : { background: p.gradiente }

  return (
    <article className={styles.card}>
      <div
        className={styles.cardImage}
        style={bgStyle}
        role="img"
        aria-label={`Imagen del proyecto: ${p.titulo}`}
      >
        {/* Subtle dark scrim so the date badge stays readable over bright photos */}
        <div className={styles.cardScrim} aria-hidden="true" />

        {/* Acento glow */}
        <div
          className={styles.imageGlow}
          style={{ background: `radial-gradient(circle at 30% 40%, ${p.acento} 0%, transparent 65%)` }}
          aria-hidden="true"
        />
        <div className={styles.imagePipes} aria-hidden="true">
          <div className={styles.pipe} />
          <div className={styles.pipe} />
          <div className={styles.pipe} />
        </div>

        <div
          className={styles.dateBadge}
          aria-label={`Fecha: ${p.fecha.dia} de ${mes} de ${p.fecha.anyo}`}
        >
          <span className={styles.dateDay}>{p.fecha.dia}</span>
          <span className={styles.dateMon}>{mes}</span>
          <span className={styles.dateYear}>{p.fecha.anyo}</span>
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cats} aria-label="Categorías">
          {p.categorias.map((c) => (
            <span
              key={c}
              className={styles.cat}
              style={{
                color: CAT_COLORS[c] || 'var(--frical-green)',
                borderColor: `${CAT_COLORS[c] || 'var(--frical-green)'}33`,
              }}
            >
              {c}
            </span>
          ))}
        </div>
        <h3 className={styles.cardTitle}>{p.titulo}</h3>
        <p className={styles.cardDesc}>{p.descripcion}</p>
      </div>
    </article>
  )
}

export default function Proyectos() {
  const proyectos  = useProyectos()
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
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="proyectos" ref={sectionRef} className={styles.section}>
      <div className="container">
        <div ref={headerRef} className={styles.header}>
          <span className="section-eyebrow">Proyectos</span>
          <h2 className="section-title">
            Trabajos recientes{' '}
            <span className={styles.accent}>de FRICAL</span>
          </h2>
          <p className="section-subtitle">
            Una selección de proyectos de aislamiento, conductos y climatización
            realizados en los últimos años en Barcelona y su área metropolitana.
          </p>
        </div>

        <div ref={gridRef} className={styles.grid}>
          {proyectos.map((p) => (
            <ProyectoCard key={p.id} p={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
