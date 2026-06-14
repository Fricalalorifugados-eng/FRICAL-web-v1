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
  'linear-gradient(145deg, #0a1a0a 0%, #07120a 40%, #040c06 70%, #010401 100%)'

const BLOQUES = [
  {
    num: '01',
    titulo: 'Frío Industrial',
    descripcion:
      'Aislamiento mediante poliuretano inyectado, con acabado en chapa blanca, aluminio o inoxidable según las condiciones de la instalación. Solución óptima para tuberías y equipos que trabajan a temperaturas bajo cero.',
  },
  {
    num: '02',
    titulo: 'Climatización',
    descripcion:
      'Aislamiento de tuberías y conductos de climatización mediante espumas elastoméricas, fibras de vidrio o lanas de roca. Minimizamos las pérdidas de frío/calor y garantizamos eficiencia energética a largo plazo.',
  },
  {
    num: '03',
    titulo: 'Alta Temperatura',
    descripcion:
      'Aislamiento mediante lana de roca con acabado en aluminio o inoxidable, diseñado para calderas industriales, hornos y equipos que operan a temperaturas superiores a 250 °C.',
  },
  {
    num: '04',
    titulo: 'Calorifugado de Equipos',
    descripcion:
      'Calorifugado de tuberías, equipos, depósitos y conductos mediante chapa de aluminio, inoxidable o galvanizado. Protección térmica y anticorrosiva para cualquier geometría de instalación.',
  },
  {
    num: '05',
    titulo: 'Sectorización RF120',
    descripcion:
      'Revestimiento de conductos mediante manta Pyromax o Ultimate para cumplir los requisitos de resistencia al fuego RF120. Solución indispensable en proyectos que requieren compartimentación cortafuego.',
  },
]

const WHY_ITEMS = [
  'Más de 25 años de experiencia en aislamiento térmico industrial',
  'Equipo propio de técnicos especializados, sin subcontratas',
  'Materiales certificados: lana de roca, poliuretano, espuma elastomérica, silicato',
  'Acabados en aluminio, inoxidable AISI 304/316 o chapa galvanizada',
  'Documentación técnica completa entregada con cada proyecto',
  'Garantía por escrito sobre materiales y ejecución',
]

export default function AislamientoPage() {
  useSeo({
    title: 'Aislamiento y Calorifugado Industrial | FRICAL CALORIFUGADOS, S.L.',
    description: 'Especialistas en calorifugado de tuberías, depósitos y equipos. Frío industrial, alta temperatura, sectorización RF120 y acabados en aluminio o inoxidable. Barcelona y área metropolitana.',
    url: 'https://fricalcalorifugados.com/servicios/aislamiento-y-calorifugado',
  })

  const introRef = useRef(null)
  const blocksRef = useRef(null)
  const whyRef = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      gsap.from(introRef.current?.querySelectorAll('[data-anim]') || [], {
        y: 40, opacity: 0, duration: 0.75, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: introRef.current, start: 'top 80%' },
      })
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
          titulo="Soluciones integrales de aislamiento"
          subtitulo="Calorifugado y aislamiento térmico para tuberías, depósitos, calderas y equipos industriales. Frío industrial, alta temperatura, sectorización RF120 y acabados en aluminio o inoxidable."
          gradiente={HERO_GRADIENTE}
          imagen="/servicios/aislamiento-hero.jpg"
        />

        {/* Intro */}
        <section className={styles.intro} ref={introRef}>
          <div className="container">
            <div className={styles.introInner}>
              <div className={styles.introText}>
                <span className="section-eyebrow" data-anim>Especialidad principal</span>
                <h2 className={styles.introTitle} data-anim>
                  El aislamiento térmico es{' '}
                  <span className={styles.accent}>nuestra especialidad</span>
                </h2>
                <p className={styles.introBody} data-anim>
                  Desde el calorifugado de una sola tubería hasta el aislamiento completo de
                  una planta de proceso, FRICAL dispone de la experiencia técnica y los medios
                  propios para abordar proyectos de cualquier escala con los más altos estándares
                  de calidad.
                </p>
                <p className={styles.introBody} data-anim>
                  Seleccionamos el material más adecuado — lana de roca, espuma elastomérica,
                  poliuretano inyectado o mantas de silicato — en función de la temperatura de
                  trabajo, el entorno y la normativa aplicable. El acabado en aluminio, inoxidable
                  o galvanizado garantiza durabilidad y una instalación impecable.
                </p>
                <div className={styles.introStats} data-anim>
                  <div className={styles.introStat}>
                    <span className={styles.introStatNum}>25+</span>
                    <span className={styles.introStatLabel}>años de experiencia</span>
                  </div>
                  <div className={styles.introStat}>
                    <span className={styles.introStatNum}>800+</span>
                    <span className={styles.introStatLabel}>proyectos de aislamiento</span>
                  </div>
                  <div className={styles.introStat}>
                    <span className={styles.introStatNum}>RF120</span>
                    <span className={styles.introStatLabel}>sectorización certificada</span>
                  </div>
                </div>
              </div>

              <div className={styles.introBadgeWrap} data-anim>
                <div className={styles.introBadge}>
                  <span className={styles.introBadgeTitle}>Materiales utilizados</span>
                  <span className={styles.introBadgeText}>
                    Lana de roca · Espuma elastomérica · Poliuretano inyectado · Mantas de silicato · Fibra de vidrio
                  </span>
                </div>
                <div className={styles.introBadge}>
                  <span className={styles.introBadgeTitle}>Acabados disponibles</span>
                  <span className={styles.introBadgeText}>
                    Aluminio estucado · Inoxidable AISI 304 / 316 · Chapa galvanizada · Chapa lacada blanca · Coquilla de PVC
                  </span>
                </div>
                <div className={styles.introBadge}>
                  <span className={styles.introBadgeTitle}>Sectores de aplicación</span>
                  <span className={styles.introBadgeText}>
                    Industria química · Alimentación · Farmacéutico · Energético · Naval · Edificación
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5 bloques de especialidad */}
        <section className={styles.blocks}>
          <div className="container">
            <div className={styles.blocksHeader}>
              <span className="section-eyebrow">Áreas de aplicación</span>
              <h2 className="section-title">
                Cinco especialidades,{' '}
                <span className={styles.accent}>un mismo rigor</span>
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
                  Aislamiento industrial con{' '}
                  <span className={styles.accent}>garantía propia</span>
                </h2>
                <p className={styles.whyBody} data-anim>
                  Todo el proceso — visita técnica, presupuesto, ejecución y documentación final —
                  lo realizamos con nuestro equipo propio. Sin intermediarios, con control total
                  de calidad en cada fase del proyecto.
                </p>
              </div>
              <ul className={styles.whyList} aria-label="Razones para elegir FRICAL">
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

        {/* Formulario */}
        <div className={styles.formSection}>
          <div className="container">
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>¿Necesitas aislar tu instalación?</h2>
              <p className={styles.formSub}>
                Cuéntanos el proyecto y te preparamos un presupuesto detallado sin compromiso
                en menos de 72 horas.
              </p>
            </div>
          </div>
          <Contacto servicioInicial="aislamiento" compact />
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
