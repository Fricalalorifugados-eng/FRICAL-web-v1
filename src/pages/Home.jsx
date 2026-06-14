import { useSeo } from '../hooks/useSeo'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Marquee from '../components/Marquee'
import Servicios from '../components/Servicios'
import Nosotros from '../components/Nosotros'
import Sectores from '../components/Sectores'
import Proyectos from '../components/Proyectos'
import Proximamente from '../components/Proximamente'
import Proceso from '../components/Proceso'
import Testimonios from '../components/Testimonios'
import CTABanner from '../components/CTABanner'
import Contacto from '../components/Contacto'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'

export default function Home() {
  useSeo({
    title: 'FRICAL CALORIFUGADOS, S.L. | Aislamiento Térmico Industrial · Barcelona',
    description: 'Especialistas en aislamiento térmico industrial, calorifugado de tuberías y equipos, conductos de ventilación y climatización HVAC en Barcelona y área metropolitana. Más de 25 años de experiencia.',
    url: 'https://fricalcalorifugados.com/',
  })

  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Marquee />
        <Servicios />
        <Nosotros />
        <Sectores />
        <Proyectos />
        <Proximamente />
        <Proceso />
        <Testimonios />
        <CTABanner />
        <Contacto />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
