import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import styles from './admin.module.css'

function IconMsg()  { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> }
function IconUser() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> }
function IconClip() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> }
function IconGrid() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> }
function IconClock() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
function IconStar()  { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> }
function IconEdit()  { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> }
function IconOut()   { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }

export default function AdminLayout() {
  const { user, loading, signOut } = useAdminAuth()
  const navigate = useNavigate()

  // Contadores de no-leídos
  const [counts, setCounts] = useState({ msg: 0, app: 0, cfg: 0 })

  useEffect(() => {
    if (!user) return
    async function loadCounts() {
      const [r1, r2, r3] = await Promise.all([
        supabase.from('messages').select('id', { count: 'exact', head: true }).eq('leido', false),
        supabase.from('applications').select('id', { count: 'exact', head: true }).eq('leido', false),
        supabase.from('configurator_requests').select('id', { count: 'exact', head: true }).eq('leido', false),
      ])
      setCounts({ msg: r1.count || 0, app: r2.count || 0, cfg: r3.count || 0 })
    }
    loadCounts()
  }, [user])

  if (loading) return <div className={styles.loadingPage}>Cargando…</div>
  if (!user)   return <Navigate to="/admin/login" replace />

  async function handleSignOut() {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  function navCls({ isActive }) {
    return `${styles.navLink}${isActive ? ' ' + styles.active : ''}`
  }

  return (
    <div className={styles.wrap}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <img src="/logo-frical.png" alt="FRICAL Calorifugados" className={styles.sidebarLogoImg} />
          <span>Panel Admin</span>
        </div>

        <nav className={styles.sidebarNav}>
          <div className={styles.sidebarSection}>Bandeja</div>
          <NavLink to="/admin/mensajes"      className={navCls} end>
            <IconMsg /> Mensajes
            {counts.msg > 0 && <span className={styles.badge}>{counts.msg}</span>}
          </NavLink>
          <NavLink to="/admin/candidaturas"  className={navCls} end>
            <IconUser /> Candidaturas
            {counts.app > 0 && <span className={styles.badge}>{counts.app}</span>}
          </NavLink>
          <NavLink to="/admin/presupuestos"  className={navCls} end>
            <IconClip /> Presupuestos
            {counts.cfg > 0 && <span className={styles.badge}>{counts.cfg}</span>}
          </NavLink>

          <div className={styles.sidebarSection} style={{ marginTop: 8 }}>Contenido</div>
          <NavLink to="/admin/proyectos"     className={navCls} end><IconGrid />  Proyectos</NavLink>
          <NavLink to="/admin/proximos"      className={navCls} end><IconClock /> Próximos</NavLink>
          <NavLink to="/admin/testimonios"   className={navCls} end><IconStar />  Testimonios</NavLink>
          <NavLink to="/admin/contacto"      className={navCls} end><IconEdit />  Contacto</NavLink>
        </nav>

        <div className={styles.sidebarBottom}>
          <button onClick={handleSignOut} className={styles.logoutBtn}>
            <IconOut /> Cerrar sesión
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <Outlet context={{ counts, setCounts }} />
      </main>
    </div>
  )
}
