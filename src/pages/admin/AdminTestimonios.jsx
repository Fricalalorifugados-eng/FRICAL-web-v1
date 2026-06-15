import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import styles from './admin.module.css'

const EMPTY = { iniciales: '', nombre: '', cargo: '', cita: '', orden: 0, visible: true }

function RowItem({ row, onEdit, onToggle, onDelete }) {
  return (
    <div className={`${styles.itemCard} ${!row.visible ? styles.itemCardInactive : ''}`}>
      <div
        className={styles.itemThumb}
        style={{
          background: '#2a1a3a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#b8860b', fontWeight: 700, fontSize: 14,
        }}
      >
        {row.iniciales}
      </div>
      <div className={styles.itemBody}>
        <p className={styles.itemTitle}>{row.nombre}</p>
        <p className={styles.itemMeta}>{row.cargo}</p>
      </div>
      <div className={styles.itemActions}>
        <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`} onClick={() => onEdit(row)}>Editar</button>
        <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`} onClick={() => onToggle(row)}>
          {row.visible ? 'Ocultar' : 'Mostrar'}
        </button>
        <button className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`} onClick={() => onDelete(row.id)}>✕</button>
      </div>
    </div>
  )
}

export default function AdminTestimonios() {
  const [rows, setRows]       = useState([])
  const [editing, setEditing] = useState(null)
  const [saving, setSaving]   = useState(false)
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('testimonials').select('*').order('orden')
    setRows(data || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  function handleEdit(row) { setEditing({ ...row }) }
  function handleNew() { setEditing({ ...EMPTY }) }
  function cancel() { setEditing(null) }
  function fieldChange(k, v) { setEditing(prev => ({ ...prev, [k]: v })) }

  async function save() {
    setSaving(true)
    const payload = {
      iniciales:  editing.iniciales,
      nombre:     editing.nombre,
      cargo:      editing.cargo,
      cita:       editing.cita,
      orden:      Number(editing.orden) || 0,
      visible:    editing.visible,
    }
    if (editing.id) {
      await supabase.from('testimonials').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('testimonials').insert(payload)
    }
    setSaving(false)
    setEditing(null)
    load()
  }

  async function toggle(row) {
    await supabase.from('testimonials').update({ visible: !row.visible }).eq('id', row.id)
    load()
  }

  async function del(id) {
    if (!confirm('¿Eliminar este testimonio?')) return
    await supabase.from('testimonials').delete().eq('id', id)
    load()
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Testimonios</h1>
          <p className={styles.pageSubtitle}>{rows.length} testimonios</p>
        </div>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleNew} disabled={!!editing}>
          + Nuevo testimonio
        </button>
      </div>

      <div className={styles.content}>
        {editing && (
          <div className={styles.editorPanel}>
            <p className={styles.editorTitle}>{editing.id ? 'Editar testimonio' : 'Nuevo testimonio'}</p>
            <div className={styles.formGrid}>
              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Nombre *</label>
                  <input className={styles.input} value={editing.nombre} onChange={e => fieldChange('nombre', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Iniciales (ej: JM)</label>
                  <input className={styles.input} maxLength={3} value={editing.iniciales} onChange={e => fieldChange('iniciales', e.target.value)} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Cargo · Empresa</label>
                  <input className={styles.input} value={editing.cargo} onChange={e => fieldChange('cargo', e.target.value)} placeholder="Jefe de Mantenimiento · Industria Química" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Orden</label>
                  <input className={styles.input} type="number" value={editing.orden} onChange={e => fieldChange('orden', e.target.value)} />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Testimonio *</label>
                <textarea className={styles.textarea} rows={4} value={editing.cita} onChange={e => fieldChange('cita', e.target.value)} />
              </div>
              <div className={styles.field}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={editing.visible} onChange={e => fieldChange('visible', e.target.checked)} />
                  <span className={styles.label} style={{ margin: 0 }}>Visible en la web</span>
                </label>
              </div>
            </div>
            <div className={styles.formActions}>
              <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={save} disabled={saving || !editing.nombre || !editing.cita}>
                {saving ? 'Guardando…' : 'Guardar'}
              </button>
              <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={cancel} disabled={saving}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <p style={{ color: '#555' }}>Cargando…</p>
        ) : rows.length === 0 ? (
          <div className={styles.empty}><p>No hay testimonios. Crea el primero.</p></div>
        ) : (
          <div className={styles.itemList}>
            {rows.map(r => (
              <RowItem key={r.id} row={r} onEdit={handleEdit} onToggle={toggle} onDelete={del} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
