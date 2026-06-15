import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import styles from './admin.module.css'

function fmt(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    + ' ' + d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

const TIPO_LABEL = {
  aislamiento:   'Aislamiento tuberías',
  calorifugado:  'Calorifugado depósitos',
  conductos:     'Conductos ventilación',
  sectorizacion: 'Sectorización RF120',
}

function ConfigSummary({ cfg }) {
  if (!cfg || typeof cfg !== 'object') return <span style={{ color: '#555' }}>—</span>
  const items = Object.entries(cfg)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
  return (
    <ul style={{ margin: 0, padding: '0 0 0 14px', listStyle: 'disc', color: '#bbb' }}>
      {items.map((i, idx) => <li key={idx} style={{ fontSize: 12, marginBottom: 2 }}>{i}</li>)}
    </ul>
  )
}

export default function AdminPresupuestos() {
  const { setCounts } = useOutletContext()
  const [rows, setRows]         = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [adjUrl, setAdjUrl]     = useState(null)
  const [dbError, setDbError]   = useState(null)

  async function load() {
    setLoading(true)
    setDbError(null)
    try {
      const { data, error } = await supabase
        .from('configurator_requests')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setRows(data || [])
    } catch (err) {
      setDbError(err?.message || 'Error al cargar presupuestos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function markRead(id) {
    await supabase.from('configurator_requests').update({ leido: true }).eq('id', id)
    setRows(prev => prev.map(r => r.id === id ? { ...r, leido: true } : r))
    if (selected?.id === id) setSelected(prev => ({ ...prev, leido: true }))
    setCounts(prev => ({ ...prev, cfg: Math.max(0, prev.cfg - 1) }))
  }

  async function handleSelect(row) {
    setSelected(row)
    setAdjUrl(null)
    if (!row.leido) await markRead(row.id)

    if (row.adjunto_url) {
      const { data } = await supabase.storage
        .from('private-uploads')
        .createSignedUrl(row.adjunto_url, 60 * 60 * 24)
      setAdjUrl(data?.signedUrl || null)
    }
  }

  const unread = rows.filter(r => !r.leido).length

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Solicitudes de presupuesto</h1>
          <p className={styles.pageSubtitle}>{rows.length} total · {unread} sin leer</p>
        </div>
        <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`} onClick={load}>
          Actualizar
        </button>
      </div>

      <div className={styles.content}>
        {dbError && <div className={styles.dbError}>Error de base de datos: {dbError}</div>}
        {loading ? (
          <p style={{ color: '#555' }}>Cargando…</p>
        ) : rows.length === 0 ? (
          <div className={styles.empty}><p>No hay solicitudes todavía.</p></div>
        ) : (
          <div className={styles.splitWrap}>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Solicitante</th>
                    <th>Tipos</th>
                    <th>Plazo</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(r => {
                    const tipos = (r.tipos_trabajo || []).map(t => TIPO_LABEL[t] || t).join(', ')
                    return (
                      <tr
                        key={r.id}
                        onClick={() => handleSelect(r)}
                        className={selected?.id === r.id ? styles.rowSelected : ''}
                        style={{ cursor: 'pointer' }}
                      >
                        <td>
                          <div className={styles.cellMain}>{r.nombre}</div>
                          <div className={styles.cellSub}>{r.email}</div>
                          {r.empresa && <div className={styles.cellSub}>{r.empresa}</div>}
                        </td>
                        <td><div className={styles.cellSub}>{tipos || '—'}</div></td>
                        <td><div className={styles.cellSub}>{r.plazo || '—'}</div></td>
                        <td><div className={styles.cellDate}>{fmt(r.created_at)}</div></td>
                        <td>
                          <span className={`${styles.pill} ${r.leido ? styles.pillRead : styles.pillNew}`}>
                            {r.leido ? 'Leída' : 'Nueva'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className={styles.detailPanel}>
              {!selected ? (
                <p className={styles.detailPanelEmpty}>Haz clic en una solicitud para verla</p>
              ) : (
                <>
                  <p className={styles.detailName}>{selected.nombre}</p>
                  <p className={styles.detailMeta}>{fmt(selected.created_at)}</p>

                  <div className={styles.detailField}>
                    <div className={styles.detailLabel}>Email</div>
                    <div className={styles.detailValue}>
                      <a href={`mailto:${selected.email}`} className={styles.detailLink}>{selected.email}</a>
                    </div>
                  </div>
                  {selected.telefono && (
                    <div className={styles.detailField}>
                      <div className={styles.detailLabel}>Teléfono</div>
                      <div className={styles.detailValue}>
                        <a href={`tel:${selected.telefono}`} className={styles.detailLink}>{selected.telefono}</a>
                      </div>
                    </div>
                  )}
                  {selected.empresa && (
                    <div className={styles.detailField}>
                      <div className={styles.detailLabel}>Empresa</div>
                      <div className={styles.detailValue}>{selected.empresa}</div>
                    </div>
                  )}
                  {selected.sector && (
                    <div className={styles.detailField}>
                      <div className={styles.detailLabel}>Sector</div>
                      <div className={styles.detailValue}>{selected.sector}</div>
                    </div>
                  )}
                  {selected.ubicacion && (
                    <div className={styles.detailField}>
                      <div className={styles.detailLabel}>Ubicación</div>
                      <div className={styles.detailValue}>{selected.ubicacion}</div>
                    </div>
                  )}
                  {selected.plazo && (
                    <div className={styles.detailField}>
                      <div className={styles.detailLabel}>Plazo</div>
                      <div className={styles.detailValue}>{selected.plazo}</div>
                    </div>
                  )}
                  <div className={styles.detailField}>
                    <div className={styles.detailLabel}>Configuración</div>
                    <ConfigSummary cfg={selected.configuracion} />
                  </div>

                  <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <a
                      href={`mailto:${selected.email}?subject=Presupuesto FRICAL`}
                      className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}
                      style={{ textDecoration: 'none' }}
                    >
                      Responder
                    </a>
                    {adjUrl && (
                      <a
                        href={adjUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}
                        style={{ textDecoration: 'none' }}
                      >
                        Ver adjunto
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
