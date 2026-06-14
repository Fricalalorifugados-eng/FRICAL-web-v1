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
  'linear-gradient(145deg, #071518 0%, #050e10 40%, #030809 70%, #010405 100%)'

const BLOQUES = [
  {
    num: '01',
    titulo: 'Sistemas VRF / VRV',
    descripcion:
      'Diseño e instalación de sistemas de volumen de refrigerante variable para edificios de oficinas, hoteles e instalaciones industriales. Alta eficiencia energética con control individualizado por zona.',
  },
  {
    num: '02',
    titulo: 'Climatización industrial HVAC',
    descripcion:
      'Sistemas de tratamiento de aire para naves industriales, salas de producción y almacenes logísticos. Cálculo de cargas térmicas, diseño aeráulico y selección de equipos adaptados a cada proceso.',
  },
  {
    num: '03',
    titulo: 'Unidades de tratamiento de aire (UTA)',
    descripcion:
      'Instalación de centrales de tratamiento de aire para proyectos que requieren control preciso de temperatura, humedad y calidad del aire interior (IAQ). Sector hospitalario, farmacéutico y alimentario.',
  },
  {
    num: '04',
    titulo: 'Fan-coils y splits de conductos',
    descripcion:
      'Instalación de equipos individuales y sistemas distribuidos para locales comerciales, oficinas y pequeñas instalaciones industriales. Soluciones eficientes con mínima obra civil.',
  },
  {
    num: '05',
    titulo: 'Mantenimiento preventivo y correctivo',
    descripcion:
      'Contratos de mantenimiento anual con revisiones periódicas, limpieza de equipos, control de gases refrigerantes y documentación técnica. Garantizamos el rendimiento óptimo de tu instalación.',
  },
]

const WHY_ITEMS = [
  'Adaptamos cada proyecto a la normativa RITE y CTE vigente',
  'Selección de equipos de alta eficiencia — clasificación energética A o superior',
  'Cálculo preciso de cargas térmicas para máximo rendimiento',
  'Instaladores certificados en manipulación de gases fluorados (F-Gas)',
  'Garantía posventa real: servicio técnico propio en Barcelona y área metropolitana',
  'Proyectos llave en mano con documentación final y libro del edificio',
]

export default function ClimatizacionPage() {
  useSeo({
    title: 'Climatización Industrial HVAC | FRICAL CALORIFUGADOS, S.L.',
    description: 'Diseño, instalación y mantenimiento de sistemas HVAC, VRF/VRV y UTA para industria, naves logísticas y oficinas. Certificación F-Gas y normativa RITE. Barcelona.',
    url: 'https://fricalcalorifugados.com/servicios/climatizacion',
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
          titulo="Climatización industrial"
          subtitulo="Diseño, instalación y mantenimiento de sistemas HVAC para industria, naves logísticas, locales y oficinas. Adaptados a la normativa RITE y con garantía posventa."
          gradiente={HERO_GRADIENTE}
          imagen="/servicios/climatizacion-hero.jpg"
        />

        {/* Intro */}
        <section className={styles.intro}>
          <div className="container">
            <div className={styles.introInner}>
              <div className={styles.introText}>
                <span className="section-eyebrow">Climatización HVAC</span>
                <h2 className={styles.introTitle}>
                  Confort y eficiencia{' '}
                  <span className={styles.accent}>en cada instalación</span>
                </h2>
                <p className={styles.introBody}>
                  FRICAL ofrece proyectos integrales de climatización para todo tipo de
                  instalaciones: desde una oficina corporativa hasta una nave industrial
                  de grandes dimensiones. Realizamos el cálculo de cargas térmicas, el
                  diseño de la instalación, la selección de equipos y el montaje completo.
                </p>
                <p className={styles.introBody}>
                  Trabajamos con las principales marcas del sector — Daikin, Mitsubishi,
                  Toshiba, LG — y disponemos de certificación para manipulación de gases
                  fluorados (F-Gas). Ofrecemos contratos de mantenimiento preventivo que
                  garantizan el rendimiento óptimo de la instalación a lo largo del tiempo.
                </p>
                <div className={styles.introStats}>
                  <div className={styles.introStat}>
                    <span className={styles.introStatNum}>+100</span>
                    <span className={styles.introStatLabel}>sistemas HVAC instalados</span>
                  </div>
                  <div className={styles.introStat}>
                    <span className={styles.introStatNum}>F-Gas</span>
                    <span className={styles.introStatLabel}>certificación oficial</span>
                  </div>
                  <div className={styles.introStat}>
                    <span className={styles.introStatNum}>RITE</span>
                    <span className={styles.introStatLabel}>normativa cumplida</span>
                  </div>
                </div>
              </div>

              <div className={styles.introBadgeWrap}>
                <div className={styles.introBadge}>
                  <span className={styles.introBadgeTitle}>Tipos de instalación</span>
                  <span className={styles.introBadgeText}>
                    VRF/VRV · Climatizadoras UTA · Fan-coils · Splits de conductos · Bombas de calor
                  </span>
                </div>
                <div className={styles.introBadge}>
                  <span className={styles.introBadgeTitle}>Sectores atendidos</span>
                  <span className={styles.introBadgeText}>
                    Industria · Logística · Oficinas · Hostelería · Hospitales · Farmacia
                  </span>
                </div>
                <div className={styles.introBadge}>
                  <span className={styles.introBadgeTitle}>Normativa aplicable</span>
                  <span className={styles.introBadgeText}>
                    RITE (IT 1.2) · CTE DB-HE · Reglamento F-Gas (UE) 517/2014
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
              <span className="section-eyebrow">Soluciones de climatización</span>
              <h2 className="section-title">
                Sistemas adaptados a{' '}
                <span className={styles.accent}>cada tipo de instalación</span>
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
                  Climatización industrial con{' '}
                  <span className={styles.accent}>garantía real</span>
                </h2>
                <p className={styles.whyBody} data-anim>
                  No solo instalamos: también mantenemos. Nuestros contratos de mantenimiento
                  preventivo incluyen revisiones programadas, control de gases y documentación
                  actualizada, para que tu instalación rinda al máximo durante toda su vida útil.
                </p>
              </div>
              <ul className={styles.whyList} aria-label="Ventajas en climatización">
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
              <h2 className={styles.formTitle}>¿Necesitas climatizar tu instalación?</h2>
              <p className={styles.formSub}>
                Descríbenos el proyecto y te enviamos un presupuesto detallado sin compromiso.
              </p>
            </div>
          </div>
          <Contacto servicioInicial="climatizacion" compact />
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
