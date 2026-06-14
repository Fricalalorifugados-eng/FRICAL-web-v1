import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Proceso.module.css'

const PASOS = [
  {
    num: '01',
    titulo: 'Visita técnica y estudio',
    descripcion:
      'Desplazamos a un técnico especialista para evaluar in situ la instalación, tomar medidas y definir los materiales y soluciones más adecuadas para cada caso.',
  },
  {
    num: '02',
    titulo: 'Presupuesto detallado',
    descripcion:
      'En 48–72 horas entregamos una propuesta económica desglosada por partidas, con especificación completa de materiales, mano de obra y plazos de ejecución. Sin letra pequeña.',
  },
  {
    num: '03',
    titulo: 'Ejecución y entrega',
    descripcion:
      'Nuestro equipo propio realiza los trabajos con mínima interferencia en la actividad del cliente. Al finalizar, entregamos documentación técnica completa y garantía por escrito.',
  },
]

export default function Proceso() {
  const sectionRef = useRef(null)
  const stepsRef   = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      gsap.from(stepsRef.current.querySelectorAll('article'), {
        y: 50,
        opacity: 0,
        duration: 0.75,
        stagger: 0.18,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: stepsRef.current,
          start: 'top 78%',
        },
      })

      const segments = stepsRef.current.querySelectorAll(`.${styles.stepSegment}`)
      if (segments.length) {
        gsap.fromTo(
          segments,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            duration: 1.2,
            stagger: 0.3,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: stepsRef.current,
              start: 'top 78%',
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby="proceso-title">
      <div className="container">
        <div className={styles.header}>
          <span className="section-eyebrow">Cómo trabajamos</span>
          <h2 id="proceso-title" className="section-title">
            Un proceso <span className={styles.accent}>claro y sin sorpresas</span>
          </h2>
        </div>

        <div ref={stepsRef} className={styles.steps}>
          {PASOS.map((paso, i) => (
            <article key={paso.num} className={styles.step}>
              <span className={styles.stepNum} aria-hidden="true">{paso.num}</span>

              {/* Rail: dot + optional right-side connector segment */}
              <div className={styles.stepTrack}>
                <div className={styles.stepDot} aria-hidden="true" />
                {i < PASOS.length - 1 && (
                  <div className={styles.stepSegment} aria-hidden="true" />
                )}
              </div>

              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{paso.titulo}</h3>
                <p className={styles.stepDesc}>{paso.descripcion}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
