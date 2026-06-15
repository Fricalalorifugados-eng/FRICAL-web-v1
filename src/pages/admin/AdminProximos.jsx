import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import styles from './admin.module.css'

const EMPTY = {
  slug: '', imagen_url: '', titulo: '', descripcion: '', categorias: '',
  gradiente: 'linear-gradient(145deg, #0d1f2e 0%, #07131e 55%, #020a12 100%)',
  orden: 0,
}

function RowItem({ row, onEdit, onDelete }) {
  return (
    <div className={styles.itemCard}>
      <div className={styles.itemThumb} style={{ background: row.gradiente }}>
        {row.imagen_url && <img src={row.imagen_url} alt="" onError={e => { e.target.style.display = 'none' }} />}
      </div>
      <div className={styles.itemBody}>
        <p className={styles.itemTitle}>{row.titulo}</p>
        <p className={styles.itemMeta}>{(row.categorias || []).join(', ')}</p>
      </div>
      <div className={styles.itemActions}>
        <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`} onClick={() => onEdit(row)}>Editar</button>
        <button className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`} onClick={() => onDelete(row.id)}>✕</button>
      </div>
    </div>
  )
}

export default function AdminProximos() {
  const [rows, setRows]       = useState([])
  const [editing, setEditing] = useState(null)
  const [saving, setSaving]   = useState(false)
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('upcoming_projects').select('*').order('orden')
    setRows(data || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  function handleEdit(row) {
    setEditing({ ...row, categorias: (row.categorias || []).join(', '), slug: row.slug || '' })
  }
  function handleNew() { setEditing({ ...EMPTY }) }
  function cancel() { setEditing(null) }
  function fieldChange(k, v) { setEditing(prev => ({ ...prev, [k]: v })) }

  async function save() {
    setSaving(true)
    const payload = {
      slug:        editing.slug.trim(),
      imagen_url:  editing.imagen_url,
      titulo:      editing.titulo,
      descripcion: editing.descripcion,
      categorias:  editing.categorias.split(',').map(s => s.trim()).filter(Boolean),
      gradiente:   editing.gradiente,
      orden:       Number(editing.orden) || 0,
    }
    if (editing.id) {
      await supabase.from('upcoming_projects').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('upcoming_projects').insert(payload)
    }
    setSaving(false)
    setEditing(null)
    load()
  }

  async function del(id) {
    if (!confirm('¿Eliminar este próximo proyecto?')) return
    await supabase.from('upcoming_projects').delete().eq('id', id)
    load()
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Próximos proyectos</h1>
          <p className={styles.pageSubtitle}>{rows.length} próximos</p>
        </div>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleNew} disabled={!!editing}>
          + Nuevo
        </button>
      </div>

      <div className={styles.content}>
        {editing && (
          <div className={styles.editorPanel}>
            <p className={styles.editorTitle}>{editing.id ? 'Editar próximo proyecto' : 'Nuevo próximo proyecto'}</p>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label className={styles.label}>Título *</label>
                <input className={styles.input} value={editing.titulo} onChange={e => fieldChange('titulo', e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Slug único * (ej: nave-logistica-badalona)</label>
                <input className={styles.input} value={editing.slug} onChange={e => fieldChange('slug', e.target.value)} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.label}>URL imagen</label>
                  <input className={styles.input} value={editing.imagen_url} onChange={e => fieldChange('imagen_url', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Categorías (coma: Aislamiento, Conductos)</label>
                  <input className={styles.input} value={editing.categorias} onChange={e => fieldChange('categorias', e.target.value)} />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Descripción</label>
                <textarea className={styles.textarea} rows={3} value={editing.descripcion} onChange={e => fieldChange('descripcion', e.target.value)} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Gradiente CSS</label>
                  <input className={styles.input} value={editing.gradiente} onChange={e => fieldChange('gradiente', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Orden</label>
                  <input className={styles.input} type="number" value={editing.orden} onChange={e => fieldChange('orden', e.target.value)} />
                </div>
              </div>
            </div>
            <div className={styles.formActions}>
              <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={save} disabled={saving || !editing.titulo || !editing.slug}>
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
          <div className={styles.empty}><p>No hay próximos proyectos.</p></div>
        ) : (
          <div className={styles.itemList}>
            {rows.map(r => (
              <RowItem key={r.id} row={r} onEdit={handleEdit} onDelete={del} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
