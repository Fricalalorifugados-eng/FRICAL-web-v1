import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FlaskConical, Utensils, Zap, Ship, Pill, Building2 } from 'lucide-react'
import { useSectores } from '../hooks/useContent'
import styles from './Sectores.module.css'

const ICONS = {
  quimico:      <FlaskConical size={22} strokeWidth={1.5} aria-hidden="true" />,
  alimentario:  <Utensils    size={22} strokeWidth={1.5} aria-hidden="true" />,
  energetico:   <Zap         size={22} strokeWidth={1.5} aria-hidden="true" />,
  naval:        <Ship        size={22} strokeWidth={1.5} aria-hidden="true" />,
  farmaceutico: <Pill        size={22} strokeWidth={1.5} aria-hidden="true" />,
  edificacion:  <Building2   size={22} strokeWidth={1.5} aria-hidden="true" />,
}

export default function Sectores() {
  const sectores   = useSectores()
  const sectionRef = useRef(null)
  const gridRef    = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      gsap.from(gridRef.current.children, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 82%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby="sectores-title">
      <div className="container">
        <div className={styles.header}>
          <span className="section-eyebrow">Sectores</span>
          <h2 id="sectores-title" className="section-title">
            Industrias donde{' '}
            <span className={styles.accent}>trabajamos</span>
          </h2>
        </div>
        <div ref={gridRef} className={styles.grid}>
          {sectores.map((s) => (
            <div key={s.id} className={styles.chip}>
              <div className={styles.chipIcon}>{ICONS[s.slug || s.id]}</div>
              <div className={styles.chipText}>
                <span className={styles.chipName}>{s.nombre}</span>
                <span className={styles.chipDesc}>{s.descripcion}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
