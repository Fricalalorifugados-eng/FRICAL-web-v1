import styles from './Marquee.module.css'

const ITEMS = [
  'Calorifugado de tuberías',
  'Aislamiento de depósitos',
  'Lana de roca industrial',
  'Recubrimiento de aluminio',
  'Conductos de chapa galvanizada',
  'Climatización industrial',
  'Espuma elastomérica',
  'Aislamiento en frío',
  'Trazado eléctrico',
  'Ventilación HVAC',
  'Inoxidable AISI 304',
  'Mantas de silicato',
]

function Dot() {
  return <span className={styles.dot} aria-hidden="true">·</span>
}

export default function Marquee() {
  const repeated = [...ITEMS, ...ITEMS]

  return (
    <div className={styles.wrapper} aria-label="Especialidades de FRICAL" role="marquee">
      <div className={styles.track} aria-hidden="true">
        {repeated.map((item, i) => (
          <span key={i} className={styles.item}>
            {item}
            <Dot />
          </span>
        ))}
      </div>
    </div>
  )
}
