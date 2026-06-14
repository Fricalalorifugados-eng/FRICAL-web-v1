import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { testimonios } from '../data/testimonios'
import styles from './Testimonios.module.css'

function QuoteIcon() {
  return (
    <svg width="32" height="24" viewBox="0 0 32 24" fill="none" aria-hidden="true">
      <path d="M0 24V14C0 6.268 4.716 1.584 14.148 0l1.704 2.88C11.1 4.128 8.652 6.348 7.548 9.54h6.204V24H0zm18 0V14C18 6.268 22.716 1.584 32.148 0l1.704 2.88C29.1 4.128 26.652 6.348 25.548 9.54h6.204V24H18z" fill="currentColor" />
    </svg>
  )
}

const AVATAR_COLORS = ['#2a3a1a', '#1a2a3a', '#2a1a3a']

export default function Testimonios() {
  const sectionRef = useRef(null)
  const cardsRef = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      gsap.from(cardsRef.current.children, {
        y: 50,
        opacity: 0,
        duration: 0.75,
        stagger: 0.15,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 80%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby="test-title">
      <div className="container">
        <div className={styles.header}>
          <span className="section-eyebrow">Testimonios</span>
          <h2 id="test-title" className="section-title">
            Lo que dicen{' '}
            <span className={styles.accent}>nuestros clientes</span>
          </h2>
        </div>

        <div ref={cardsRef} className={styles.grid}>
          {testimonios.map((t, i) => (
            <blockquote key={t.id} className={styles.card}>
              <div className={styles.quoteIcon}>
                <QuoteIcon />
              </div>
              <p className={styles.cita}>{t.cita}</p>
              <footer className={styles.author}>
                <div
                  className={styles.avatar}
                  style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                  aria-hidden="true"
                >
                  <span>{t.iniciales}</span>
                </div>
                <div>
                  <cite className={styles.nombre}>{t.nombre}</cite>
                  <span className={styles.cargo}>{t.cargo}</span>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
