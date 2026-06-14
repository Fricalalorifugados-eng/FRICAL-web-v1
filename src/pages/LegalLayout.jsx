import { Link } from 'react-router-dom'
import { useSeo } from '../hooks/useSeo'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import styles from './LegalLayout.module.css'

const SEO_META = {
  'Aviso Legal': {
    description: 'Aviso legal de FRICAL CALORIFUGADOS, S.L. — CIF B98127855. Datos identificativos del titular del sitio web y condiciones de uso.',
    path: '/aviso-legal',
  },
  'Política de Privacidad': {
    description: 'Política de privacidad de FRICAL CALORIFUGADOS, S.L. Información sobre el tratamiento de datos personales conforme al RGPD.',
    path: '/politica-de-privacidad',
  },
  'Política de Cookies': {
    description: 'Política de cookies de FRICAL CALORIFUGADOS, S.L. Tipos de cookies utilizadas y cómo gestionarlas o desactivarlas.',
    path: '/politica-de-cookies',
  },
  'Términos y Condiciones': {
    description: 'Condiciones generales de contratación de los servicios de aislamiento, conductos y climatización de FRICAL CALORIFUGADOS, S.L.',
    path: '/terminos-y-condiciones',
  },
}

export default function LegalLayout({ title, lastUpdate, children }) {
  const meta = SEO_META[title] || { description: `${title} | FRICAL CALORIFUGADOS, S.L.`, path: '/' }

  useSeo({
    title: `${title} | FRICAL CALORIFUGADOS, S.L.`,
    description: meta.description,
    url: `https://fricalcalorifugados.com${meta.path}`,
  })

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className="container">
            <nav className={styles.breadcrumb} aria-label="Migas de pan">
              <Link to="/">Inicio</Link>
              <span aria-hidden="true">›</span>
              <span>{title}</span>
            </nav>
            <h1 className={styles.title}>{title}</h1>
            {lastUpdate && (
              <p className={styles.lastUpdate}>
                Última actualización: <time>{lastUpdate}</time>
              </p>
            )}
          </div>
        </div>
        <div className="container">
          <article className={styles.content}>{children}</article>
        </div>
      </main>
      <Footer />
    </>
  )
}
