import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useSeo } from '../../hooks/useSeo'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import WhatsAppButton from '../../components/WhatsAppButton'
import Contacto from '../../components/Contacto'
import ServicioHero from './ServicioHero'
import { Check } from 'lucide-react'
import styles from './ServicioPage.module.css'

const HERO_GRADIENTE =
  'linear-gradient(145deg, #0a0e1a 0%, #070b14 40%, #04070e 70%, #010209 100%)'

const BLOQUES = [
  {
    num: '01',
    titulo: 'Conductos de chapa galvanizada',
    descripcion:
      'Fabricación a medida y montaje de redes de conductos en chapa galvanizada para extracción, ventilación y climatización industrial. Cumplimiento de clase de estanqueidad A, B y C según normativa EN 12237.',
  },
  {
    num: '02',
    titulo: 'Conductos de acero inoxidable',
    descripcion:
      'Conductos en AISI 304 y AISI 316 para entornos agresivos, industria alimentaria, farmacéutica y zonas con alta humedad. Óptimos para extracción de vapores corrosivos o cumplimiento HACCP.',
  },
  {
    num: '03',
    titulo: 'Difusión y distribución de aire',
    descripcion:
      'Suministro e instalación de difusores, rejillas de retorno, toberas de largo alcance y anemostatos. Diseño de la distribución de aire adaptado a las necesidades de confort y proceso de cada instalación.',
  },
  {
    num: '04',
    titulo: 'Compuertas cortafuego',
    descripcion:
      'Instalación de compuertas cortafuego certificadas EI60 / EI120 para cumplimiento de la normativa CTE DB-SI en proyectos de edificación e industria. Mantenimiento y certificación anual disponibles.',
  },
  {
    num: '05',
    titulo: 'Equipos de impulsión y extracción',
    descripcion:
      'Selección, suministro e instalación de ventiladores de impulsión, extracción y recuperación de calor (URUS). Proyectos llave en mano que incluyen obra civil, conexionado eléctrico y puesta en marcha.',
  },
  {
    num: '06',
    titulo: 'Aislamiento de conductos',
    descripcion:
      'Aislamiento exterior e interior de redes de conductos con lana de vidrio, lana de roca o espuma elastomérica. Acabado en chapa de aluminio, papel aluminio o coquilla. Prevención de condensaciones garantizada.',
  },
]

const WHY_ITEMS = [
  'Fabricación propia en taller — control de calidad en cada pieza',
  'Equipos de montaje especializados en obras industriales y terciarias',
  'Proyectos llave en mano: ingeniería, fabricación, instalación y puesta en marcha',
  'Cumplimiento normativa UNE-EN 12237, CTE DB-SI y RITE',
  'Documentación final con planos as-built, certificados de material y pruebas de estanqueidad',
]

export default function ConductosPage() {
  useSeo({
    title: 'Conductos de Ventilación y Climatización Industrial | FRICAL CALORIFUGADOS, S.L.',
    description: 'Fabricación y montaje de conductos en chapa galvanizada o inoxidable para extracción, ventilación y climatización. Proyectos llave en mano en Barcelona y área metropolitana.',
    url: 'https://fricalcalorifugados.com/servicios/conductos',
  })

  const blocksRef = useRef(null)
  const whyRef = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      gsap.from(blocksRef.current?.children || [], {
        y: 40, opacity: 0, duration: 0.65, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: blocksRef.current, start: 'top 80%' },
      })
      gsap.from(whyRef.current?.querySelectorAll('[data-anim]') || [], {
        y: 30, opacity: 0, duration: 0.65, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: whyRef.current, start: 'top 80%' },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <ServicioHero
          titulo="Conductos de ventilación y climatización"
          subtitulo="Fabricación y montaje de redes de conductos en chapa galvanizada o inoxidable para extracción, ventilación y climatización industrial. Proyectos llave en mano."
          gradiente={HERO_GRADIENTE}
          imagen="/servicios/conductos-hero.jpg"
        />

        {/* Intro */}
        <section className={styles.intro}>
          <div className="container">
            <div className={styles.introInner}>
              <div className={styles.introText}>
                <span className="section-eyebrow">Conductos y ventilación</span>
                <h2 className={styles.introTitle}>
                  Fabricación y montaje{' '}
                  <span className={styles.accent}>llave en mano</span>
                </h2>
                <p className={styles.introBody}>
                  FRICAL dispone de taller propio de fabricación de conductos rectangulares y
                  circulares en chapa galvanizada, inoxidable o acero al carbono. Abarcamos desde
                  el estudio técnico y el dimensionado aeráulico hasta la instalación completa
                  incluyendo difusores, rejillas, compuertas y equipos de ventilación.
                </p>
                <p className={styles.introBody}>
                  Trabajamos con instaladores y promotores de Barcelona y el área metropolitana
                  en proyectos industriales, hoteleros, hospitalarios y de oficinas, con plazos
                  de fabricación y montaje ajustados a las necesidades de cada obra.
                </p>
                <div className={styles.introStats}>
                  <div className={styles.introStat}>
                    <span className={styles.introStatNum}>+200</span>
                    <span className={styles.introStatLabel}>redes de conductos instaladas</span>
                  </div>
                  <div className={styles.introStat}>
                    <span className={styles.introStatNum}>A/B/C</span>
                    <span className={styles.introStatLabel}>clases de estanqueidad</span>
                  </div>
                </div>
              </div>

              <div className={styles.introBadgeWrap}>
                <div className={styles.introBadge}>
                  <span className={styles.introBadgeTitle}>Materiales</span>
                  <span className={styles.introBadgeText}>
                    Chapa galvanizada DX51D · Inoxidable AISI 304/316 · Acero al carbono lacado
                  </span>
                </div>
                <div className={styles.introBadge}>
                  <span className={styles.introBadgeTitle}>Tipos de unión</span>
                  <span className={styles.introBadgeText}>
                    Brida tipo S · Railes · Ángulos reforzados · Uniones TDC/TDF para grandes secciones
                  </span>
                </div>
                <div className={styles.introBadge}>
                  <span className={styles.introBadgeTitle}>Normativa aplicable</span>
                  <span className={styles.introBadgeText}>
                    UNE-EN 12237 · CTE DB-SI · RITE · EN 1366-2 (compuertas cortafuego)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bloques */}
        <section className={styles.blocks}>
          <div className="container">
            <div className={styles.blocksHeader}>
              <span className="section-eyebrow">Alcance del servicio</span>
              <h2 className="section-title">
                Todo lo que necesitas en{' '}
                <span className={styles.accent}>ventilación industrial</span>
              </h2>
            </div>
            <div ref={blocksRef} className={styles.blocksGrid}>
              {BLOQUES.map((b) => (
                <div key={b.num} className={styles.block}>
                  <p className={styles.blockNum}>{b.num}</p>
                  <h3 className={styles.blockTitle}>{b.titulo}</h3>
                  <p className={styles.blockDesc}>{b.descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Por qué FRICAL */}
        <section className={styles.why} ref={whyRef}>
          <div className="container">
            <div className={styles.whyInner}>
              <div>
                <span className="section-eyebrow" data-anim>Por qué elegirnos</span>
                <h2 className={styles.whyTitle} data-anim>
                  Fabricación propia,{' '}
                  <span className={styles.accent}>instalación garantizada</span>
                </h2>
                <p className={styles.whyBody} data-anim>
                  Controlar la cadena completa — desde el corte de chapa en taller hasta la
                  prueba de estanqueidad en obra — nos permite ofrecer unos plazos y una
                  calidad que no encontrarás si subcontratas la fabricación y el montaje
                  por separado.
                </p>
              </div>
              <ul className={styles.whyList} aria-label="Ventajas de FRICAL en conductos">
                {WHY_ITEMS.map((item, i) => (
                  <li key={i} className={styles.whyItem} data-anim>
                    <div className={styles.whyItemIcon} aria-hidden="true">
                      <Check size={12} strokeWidth={2} aria-hidden="true" />
                    </div>
                    <span className={styles.whyItemText}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <div className={styles.formSection}>
          <div className="container">
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>¿Tienes un proyecto de conductos?</h2>
              <p className={styles.formSub}>
                Envíanos los planos o descríbenos la instalación. Te respondemos en menos de 24 horas.
              </p>
            </div>
          </div>
          <Contacto servicioInicial="conductos" compact />
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
