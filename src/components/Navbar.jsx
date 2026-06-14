import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { contacto } from '../data/contacto'
import { ChevronDown } from 'lucide-react'
import { IconTelefono } from './Icons'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { label: 'Inicio',    anchor: 'inicio' },
  {
    label: 'Servicios',
    anchor: 'servicios',
    dropdown: [
      { label: 'Aislamiento y Calorifugado', to: '/servicios/aislamiento-y-calorifugado', badge: 'Especialidad' },
      { label: 'Conductos de Ventilación',   to: '/servicios/conductos' },
      { label: 'Climatización Industrial',   to: '/servicios/climatizacion' },
    ],
  },
  { label: 'Nosotros',  anchor: 'nosotros' },
  { label: 'Proyectos', anchor: 'proyectos' },
  { label: 'Contacto',  anchor: 'contacto' },
]

export default function Navbar() {
  const [scrolled,      setScrolled]      = useState(false)
  const [menuOpen,      setMenuOpen]      = useState(false)
  const [dropdownOpen,  setDropdownOpen]  = useState(false)
  const navRef = useRef(null)
  const { pathname } = useLocation()
  const navigate     = useNavigate()
  const isHome       = pathname === '/'

  // ── entrance animation ────────────────────────────────────────────────────
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, { y: -72, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.3 })
    })
    return () => ctx.revert()
  }, [])

  // ── scroll detection ──────────────────────────────────────────────────────
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // ── lock body when mobile menu open ───────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // ── close dropdown on outside click ──────────────────────────────────────
  useEffect(() => {
    const close = () => setDropdownOpen(false)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  // ── close menu on route change ────────────────────────────────────────────
  useEffect(() => {
    setMenuOpen(false)
    setDropdownOpen(false)
  }, [pathname])

  // ── smooth scroll to section (only on home) ───────────────────────────────
  const scrollToSection = (anchor) => {
    const el = document.getElementById(anchor)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
    setDropdownOpen(false)
  }

  // ── navigate to home then scroll to anchor ────────────────────────────────
  const handleAnchorClick = (e, anchor) => {
    e.preventDefault()
    setMenuOpen(false)
    setDropdownOpen(false)
    if (isHome) {
      scrollToSection(anchor)
    } else {
      // Full-page navigate: browser handles hash scroll on load
      window.location.href = `/#${anchor}`
    }
  }

  const handleServiciosClick = (e) => {
    e.stopPropagation()
    setDropdownOpen((v) => !v)
  }

  return (
    <>
      {menuOpen && (
        <div className={styles.overlay} onClick={() => setMenuOpen(false)} aria-hidden="true" />
      )}

      <header ref={navRef} className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={`container ${styles.inner}`}>

          {/* Logo → always home */}
          <Link
            to="/"
            className={styles.logo}
            aria-label="FRICAL – volver al inicio"
            onClick={() => { setMenuOpen(false); if (isHome) window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          >
            <svg width="110" height="28" viewBox="0 0 110 28" fill="none" aria-hidden="true">
              <text x="0" y="22" fontFamily="Archivo, Arial Black, sans-serif" fontSize="24" fontWeight="900" fill="#7ed957">
                FRICAL
              </text>
              <rect x="0" y="25" width="60" height="1.5" fill="#7ed957" opacity="0.35" rx="1" />
            </svg>
            <span className={styles.logoSub}>CALORIFUGADOS, S.L.</span>
          </Link>

          {/* Nav */}
          <nav id="main-nav" className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`} aria-label="Navegación principal">
            <ul className={styles.navList}>
              {NAV_LINKS.map((link) => (
                <li key={link.label} className={`${styles.navItem} ${link.dropdown ? styles.hasDropdown : ''}`}>
                  {link.dropdown ? (
                    <>
                      <button
                        className={styles.navBtn}
                        onClick={handleServiciosClick}
                        aria-expanded={dropdownOpen}
                        aria-haspopup="listbox"
                      >
                        {link.label}
                        <ChevronDown
                          size={11}
                          strokeWidth={1.5}
                          className={`${styles.chevron} ${dropdownOpen ? styles.chevronOpen : ''}`}
                          aria-hidden="true"
                        />
                      </button>
                      {dropdownOpen && (
                        <ul className={styles.dropdown} role="listbox">
                          {link.dropdown.map((item) => (
                            <li key={item.label}>
                              <Link
                                to={item.to}
                                className={`${styles.dropdownLink} ${item.badge ? styles.dropdownLinkFeatured : ''}`}
                                onClick={() => { setDropdownOpen(false); setMenuOpen(false) }}
                                role="option"
                              >
                                <span>{item.label}</span>
                                {item.badge && <span className={styles.dropdownBadge}>{item.badge}</span>}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <a
                      href={`/#${link.anchor}`}
                      className={styles.navLink}
                      onClick={(e) => handleAnchorClick(e, link.anchor)}
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            <a href={`tel:${contacto.telefono.replace(/\s/g, '')}`} className={styles.phone}>
              <IconTelefono size={15} />
              {contacto.telefono}
            </a>
            <Link to="/configurador" className={`btn-primary ${styles.ctaBtn}`}>
              Presupuesto
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </header>
    </>
  )
}
