import { Phone, Mail, MapPin, Clock } from 'lucide-react'

const A = { 'aria-hidden': 'true' }

export function IconTelefono({ size = 20 }) {
  return <Phone size={size} strokeWidth={1.8} {...A} />
}

export function IconEmail({ size = 20 }) {
  return <Mail size={size} strokeWidth={1.8} {...A} />
}

export function IconLocation({ size = 20 }) {
  return <MapPin size={size} strokeWidth={1.8} {...A} />
}

export function IconClock({ size = 20 }) {
  return <Clock size={size} strokeWidth={1.8} {...A} />
}
