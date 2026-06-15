import { Link } from 'react-router-dom'
import { contacto } from '../data/contacto'
import { proyectos } from '../data/proyectos'
import styles from './Footer.module.css'

function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="13" cy="5" r="0.8" fill="currentColor" />
    </svg>
  )
}

function IconLinkedIn() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 8v5M6 6v.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 13v-2.5C9 9.12 9.9 8 11 8s2 1.12 2 2.5V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconTikTok() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M10.5 2c.2 1.6 1.2 2.7 2.5 3v2c-.9 0-1.7-.3-2.5-.8v4.5c0 2-1.6 3.3-3.5 3.3S3.5 12.7 3.5 10.7s1.6-3.3 3.5-3.3c.2 0 .3 0 .5.02V9.6c-.17-.04-.33-.06-.5-.06-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5V2h2z" fill="currentColor" />
    </svg>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className="container">
          <div className={styles.grid}>
            <div className={styles.brand}>
              <Link to="/" className={styles.logo} aria-label="FRICAL – inicio">
                <img src="/logo-frical.png" alt="FRICAL Calorifugados" className={styles.logoImg} />
              </Link>
              <p className={styles.brandDesc}>
                Especialistas en aislamiento térmico industrial y calorifugado.
                Más de 25 años de experiencia al servicio de la industria de Barcelona
                y su área metropolitana.
              </p>
              <p className={styles.cif}>{contacto.cif} · {contacto.empresa}</p>

              <div className={styles.social} aria-label="Redes sociales">
                <a
                  href={contacto.redes.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label="Instagram de FRICAL"
                >
                  <IconInstagram />
                </a>
                <a
                  href={contacto.redes.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label="LinkedIn de FRICAL"
                >
                  <IconLinkedIn />
                </a>
                <a
                  href={contacto.redes.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label="TikTok de FRICAL"
                >
                  <IconTikTok />
                </a>
              </div>
            </div>

            <div className={styles.col}>
              <h3 className={styles.colTitle}>Servicios</h3>
              <ul className={styles.colList}>
                <li>
                  <Link to="/servicios/aislamiento-y-calorifugado">
                    Aislamiento y Calorifugado
                  </Link>
                </li>
                <li>
                  <Link to="/servicios/conductos">Conductos de Ventilación</Link>
                </li>
                <li>
                  <Link to="/servicios/climatizacion">Climatización Industrial</Link>
                </li>
                <li>
                  <a href="/#proceso">Cómo trabajamos</a>
                </li>
                <li>
                  <Link to="/configurador">Configurador de presupuesto</Link>
                </li>
                <li>
                  <Link to="/trabaja-con-nosotros">Trabaja con nosotros</Link>
                </li>
              </ul>
            </div>

            <div className={styles.col}>
              <h3 className={styles.colTitle}>Proyectos recientes</h3>
              <ul className={styles.colList}>
                {proyectos.slice(0, 4).map((p) => (
                  <li key={p.id}>
                    <a href="/#proyectos">
                      {p.titulo}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.col}>
              <h3 className={styles.colTitle}>Contacto</h3>
              <ul className={styles.contactList}>
                <li>
                  <a href={`tel:${contacto.telefono.replace(/\s/g, '')}`}>
                    {contacto.telefono} — Rubén Pérez
                  </a>
                </li>
                <li>
                  <a href={`tel:${contacto.telefono2.replace(/\s/g, '')}`}>
                    {contacto.telefono2} — Sergio Pérez
                  </a>
                </li>
                <li>
                  <a href={`mailto:${contacto.email}`}>{contacto.email}</a>
                </li>
                <li className={styles.addr}>{contacto.direccion}</li>
                <li className={styles.horario}>{contacto.horario}</li>
              </ul>
              <Link
                to="/configurador"
                className={`btn-primary ${styles.footerCta}`}
              >
                Pedir presupuesto
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <p className={styles.copy}>
              &copy; {year} {contacto.empresa}. Todos los derechos reservados.
            </p>
            <nav aria-label="Páginas legales">
              <ul className={styles.legal}>
                <li><Link to="/aviso-legal">Aviso legal</Link></li>
                <li><Link to="/politica-de-privacidad">Privacidad</Link></li>
                <li><Link to="/politica-de-cookies">Cookies</Link></li>
                <li><Link to="/terminos-y-condiciones">Términos y condiciones</Link></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
