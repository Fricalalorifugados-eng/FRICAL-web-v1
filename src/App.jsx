import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
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
      </Routes>
    </BrowserRouter>
  )
}
