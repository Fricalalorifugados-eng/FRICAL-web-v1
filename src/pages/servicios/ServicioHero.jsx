import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Phone } from 'lucide-react'
import styles from './ServicioHero.module.css'

export default function ServicioHero({ titulo, subtitulo, imagen, gradiente }) {
  const heroRef = useRef(null)
  const bgRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bgRef.current,
        { scale: 1 },
        {
          scale: 1.12,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.8,
          },
        }
      )

      gsap.from(contentRef.current.children, {
        y: 40,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.4,
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={heroRef} className={styles.hero} aria-label={`Hero: ${titulo}`}>
      <div
        ref={bgRef}
        className={styles.bg}
        style={{
          background: gradiente || 'linear-gradient(145deg, #0d1e0d 0%, #0a0a0a 100%)',
          ...(imagen ? { backgroundImage: `url(${imagen})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}),
        }}
        aria-hidden="true"
      />
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.gridLines} aria-hidden="true" />

      <div className={`container ${styles.content}`}>
        <nav ref={contentRef} className={styles.wrap}>
          <nav className={styles.breadcrumb} aria-label="Migas de pan">
            <Link to="/">Inicio</Link>
            <span aria-hidden="true">›</span>
            <Link to="/#servicios">Servicios</Link>
            <span aria-hidden="true">›</span>
            <span>{titulo}</span>
          </nav>
          <h1 className={styles.title}>{titulo}</h1>
          <p className={styles.subtitle}>{subtitulo}</p>
          <div className={styles.actions}>
            <a
              href="#contacto"
              className="btn-primary"
              onClick={(e) => { e.preventDefault(); document.querySelector('#contacto')?.scrollIntoView({ behavior: 'smooth' }) }}
            >
              Solicitar presupuesto
            </a>
            <a href="tel:673177887" className="btn-secondary">
              <Phone size={15} aria-hidden="true" />
              673 177 887
            </a>
          </div>
        </nav>
      </div>

      <div className={styles.scrollLine} aria-hidden="true" />
    </section>
  )
}
