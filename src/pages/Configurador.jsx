import { useReducer, useMemo, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import {
  Pipette, Cylinder, Wind, Shield, Snowflake, Thermometer, ThermometerSun,
  Flame, Zap, Wrench, HardHat, FlaskConical, Utensils, Ship, Pill, Building,
  Building2, Layers, Clock, Star, Check, ArrowRight, ArrowLeft, Upload, File,
  Plus, X, Send, CheckCircle, Download, Settings, Loader2,
} from 'lucide-react'
import { useSeo } from '../hooks/useSeo'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'
import { supabase } from '../lib/supabase'
import {
  TIPOS_TRABAJO, TEMPERATURAS, MATERIALES, ACABADOS, TIPOS_EQUIPO,
  TIPOS_CONDUCTO, MATERIALES_CONDUCTO, ACCESORIOS_OPTIONS,
  ELEMENTOS_PROTEGER, SOLUCIONES_SECTORIZACION, SECTORES, PLAZOS,
  getSteps, LABEL_MAPS,
} from '../data/configurador'
import styles from './Configurador.module.css'

// ─── Icon lookup map (string name → component) ────────────────────────────────
const ICON_MAP = {
  Pipette, Cylinder, Wind, Shield, Snowflake, Thermometer, ThermometerSun,
  Flame, Zap, Wrench, HardHat, FlaskConical, Utensils, Ship, Pill, Building,
  Building2, Layers, Clock, Star, Check, Settings,
}

// ─── State ────────────────────────────────────────────────────────────────────
const INITIAL = {
  stepIndex: 0,
  tiposWork: [],
  // Aislamiento
  diametros: [{ id: 1, value: '' }],
  metrosLineales: '',
  grosorAislamiento: '',
  grosorAislamientoDesconocido: false,
  temperaturaAislamiento: '',
  materialAislamiento: '',
  acabadoAislamiento: '',
  // Calorifugado
  tipoEquipo: '',
  dimensiones: '',
  grosorCalorifugado: '',
  grosorCalorifugadoDesconocido: false,
  temperaturaCalorifugado: '',
  materialCalorifugado: '',
  acabadoCalorifugado: '',
  // Conductos
  tipoConducto: '',
  materialConducto: '',
  metrosConducto: '',
  accesoriosConducto: '',
  // Sectorización
  elementoProteger: '',
  solucionSectorizacion: '',
  metrosSectorizacion: '',
  // Comunes
  sector: '',
  ubicacion: '',
  plazo: '',
  planos: null,
  nombre: '',
  empresa: '',
  email: '',
  telefono: '',
  privacidad: false,
  sent: false,
  sending: false,
  sendError: '',
}

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_TIPO': {
      const tiposWork = state.tiposWork.includes(action.id)
        ? state.tiposWork.filter(t => t !== action.id)
        : [...state.tiposWork, action.id]
      return { ...state, tiposWork }
    }
    case 'SET':
      return { ...state, [action.field]: action.value }
    case 'ADD_DIAMETRO':
      return { ...state, diametros: [...state.diametros, { id: Date.now(), value: '' }] }
    case 'UPDATE_DIAMETRO':
      return { ...state, diametros: state.diametros.map(d => d.id === action.id ? { ...d, value: action.value } : d) }
    case 'REMOVE_DIAMETRO':
      if (state.diametros.length <= 1) return state
      return { ...state, diametros: state.diametros.filter(d => d.id !== action.id) }
    case 'NEXT':
      return { ...state, stepIndex: state.stepIndex + 1 }
    case 'PREV':
      return { ...state, stepIndex: Math.max(0, state.stepIndex - 1) }
    case 'SEND_START':
      return { ...state, sending: true, sendError: '' }
    case 'SEND_SUCCESS':
      return { ...state, sending: false, sent: true }
    case 'SEND_ERROR':
      return { ...state, sending: false, sendError: action.error }
    default:
      return state
  }
}

// ─── Step validation ──────────────────────────────────────────────────────────
function isValid(step, state) {
  if (!step) return false
  switch (step.type) {
    case 'multicard':   return state.tiposWork.length > 0
    case 'diametros':   return state.diametros.some(d => d.value.trim() !== '')
    case 'number':      return (state[step.field] ?? '').toString().trim() !== ''
    case 'grosor':      return state[step.fieldValue]?.trim() !== '' || state[step.fieldUnknown]
    case 'cards':       return (state[step.field] ?? '') !== ''
    case 'text':        return (state[step.field] ?? '').trim() !== ''
    case 'upload':      return true
    case 'contacto':    return state.nombre.trim() !== '' && state.email.includes('@') && state.privacidad
    case 'summary':     return true
    default:            return true
  }
}

// ─── Step sub-components ──────────────────────────────────────────────────────

function MultiCards({ step, state, dispatch }) {
  return (
    <div className={`${styles.cardGrid} ${styles.cardGrid2}`}>
      {step.options.map(opt => {
        const Icon = ICON_MAP[opt.icon]
        const selected = state.tiposWork.includes(opt.id)
        return (
          <button
            key={opt.id}
            type="button"
            className={`${styles.optCard} ${selected ? styles.optCardSelected : ''}`}
            onClick={() => dispatch({ type: 'TOGGLE_TIPO', id: opt.id })}
            aria-pressed={selected}
          >
            {selected && (
              <div className={styles.optCheck} aria-hidden="true">
                <Check size={13} />
              </div>
            )}
            {Icon && <div className={styles.optIcon}><Icon size={24} aria-hidden="true" /></div>}
            <strong className={styles.optLabel}>{opt.label}</strong>
            <span className={styles.optSub}>{opt.desc}</span>
          </button>
        )
      })}
    </div>
  )
}

function CardSelect({ step, state, dispatch }) {
  return (
    <div className={styles.cardGrid}>
      {step.options.map(opt => {
        const Icon = opt.icon ? ICON_MAP[opt.icon] : null
        const selected = state[step.field] === opt.id
        return (
          <button
            key={opt.id}
            type="button"
            className={`${styles.optCard} ${selected ? styles.optCardSelected : ''}`}
            onClick={() => dispatch({ type: 'SET', field: step.field, value: opt.id })}
            aria-pressed={selected}
          >
            {selected && (
              <div className={styles.optCheck} aria-hidden="true">
                <Check size={13} />
              </div>
            )}
            {Icon && <div className={styles.optIcon}><Icon size={22} aria-hidden="true" /></div>}
            <strong className={styles.optLabel}>{opt.label}</strong>
            {opt.sub && <span className={styles.optSub}>{opt.sub}</span>}
          </button>
        )
      })}
    </div>
  )
}

function NumberStep({ step, state, dispatch }) {
  return (
    <div className={styles.numWrap}>
      <input
        type="number"
        min="0"
        value={state[step.field] ?? ''}
        onChange={e => dispatch({ type: 'SET', field: step.field, value: e.target.value })}
        className={styles.numInput}
        placeholder="0"
        aria-label={step.heading}
      />
      {step.unit && <span className={styles.unit}>{step.unit}</span>}
    </div>
  )
}

function TextStep({ step, state, dispatch }) {
  return (
    <input
      type="text"
      value={state[step.field] ?? ''}
      onChange={e => dispatch({ type: 'SET', field: step.field, value: e.target.value })}
      className={styles.textInput}
      placeholder={step.placeholder || ''}
      aria-label={step.heading}
    />
  )
}

function GrosorStep({ step, state, dispatch }) {
  const isUnknown = state[step.fieldUnknown]
  return (
    <div className={styles.grosorWrap}>
      <div className={styles.numWrap}>
        <input
          type="number"
          min="10"
          max="300"
          step="5"
          value={isUnknown ? '' : (state[step.fieldValue] ?? '')}
          disabled={isUnknown}
          onChange={e => dispatch({ type: 'SET', field: step.fieldValue, value: e.target.value })}
          className={styles.numInput}
          placeholder="50"
          aria-label="Espesor en milímetros"
        />
        <span className={styles.unit}>mm</span>
      </div>
      <label className={styles.unknownLabel}>
        <input
          type="checkbox"
          checked={isUnknown}
          onChange={e => {
            dispatch({ type: 'SET', field: step.fieldUnknown, value: e.target.checked })
            if (e.target.checked) dispatch({ type: 'SET', field: step.fieldValue, value: '' })
          }}
        />
        No lo sé — que aconseje FRICAL según normativa
      </label>
    </div>
  )
}

function DiametrosStep({ state, dispatch }) {
  return (
    <div className={styles.diametrosList}>
      {state.diametros.map((d, idx) => (
        <div key={d.id} className={styles.diametroRow}>
          <span className={styles.diametroLabel}>Ø {idx + 1}</span>
          <div className={styles.diametroInputRow}>
            <input
              type="number"
              min="6"
              max="2000"
              value={d.value}
              onChange={e => dispatch({ type: 'UPDATE_DIAMETRO', id: d.id, value: e.target.value })}
              className={styles.diametroNum}
              placeholder="p.ej. 100"
              aria-label={`Diámetro ${idx + 1} en milímetros`}
            />
            <span className={styles.unit}>mm</span>
            {state.diametros.length > 1 && (
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => dispatch({ type: 'REMOVE_DIAMETRO', id: d.id })}
                aria-label={`Eliminar diámetro ${idx + 1}`}
              >
                <X size={14} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      ))}
      <button
        type="button"
        className={styles.addBtn}
        onClick={() => dispatch({ type: 'ADD_DIAMETRO' })}
      >
        <Plus size={14} aria-hidden="true" />
        Añadir otro diámetro
      </button>
    </div>
  )
}

function UploadStep({ state, dispatch, onSkip }) {
  const hasFiles = state.planos && state.planos.length > 0
  return (
    <div>
      <div className={styles.uploadZone}>
        <input
          type="file"
          accept=".pdf,.dwg,.jpg,.jpeg,.png"
          multiple
          className={styles.uploadInput}
          onChange={e => dispatch({ type: 'SET', field: 'planos', value: e.target.files })}
          aria-label="Adjuntar planos, fotos o documentación"
        />
        <Upload size={32} className={styles.uploadIcon} aria-hidden="true" />
        <p className={styles.uploadText}>Arrastra aquí tus archivos o haz clic para seleccionar</p>
        <p className={styles.uploadHint}>PDF, DWG, JPG, PNG — máx. 20 MB por archivo</p>
        {hasFiles && (
          <div className={styles.uploadFiles}>
            {[...state.planos].map((f, i) => (
              <span key={i} className={styles.uploadFile}>
                <File size={12} aria-hidden="true" /> {f.name}
              </span>
            ))}
          </div>
        )}
      </div>
      <button type="button" className={styles.skipLink} onClick={onSkip}>
        Omitir este paso →
      </button>
    </div>
  )
}

function ContactoStep({ state, dispatch }) {
  return (
    <div className={styles.contactForm}>
      <div className={styles.formRow}>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Nombre <span>*</span></label>
          <input
            type="text" autoComplete="name"
            value={state.nombre}
            onChange={e => dispatch({ type: 'SET', field: 'nombre', value: e.target.value })}
            className={styles.formInput}
            placeholder="Tu nombre"
          />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Empresa</label>
          <input
            type="text" autoComplete="organization"
            value={state.empresa}
            onChange={e => dispatch({ type: 'SET', field: 'empresa', value: e.target.value })}
            className={styles.formInput}
            placeholder="Nombre de empresa"
          />
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Email <span>*</span></label>
          <input
            type="text" inputMode="email" autoComplete="email"
            value={state.email}
            onChange={e => dispatch({ type: 'SET', field: 'email', value: e.target.value })}
            className={styles.formInput}
            placeholder="tu@empresa.com"
          />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Teléfono</label>
          <input
            type="text" inputMode="tel" autoComplete="tel"
            value={state.telefono}
            onChange={e => dispatch({ type: 'SET', field: 'telefono', value: e.target.value })}
            className={styles.formInput}
            placeholder="+34 600 000 000"
          />
        </div>
      </div>
      <label className={styles.privacyRow}>
        <input
          type="checkbox"
          checked={state.privacidad}
          onChange={e => dispatch({ type: 'SET', field: 'privacidad', value: e.target.checked })}
        />
        <span>
          He leído y acepto la{' '}
          <a href="/politica-de-privacidad" target="_blank" rel="noopener" className={styles.privacyLink}>
            política de privacidad
          </a>{' '}*
        </span>
      </label>
    </div>
  )
}

// ─── Summary ──────────────────────────────────────────────────────────────────
function buildSummary(state) {
  const sections = []
  const L = LABEL_MAPS

  sections.push({
    title: 'Tipo de trabajo',
    rows: [{ key: 'Servicios', val: state.tiposWork.map(t => L.tiposWork[t]).join(', ') || '—' }],
  })

  if (state.tiposWork.includes('aislamiento')) {
    sections.push({
      title: 'Aislamiento de tuberías',
      rows: [
        { key: 'Diámetros (mm)', val: state.diametros.filter(d => d.value).map(d => `Ø ${d.value} mm`).join(', ') || '—' },
        { key: 'Metros lineales', val: state.metrosLineales ? `${state.metrosLineales} m` : '—' },
        { key: 'Espesor', val: state.grosorAislamientoDesconocido ? 'A criterio de FRICAL' : state.grosorAislamiento ? `${state.grosorAislamiento} mm` : '—' },
        { key: 'Temperatura', val: L.temperatura[state.temperaturaAislamiento] || '—' },
        { key: 'Material', val: L.material[state.materialAislamiento] || '—' },
        { key: 'Acabado', val: L.acabado[state.acabadoAislamiento] || '—' },
      ],
    })
  }

  if (state.tiposWork.includes('calorifugado')) {
    sections.push({
      title: 'Calorifugado de equipos',
      rows: [
        { key: 'Tipo de equipo', val: L.tipoEquipo[state.tipoEquipo] || '—' },
        { key: 'Dimensiones', val: state.dimensiones || '—' },
        { key: 'Espesor', val: state.grosorCalorifugadoDesconocido ? 'A criterio de FRICAL' : state.grosorCalorifugado ? `${state.grosorCalorifugado} mm` : '—' },
        { key: 'Temperatura', val: L.temperatura[state.temperaturaCalorifugado] || '—' },
        { key: 'Material', val: L.material[state.materialCalorifugado] || '—' },
        { key: 'Acabado', val: L.acabado[state.acabadoCalorifugado] || '—' },
      ],
    })
  }

  if (state.tiposWork.includes('conductos')) {
    sections.push({
      title: 'Conductos de ventilación',
      rows: [
        { key: 'Tipo', val: L.tipoConducto[state.tipoConducto] || '—' },
        { key: 'Material', val: L.materialConducto[state.materialConducto] || '—' },
        { key: 'Metros / m²', val: state.metrosConducto ? `${state.metrosConducto} m / m²` : '—' },
        { key: 'Accesorios', val: L.accesorios[state.accesoriosConducto] || '—' },
      ],
    })
  }

  if (state.tiposWork.includes('sectorizacion')) {
    sections.push({
      title: 'Sectorización RF120',
      rows: [
        { key: 'Elemento', val: L.elementoProteger[state.elementoProteger] || '—' },
        { key: 'Solución', val: L.solucion[state.solucionSectorizacion] || '—' },
        { key: 'Metros / m²', val: state.metrosSectorizacion ? `${state.metrosSectorizacion} m / m²` : '—' },
      ],
    })
  }

  sections.push({
    title: 'Datos generales',
    rows: [
      { key: 'Sector', val: L.sector[state.sector] || '—' },
      { key: 'Ubicación', val: state.ubicacion || '—' },
      { key: 'Plazo', val: L.plazo[state.plazo] || '—' },
      { key: 'Documentación', val: state.planos?.length ? `${state.planos.length} archivo(s)` : 'Sin adjuntos' },
    ],
  })

  sections.push({
    title: 'Datos de contacto',
    rows: [
      { key: 'Nombre', val: state.nombre || '—' },
      { key: 'Empresa', val: state.empresa || '—' },
      { key: 'Email', val: state.email || '—' },
      { key: 'Teléfono', val: state.telefono || '—' },
    ],
  })

  return sections
}

function generateSummaryText(state) {
  const sections = buildSummary(state)
  const lines = ['SOLICITUD DE PRESUPUESTO — FRICAL CALORIFUGADOS, S.L.', '='.repeat(54), '']
  sections.forEach(s => {
    lines.push(`## ${s.title}`)
    s.rows.forEach(r => lines.push(`   ${r.key}: ${r.val}`))
    lines.push('')
  })
  lines.push(`Generado el ${new Date().toLocaleDateString('es-ES')}`)
  return lines.join('\n')
}

function SummaryStep({ state, onSend }) {
  const sections = buildSummary(state)

  const handleDownload = () => {
    const blob = new Blob([generateSummaryText(state)], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'presupuesto-frical.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className={styles.summaryWrap}>
      {sections.map(s => (
        <div key={s.title} className={styles.summarySection}>
          <div className={styles.summarySectionTitle}>{s.title}</div>
          <div className={styles.summaryRows}>
            {s.rows.map(r => (
              <div key={r.key} className={styles.summaryRow}>
                <span className={styles.summaryKey}>{r.key}</span>
                <span className={styles.summaryVal}>{r.val}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {state.sendError && (
        <p role="alert" style={{ color: '#e53935', fontSize: '13px', margin: '8px 0 0' }}>
          {state.sendError}
        </p>
      )}

      <div className={styles.summaryActions}>
        <button type="button" className={styles.dlBtn} onClick={handleDownload} disabled={state.sending}>
          <Download size={15} aria-hidden="true" />
          Descargar resumen
        </button>
        <button type="button" className="btn-primary" onClick={onSend} disabled={state.sending}>
          {state.sending
            ? <><Loader2 size={15} strokeWidth={1.8} style={{ animation: 'spin 1s linear infinite' }} aria-hidden="true" /> Enviando...</>
            : <><Send size={15} aria-hidden="true" /> Enviar solicitud a FRICAL</>
          }
        </button>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Configurador() {
  useSeo({
    title: 'Configurador de presupuesto | FRICAL CALORIFUGADOS, S.L.',
    description: 'Configura tu proyecto de aislamiento térmico o conductos de ventilación paso a paso. FRICAL te enviará un presupuesto detallado en menos de 72 horas.',
    url: 'https://fricalcalorifugados.com/configurador',
  })

  const [state, dispatch] = useReducer(reducer, INITIAL)
  const steps = useMemo(() => getSteps(state.tiposWork), [state.tiposWork])
  const step = steps[state.stepIndex]
  const progress = ((state.stepIndex + 1) / steps.length) * 100

  const stepRef  = useRef(null)
  const dirRef   = useRef(1)

  // GSAP entrance on step change
  useEffect(() => {
    if (!stepRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.fromTo(
      stepRef.current,
      { x: dirRef.current * 56, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
    )
  }, [state.stepIndex])

  const handleNext = () => {
    dirRef.current = 1
    dispatch({ type: 'NEXT' })
  }

  const handlePrev = () => {
    dirRef.current = -1
    dispatch({ type: 'PREV' })
  }

  const handleSkipUpload = () => {
    dirRef.current = 1
    dispatch({ type: 'NEXT' })
  }

  const handleSend = async () => {
    dispatch({ type: 'SEND_START' })
    try {
      // 1. Subir primer plano al bucket (si existe)
      let adjunto_url = ''
      if (state.planos && state.planos.length > 0) {
        const file = state.planos[0]
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
        const path = `adjuntos/${Date.now()}-${safeName}`
        const { error: upErr } = await supabase.storage
          .from('private-uploads')
          .upload(path, file, { contentType: file.type })
        if (upErr) throw new Error('No se pudo subir el adjunto. Comprueba tu conexión e inténtalo de nuevo.')
        adjunto_url = path
      }

      // 2. Construir objeto de configuración técnica
      const configuracion = {
        diametros: state.diametros.filter(d => d.value).map(d => d.value),
        metrosLineales: state.metrosLineales,
        grosorAislamiento: state.grosorAislamiento,
        grosorAislamientoDesconocido: state.grosorAislamientoDesconocido,
        temperaturaAislamiento: state.temperaturaAislamiento,
        materialAislamiento: state.materialAislamiento,
        acabadoAislamiento: state.acabadoAislamiento,
        tipoEquipo: state.tipoEquipo,
        dimensiones: state.dimensiones,
        grosorCalorifugado: state.grosorCalorifugado,
        grosorCalorifugadoDesconocido: state.grosorCalorifugadoDesconocido,
        temperaturaCalorifugado: state.temperaturaCalorifugado,
        materialCalorifugado: state.materialCalorifugado,
        acabadoCalorifugado: state.acabadoCalorifugado,
        tipoConducto: state.tipoConducto,
        materialConducto: state.materialConducto,
        metrosConducto: state.metrosConducto,
        accesoriosConducto: state.accesoriosConducto,
        elementoProteger: state.elementoProteger,
        solucionSectorizacion: state.solucionSectorizacion,
        metrosSectorizacion: state.metrosSectorizacion,
      }

      // 3. Enviar a la API
      const res = await fetch('/api/configurador', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre:       state.nombre.trim(),
          empresa:      state.empresa.trim(),
          email:        state.email.trim(),
          telefono:     state.telefono.trim(),
          configuracion,
          tipos_trabajo: state.tiposWork,
          sector:       state.sector,
          ubicacion:    state.ubicacion,
          plazo:        state.plazo,
          adjunto_url,
        }),
      })
      let data = {}
      try { data = await res.json() } catch { /* API no corriendo */ }
      if (!res.ok) throw new Error(data.error || `Error del servidor (${res.status}).`)
      dispatch({ type: 'SEND_SUCCESS' })
    } catch (err) {
      dispatch({ type: 'SEND_ERROR', error: err.message || 'No se pudo enviar la solicitud. Inténtalo de nuevo.' })
    }
  }

  const stepValid = isValid(step, state)

  // ── Sent state ──────────────────────────────────────────────────────────────
  if (state.sent) {
    return (
      <>
        <div className={styles.page}>
          <div className={styles.topBar}>
            <div className={`container ${styles.topBarInner}`}>
              <Link to="/" className={styles.logo} aria-label="FRICAL – inicio">
                <svg width="90" height="22" viewBox="0 0 110 28" fill="none" aria-hidden="true">
                  <text x="0" y="22" fontFamily="Archivo, Arial Black, sans-serif" fontSize="24" fontWeight="900" fill="#7ed957">FRICAL</text>
                </svg>
                <span className={styles.logoSub}>CALORIFUGADOS, S.L.</span>
              </Link>
            </div>
          </div>
          <main className={styles.main}>
            <div className={styles.success}>
              <div className={styles.successCircle}>
                <CheckCircle size={40} aria-hidden="true" />
              </div>
              <h1 className={styles.successTitle}>¡Solicitud enviada!</h1>
              <p className={styles.successDesc}>
                Hemos recibido tu configuración. Nuestro equipo técnico la revisará y te
                enviará un presupuesto detallado en menos de{' '}
                <strong style={{ color: 'var(--frical-green)' }}>72 horas</strong>.
              </p>
              <Link to="/" className="btn-secondary" style={{ marginTop: 8 }}>
                Volver al inicio
              </Link>
            </div>
          </main>
        </div>
      </>
    )
  }

  // ── Wizard ─────────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <div className={`container ${styles.topBarInner}`}>
          <Link to="/" className={styles.logo} aria-label="FRICAL – inicio">
            <svg width="90" height="22" viewBox="0 0 110 28" fill="none" aria-hidden="true">
              <text x="0" y="22" fontFamily="Archivo, Arial Black, sans-serif" fontSize="24" fontWeight="900" fill="#7ed957">FRICAL</text>
            </svg>
            <span className={styles.logoSub}>CALORIFUGADOS, S.L.</span>
          </Link>
          <nav className={styles.breadcrumb} aria-label="Migas de pan">
            <Link to="/">Inicio</Link>
            <span aria-hidden="true">›</span>
            <span>Configurador de presupuesto</span>
          </nav>
        </div>
        {/* Progress bar */}
        <div className={styles.progressWrap} role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <main className={styles.main}>
        {/* Step meta */}
        <p className={styles.stepMeta} aria-live="polite">
          Paso {state.stepIndex + 1} de {steps.length}
        </p>

        {/* Step content — animated on step change */}
        <div ref={stepRef} className={styles.stepContent}>
          <h1 className={styles.stepHeading}>{step?.heading}</h1>
          {step?.sub && <p className={styles.stepSub}>{step.sub}</p>}

          {step?.type === 'multicard'  && <MultiCards step={step} state={state} dispatch={dispatch} />}
          {step?.type === 'cards'      && <CardSelect step={step} state={state} dispatch={dispatch} />}
          {step?.type === 'number'     && <NumberStep step={step} state={state} dispatch={dispatch} />}
          {step?.type === 'text'       && <TextStep   step={step} state={state} dispatch={dispatch} />}
          {step?.type === 'grosor'     && <GrosorStep step={step} state={state} dispatch={dispatch} />}
          {step?.type === 'diametros'  && <DiametrosStep state={state} dispatch={dispatch} />}
          {step?.type === 'upload'     && <UploadStep state={state} dispatch={dispatch} onSkip={handleSkipUpload} />}
          {step?.type === 'contacto'   && <ContactoStep state={state} dispatch={dispatch} />}
          {step?.type === 'summary'    && <SummaryStep state={state} onSend={handleSend} />}
        </div>

        {/* Navigation — hidden on summary (summary has its own send button) */}
        {step?.type !== 'summary' && (
          <div className={styles.navBar}>
            <button
              type="button"
              className={styles.navBack}
              onClick={handlePrev}
              disabled={state.stepIndex === 0}
              aria-label="Paso anterior"
            >
              <ArrowLeft size={15} aria-hidden="true" />
              Atrás
            </button>

            <span className={styles.navCounter}>
              {state.stepIndex + 1} / {steps.length}
            </span>

            <button
              type="button"
              className={styles.navNext}
              onClick={handleNext}
              disabled={!stepValid}
              aria-label="Siguiente paso"
            >
              Siguiente
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Back button on summary */}
        {step?.type === 'summary' && (
          <div className={styles.navBar}>
            <button
              type="button"
              className={styles.navBack}
              onClick={handlePrev}
              disabled={state.sending}
              aria-label="Volver al paso anterior"
            >
              <ArrowLeft size={15} aria-hidden="true" />
              Atrás
            </button>
            <span className={styles.navCounter}>
              {state.stepIndex + 1} / {steps.length}
            </span>
          </div>
        )}
      </main>

      <WhatsAppButton />
    </div>
  )
}
