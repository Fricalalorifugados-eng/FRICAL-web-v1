// ─── Tipos de trabajo ────────────────────────────────────────────────────────
export const TIPOS_TRABAJO = [
  { id: 'aislamiento',  label: 'Aislamiento de tuberías',             icon: 'Pipette',  desc: 'Calorifugado con lana de roca, espuma elastomérica, poliuretano...' },
  { id: 'calorifugado', label: 'Calorifugado de depósitos y equipos', icon: 'Cylinder', desc: 'Calderas, depósitos, intercambiadores, válvulas y bridas.' },
  { id: 'conductos',    label: 'Conductos de ventilación',            icon: 'Wind',     desc: 'Redes de conductos en chapa galvanizada o inoxidable.' },
  { id: 'sectorizacion',label: 'Sectorización RF120 / alta temperatura', icon: 'Shield', desc: 'Manta Pyromax o Ultimate. Compartimentación cortafuego.' },
]

// ─── Temperaturas ─────────────────────────────────────────────────────────────
export const TEMPERATURAS = [
  { id: 'frio',     label: 'Frío industrial',       sub: 'Temperatura negativa',   icon: 'Snowflake' },
  { id: 'ambiente', label: 'Temperatura ambiente',  sub: 'Hasta 80 °C',            icon: 'Thermometer' },
  { id: 'media',    label: '100 – 250 °C',          sub: 'Alta temperatura',        icon: 'ThermometerSun' },
  { id: 'alta',     label: 'Más de 250 °C',         sub: 'Muy alta temperatura',    icon: 'Flame' },
]

// ─── Materiales de aislamiento ────────────────────────────────────────────────
export const MATERIALES = [
  { id: 'lana-roca',          label: 'Lana de roca',          sub: 'Alta temperatura y resistencia al fuego' },
  { id: 'espuma-elastomerica', label: 'Espuma elastomérica',  sub: 'Frío industrial y climatización' },
  { id: 'fibra-vidrio',       label: 'Fibra de vidrio',       sub: 'Alta temperatura, bajo peso' },
  { id: 'poliuretano',        label: 'Poliuretano inyectado', sub: 'Frío y aplicaciones criogénicas' },
  { id: 'no-se',              label: 'No lo sé',              sub: 'FRICAL me lo recomendará', icon: 'HardHat' },
]

// ─── Acabados ─────────────────────────────────────────────────────────────────
export const ACABADOS = [
  { id: 'aluminio',     label: 'Aluminio estucado',       sub: 'El más habitual en industria' },
  { id: 'inoxidable',   label: 'Inoxidable AISI 304/316', sub: 'Máxima resistencia a la corrosión' },
  { id: 'galvanizado',  label: 'Chapa galvanizada',       sub: 'Económico y resistente' },
  { id: 'blanca',       label: 'Chapa lacada blanca',     sub: 'Instalaciones vistas en interiores' },
  { id: 'sin-acabado',  label: 'Sin acabado exterior',    sub: 'Solo aislamiento sin forro' },
]

// ─── Tipos de equipo (calorifugado) ───────────────────────────────────────────
export const TIPOS_EQUIPO = [
  { id: 'deposito',       label: 'Depósito',                   icon: 'Cylinder' },
  { id: 'caldera',        label: 'Caldera',                    icon: 'Flame' },
  { id: 'intercambiador', label: 'Intercambiador de calor',    icon: 'Zap' },
  { id: 'valvulas',       label: 'Válvulas y bridas',          icon: 'Wrench' },
  { id: 'otro',           label: 'Otro equipo',                icon: 'Settings' },
]

// ─── Conductos ────────────────────────────────────────────────────────────────
export const TIPOS_CONDUCTO = [
  { id: 'extraccion',    label: 'Extracción',    sub: 'Aire de retorno sucio' },
  { id: 'impulsion',     label: 'Impulsión',     sub: 'Aire limpio a presión' },
  { id: 'climatizacion', label: 'Climatización', sub: 'Frío o calor climatizado' },
  { id: 'retorno',       label: 'Retorno',       sub: 'Circuito de retorno' },
]

export const MATERIALES_CONDUCTO = [
  { id: 'galvanizado', label: 'Chapa galvanizada',    sub: 'Opción estándar más habitual' },
  { id: 'inoxidable',  label: 'Inoxidable AISI 304', sub: 'Ambientes agresivos / alimentario' },
]

export const ACCESORIOS_OPTIONS = [
  { id: 'si',    label: 'Sí, los incluye', sub: 'Difusores, rejillas, compuertas cortafuego...' },
  { id: 'no',    label: 'No',             sub: 'Solo conductos principales' },
  { id: 'no-se', label: 'No lo sé',       sub: 'FRICAL me asesorará', icon: 'HardHat' },
]

// ─── Sectorización ────────────────────────────────────────────────────────────
export const ELEMENTOS_PROTEGER = [
  { id: 'conductos',   label: 'Conductos',            icon: 'Wind' },
  { id: 'estructura',  label: 'Estructura metálica',  icon: 'Building' },
  { id: 'tuberias',    label: 'Tuberías',             icon: 'Pipette' },
  { id: 'otro',        label: 'Otro elemento',        icon: 'Layers' },
]

export const SOLUCIONES_SECTORIZACION = [
  { id: 'pyromax',  label: 'Manta Pyromax', sub: 'Alta eficiencia RF120' },
  { id: 'ultimate', label: 'Ultimate',      sub: 'Máxima protección, muy delgada' },
  { id: 'no-se',    label: 'No lo sé',      sub: 'FRICAL lo determinará', icon: 'HardHat' },
]

// ─── Pasos comunes ────────────────────────────────────────────────────────────
export const SECTORES = [
  { id: 'quimico',      label: 'Industria química',       icon: 'FlaskConical' },
  { id: 'alimentario',  label: 'Industria alimentaria',   icon: 'Utensils' },
  { id: 'energetico',   label: 'Sector energético',       icon: 'Zap' },
  { id: 'naval',        label: 'Sector naval',            icon: 'Ship' },
  { id: 'farmaceutico', label: 'Industria farmacéutica',  icon: 'Pill' },
  { id: 'edificacion',  label: 'Edificación / construcción', icon: 'Building2' },
  { id: 'otro',         label: 'Otro sector',             icon: 'HardHat' },
]

export const PLAZOS = [
  { id: 'urgente',    label: 'Urgente',       sub: 'Menos de 2 semanas',              icon: 'Zap' },
  { id: 'medio',      label: '1 – 3 meses',   sub: 'Sin urgencia inmediata',          icon: 'Clock' },
  { id: 'sin-prisa',  label: 'Sin prisa',     sub: 'Estamos en fase de planificación', icon: 'Star' },
]

// ─── Definición dinámica de pasos ─────────────────────────────────────────────
export function getSteps(tiposWork) {
  const steps = [
    {
      id: 'tipoTrabajo', type: 'multicard',
      heading: '¿Qué tipo de trabajo necesitas?',
      sub: 'Puedes seleccionar más de una opción.',
      options: TIPOS_TRABAJO,
    },
  ]

  if (tiposWork.includes('aislamiento')) {
    steps.push(
      { id: 'diametros', type: 'diametros', heading: 'Diámetros de tubería a aislar', sub: 'Indica los diámetros exteriores en mm. Añade tantos como necesites.' },
      { id: 'metrosLineales', type: 'number', field: 'metrosLineales', unit: 'm', heading: 'Metros lineales totales a aislar (aproximado)', sub: 'Una estimación es suficiente para preparar el presupuesto inicial.' },
      { id: 'grosorAislamiento', type: 'grosor', fieldValue: 'grosorAislamiento', fieldUnknown: 'grosorAislamientoDesconocido', heading: 'Espesor de aislamiento deseado', sub: 'Si no lo sabes, FRICAL lo calculará según la temperatura y normativa.' },
      { id: 'temperaturaAislamiento', type: 'cards', field: 'temperaturaAislamiento', options: TEMPERATURAS, heading: 'Temperatura de trabajo de la tubería', sub: 'Selecciona el rango más cercano.' },
      { id: 'materialAislamiento', type: 'cards', field: 'materialAislamiento', options: MATERIALES, heading: 'Material de aislamiento preferido', sub: 'Si no estás seguro, selecciona "No lo sé" y FRICAL te asesorará.' },
      { id: 'acabadoAislamiento', type: 'cards', field: 'acabadoAislamiento', options: ACABADOS, heading: 'Acabado exterior deseado', sub: 'El acabado protege el aislamiento y define el aspecto visual.' },
    )
  }

  if (tiposWork.includes('calorifugado')) {
    steps.push(
      { id: 'tipoEquipo', type: 'cards', field: 'tipoEquipo', options: TIPOS_EQUIPO, heading: 'Tipo de equipo o instalación', sub: 'Indica qué elemento se va a calorifugar.' },
      { id: 'dimensiones', type: 'text', field: 'dimensiones', placeholder: 'p. ej. Depósito 3 m diámetro × 5 m altura', heading: 'Dimensiones aproximadas del equipo', sub: 'Diámetro y altura, o superficie en m². Una estimación es suficiente.' },
      { id: 'grosorCalorifugado', type: 'grosor', fieldValue: 'grosorCalorifugado', fieldUnknown: 'grosorCalorifugadoDesconocido', heading: 'Espesor de aislamiento deseado para el equipo', sub: 'Si no lo sabes, FRICAL lo calculará según la temperatura de trabajo.' },
      { id: 'temperaturaCalorifugado', type: 'cards', field: 'temperaturaCalorifugado', options: TEMPERATURAS, heading: 'Temperatura de trabajo del equipo', sub: 'Selecciona el rango de temperatura de operación.' },
      { id: 'materialCalorifugado', type: 'cards', field: 'materialCalorifugado', options: MATERIALES, heading: 'Material de aislamiento para el equipo', sub: 'Mismo criterio que en tuberías. FRICAL lo confirmará en la visita.' },
      { id: 'acabadoCalorifugado', type: 'cards', field: 'acabadoCalorifugado', options: ACABADOS, heading: 'Acabado exterior del equipo', sub: 'Para equipos, el aluminio o inoxidable son los más habituales.' },
    )
  }

  if (tiposWork.includes('conductos')) {
    steps.push(
      { id: 'tipoConducto', type: 'cards', field: 'tipoConducto', options: TIPOS_CONDUCTO, heading: 'Tipo de conducto', sub: 'Indica la función principal de la red.' },
      { id: 'materialConducto', type: 'cards', field: 'materialConducto', options: MATERIALES_CONDUCTO, heading: 'Material de los conductos', sub: 'La chapa galvanizada es la opción estándar; inoxidable para ambientes agresivos.' },
      { id: 'metrosConducto', type: 'number', field: 'metrosConducto', unit: 'm / m²', heading: 'Metros lineales o superficie aproximada', sub: 'Una estimación para preparar el presupuesto inicial.' },
      { id: 'accesoriosConducto', type: 'cards', field: 'accesoriosConducto', options: ACCESORIOS_OPTIONS, heading: '¿La red incluye difusores, rejillas o compuertas cortafuego?', sub: 'Incluir estos elementos permite un presupuesto más completo.' },
    )
  }

  if (tiposWork.includes('sectorizacion')) {
    steps.push(
      { id: 'elementoProteger', type: 'cards', field: 'elementoProteger', options: ELEMENTOS_PROTEGER, heading: 'Elemento a proteger con RF120', sub: 'Indica qué parte de la instalación requiere resistencia al fuego.' },
      { id: 'solucionSectorizacion', type: 'cards', field: 'solucionSectorizacion', options: SOLUCIONES_SECTORIZACION, heading: 'Solución de sectorización preferida', sub: 'Ambas cumplen RF120. FRICAL recomendará la más idónea.' },
      { id: 'metrosSectorizacion', type: 'number', field: 'metrosSectorizacion', unit: 'm / m²', heading: 'Metros lineales o superficie a proteger (aproximado)', sub: 'Una estimación para el presupuesto inicial.' },
    )
  }

  steps.push(
    { id: 'sector', type: 'cards', field: 'sector', options: SECTORES, heading: 'Sector de la instalación', sub: 'Nos permite aplicar normativas y materiales específicos de cada industria.' },
    { id: 'ubicacion', type: 'text', field: 'ubicacion', placeholder: 'p. ej. Molins de Rei, Barcelona', heading: 'Ubicación de la obra', sub: 'Localidad y provincia. Necesario para planificar la visita técnica.' },
    { id: 'plazo', type: 'cards', field: 'plazo', options: PLAZOS, heading: 'Plazo deseado para el inicio de la obra', sub: 'Intentaremos adaptarnos al plazo indicado.' },
    { id: 'planos', type: 'upload', heading: 'Adjuntar planos, fotos o documentación (opcional)', sub: 'Cuanta más información recibamos, más preciso será el presupuesto.' },
    { id: 'contacto', type: 'contacto', heading: 'Tus datos de contacto', sub: 'Para enviarte el presupuesto personalizado en menos de 72 horas.' },
    { id: 'resumen', type: 'summary', heading: 'Resumen de tu configuración', sub: 'Revisa los datos antes de enviar la solicitud a FRICAL.' },
  )

  return steps
}

// ─── Labels para el resumen ───────────────────────────────────────────────────
export const LABEL_MAPS = {
  tiposWork: Object.fromEntries(TIPOS_TRABAJO.map(t => [t.id, t.label])),
  temperatura: Object.fromEntries(TEMPERATURAS.map(t => [t.id, t.label])),
  material: Object.fromEntries(MATERIALES.map(t => [t.id, t.label])),
  acabado: Object.fromEntries(ACABADOS.map(t => [t.id, t.label])),
  tipoEquipo: Object.fromEntries(TIPOS_EQUIPO.map(t => [t.id, t.label])),
  tipoConducto: Object.fromEntries(TIPOS_CONDUCTO.map(t => [t.id, t.label])),
  materialConducto: Object.fromEntries(MATERIALES_CONDUCTO.map(t => [t.id, t.label])),
  accesorios: Object.fromEntries(ACCESORIOS_OPTIONS.map(t => [t.id, t.label])),
  elementoProteger: Object.fromEntries(ELEMENTOS_PROTEGER.map(t => [t.id, t.label])),
  solucion: Object.fromEntries(SOLUCIONES_SECTORIZACION.map(t => [t.id, t.label])),
  sector: Object.fromEntries(SECTORES.map(t => [t.id, t.label])),
  plazo: Object.fromEntries(PLAZOS.map(t => [t.id, t.label])),
}
