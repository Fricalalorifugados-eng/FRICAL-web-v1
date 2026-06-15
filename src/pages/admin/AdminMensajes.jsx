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

export default function AdminMensajes() {
  const { setCounts } = useOutletContext()
  const [rows, setRows]       = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dbError, setDbError] = useState(null)

  async function load() {
    setLoading(true)
    setDbError(null)
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setRows(data || [])
    } catch (err) {
      setDbError(err?.message || 'Error al cargar mensajes.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function markRead(id) {
    await supabase.from('messages').update({ leido: true }).eq('id', id)
    setRows(prev => prev.map(r => r.id === id ? { ...r, leido: true } : r))
    if (selected?.id === id) setSelected(prev => ({ ...prev, leido: true }))
    setCounts(prev => ({ ...prev, msg: Math.max(0, prev.msg - 1) }))
  }

  async function handleSelect(row) {
    setSelected(row)
    if (!row.leido) await markRead(row.id)
  }

  const unread = rows.filter(r => !r.leido).length

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Mensajes de contacto</h1>
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
          <div className={styles.empty}><p>No hay mensajes todavía.</p></div>
        ) : (
          <div className={styles.splitWrap}>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Remitente</th>
                    <th>Servicio</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(r => (
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
                      <td><div className={styles.cellSub}>{r.servicio || '—'}</div></td>
                      <td><div className={styles.cellDate}>{fmt(r.created_at)}</div></td>
                      <td>
                        <span className={`${styles.pill} ${r.leido ? styles.pillRead : styles.pillNew}`}>
                          {r.leido ? 'Leído' : 'Nuevo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.detailPanel}>
              {!selected ? (
                <p className={styles.detailPanelEmpty}>Haz clic en un mensaje para verlo</p>
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
                  {selected.servicio && (
                    <div className={styles.detailField}>
                      <div className={styles.detailLabel}>Servicio de interés</div>
                      <div className={styles.detailValue}>{selected.servicio}</div>
                    </div>
                  )}
                  <div className={styles.detailField}>
                    <div className={styles.detailLabel}>Mensaje</div>
                    <div className={styles.detailValue}>{selected.mensaje}</div>
                  </div>

                  <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                    <a
                      href={`mailto:${selected.email}?subject=Re: consulta FRICAL`}
                      className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}
                      style={{ textDecoration: 'none' }}
                    >
                      Responder
                    </a>
                    {!selected.leido && (
                      <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`} onClick={() => markRead(selected.id)}>
                        Marcar leído
                      </button>
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
