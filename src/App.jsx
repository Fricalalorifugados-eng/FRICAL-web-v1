import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import PoliticaPrivacidad from './pages/PoliticaPrivacidad'
import PoliticaCookies from './pages/PoliticaCookies'
import AvisoLegal from './pages/AvisoLegal'
import TerminosCondiciones from './pages/TerminosCondiciones'
import AislamientoPage from './pages/servicios/AislamientoPage'
import ConductosPage from './pages/servicios/ConductosPage'
import ClimatizacionPage from './pages/servicios/ClimatizacionPage'
import CookieBanner from './components/CookieBanner'
import TrabajaConNosotros from './pages/TrabajaConNosotros'
import Configurador from './pages/Configurador'

import AdminLogin    from './pages/admin/AdminLogin'
import AdminLayout   from './pages/admin/AdminLayout'
import AdminMensajes     from './pages/admin/AdminMensajes'
import AdminCandidaturas from './pages/admin/AdminCandidaturas'
import AdminPresupuestos from './pages/admin/AdminPresupuestos'
import AdminProyectos    from './pages/admin/AdminProyectos'
import AdminProximos     from './pages/admin/AdminProximos'
import AdminTestimonios  from './pages/admin/AdminTestimonios'
import AdminContacto     from './pages/admin/AdminContacto'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <CookieBanner />
      <Routes>
        {/* Sitio público */}
        <Route path="/" element={<Home />} />
        <Route path="/servicios/aislamiento-y-calorifugado" element={<AislamientoPage />} />
        <Route path="/servicios/conductos" element={<ConductosPage />} />
        <Route path="/servicios/climatizacion" element={<ClimatizacionPage />} />
        <Route path="/politica-de-privacidad" element={<PoliticaPrivacidad />} />
        <Route path="/politica-de-cookies" element={<PoliticaCookies />} />
        <Route path="/aviso-legal" element={<AvisoLegal />} />
        <Route path="/terminos-y-condiciones" element={<TerminosCondiciones />} />
        <Route path="/trabaja-con-nosotros" element={<TrabajaConNosotros />} />
        <Route path="/configurador" element={<Configurador />} />

        {/* Panel admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/mensajes" replace />} />
          <Route path="mensajes"      element={<AdminMensajes />} />
          <Route path="candidaturas"  element={<AdminCandidaturas />} />
          <Route path="presupuestos"  element={<AdminPresupuestos />} />
          <Route path="proyectos"     element={<AdminProyectos />} />
          <Route path="proximos"      element={<AdminProximos />} />
          <Route path="testimonios"   element={<AdminTestimonios />} />
          <Route path="contacto"      element={<AdminContacto />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
