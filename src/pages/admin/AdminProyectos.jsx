import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import styles from './admin.module.css'

const MESES = ['', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const MAX_MB = 8
const MAX_BYTES = MAX_MB * 1024 * 1024

const EMPTY = {
  slug: '', imagen_url: '', titulo: '', descripcion: '', categorias: '',
  fecha_dia: '', fecha_mes: '', fecha_anyo: new Date().getFullYear(),
  gradiente: 'linear-gradient(145deg, #0d1f2e 0%, #07131e 55%, #020a12 100%)',
  acento: 'rgba(65, 140, 200, 0.18)',
  orden: 0,
}

function RowItem({ row, onEdit, onDelete }) {
  const fecha = row.fecha_dia && row.fecha_mes && row.fecha_anyo
    ? `${row.fecha_dia} ${MESES[row.fecha_mes]} ${row.fecha_anyo}` : '—'
  return (
    <div className={styles.itemCard}>
      <div className={styles.itemThumb} style={{ background: row.gradiente }}>
        {row.imagen_url && <img src={row.imagen_url} alt="" onError={e => { e.target.style.display = 'none' }} />}
      </div>
      <div className={styles.itemBody}>
        <p className={styles.itemTitle}>{row.titulo}</p>
        <p className={styles.itemMeta}>{(row.categorias || []).join(', ')} · {fecha}</p>
      </div>
      <div className={styles.itemActions}>
        <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`} onClick={() => onEdit(row)}>Editar</button>
        <button className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`} onClick={() => onDelete(row.id)}>✕</button>
      </div>
    </div>
  )
}

export default function AdminProyectos() {
  const [rows, setRows]       = useState([])
  const [editing, setEditing] = useState(null)
  const [saving, setSaving]   = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [dbError, setDbError] = useState(null)
  const fileRef = useRef(null)

  async function load() {
    setLoading(true)
    setDbError(null)
    try {
      const { data, error } = await supabase.from('projects').select('*').order('orden')
      if (error) throw error
      setRows(data || [])
    } catch (err) {
      setDbError(err?.message || 'Error al cargar proyectos.')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [])

  function handleEdit(row) {
    setEditing({ ...row, categorias: (row.categorias || []).join(', '), slug: row.slug || '' })
    setUploadError(null)
  }
  function handleNew() {
    setEditing({ ...EMPTY })
    setUploadError(null)
  }
  function cancel() {
    setEditing(null)
    setUploadError(null)
  }
  function fieldChange(k, v) {
    setEditing(prev => ({ ...prev, [k]: v }))
  }

  async function handleFileSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)

    if (file.size > MAX_BYTES) {
      setUploadError(`La imagen pesa ${(file.size / 1024 / 1024).toFixed(1)} MB. Máximo permitido: ${MAX_MB} MB.`)
      e.target.value = ''
      return
    }

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      setUploadError('Formato no permitido. Usa JPG, PNG o WebP.')
      e.target.value = ''
      return
    }

    setUploading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      // 1. Solicitar URL firmada al servidor
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          folder: 'proyectos',
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Error al generar URL de subida.')

      // 2. Subir el archivo directamente a Supabase Storage
      const putRes = await fetch(json.signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      if (!putRes.ok) throw new Error('Error al subir la imagen a Storage.')

      // 3. Guardar URL pública en el formulario
      fieldChange('imagen_url', json.publicUrl)
    } catch (err) {
      setUploadError(err.message || 'Error desconocido al subir la imagen.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  async function save() {
    setSaving(true)
    const payload = {
      slug:        editing.slug.trim(),
      imagen_url:  editing.imagen_url,
      titulo:      editing.titulo,
      descripcion: editing.descripcion,
      categorias:  editing.categorias.split(',').map(s => s.trim()).filter(Boolean),
      fecha_dia:   Number(editing.fecha_dia) || null,
      fecha_mes:   Number(editing.fecha_mes) || null,
      fecha_anyo:  Number(editing.fecha_anyo) || null,
      gradiente:   editing.gradiente,
      acento:      editing.acento,
      orden:       Number(editing.orden) || 0,
    }
    if (editing.id) {
      await supabase.from('projects').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('projects').insert(payload)
    }
    setSaving(false)
    setEditing(null)
    load()
  }

  async function del(id) {
    if (!confirm('¿Eliminar este proyecto?')) return
    await supabase.from('projects').delete().eq('id', id)
    load()
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Proyectos</h1>
          <p className={styles.pageSubtitle}>{rows.length} proyectos</p>
        </div>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleNew} disabled={!!editing}>
          + Nuevo proyecto
        </button>
      </div>

      <div className={styles.content}>
        {dbError && <div className={styles.dbError}>Error de base de datos: {dbError}</div>}
        {editing && (
          <div className={styles.editorPanel}>
            <p className={styles.editorTitle}>{editing.id ? 'Editar proyecto' : 'Nuevo proyecto'}</p>
            <div className={styles.formGrid}>

              <div className={styles.field}>
                <label className={styles.label}>Título *</label>
                <input className={styles.input} value={editing.titulo} onChange={e => fieldChange('titulo', e.target.value)} />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Slug único * (ej: conductos-alimentaria)</label>
                <input className={styles.input} value={editing.slug} onChange={e => fieldChange('slug', e.target.value)} />
              </div>

              {/* ── Imagen ── */}
              <div className={styles.field}>
                <label className={styles.label}>Imagen del proyecto</label>
                <div className={styles.imageUploadArea}>
                  {/* Vista previa */}
                  {editing.imagen_url ? (
                    <div className={styles.imagePreview}>
                      <img src={editing.imagen_url} alt="Vista previa" />
                      <button
                        type="button"
                        className={styles.imageRemoveBtn}
                        onClick={() => fieldChange('imagen_url', '')}
                        title="Quitar imagen"
                      >✕</button>
                    </div>
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      <span>Sin imagen</span>
                    </div>
                  )}

                  {/* Controles de subida */}
                  <div className={styles.imageControls}>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? 'Subiendo…' : editing.imagen_url ? 'Cambiar imagen' : 'Subir imagen'}
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      style={{ display: 'none' }}
                      onChange={handleFileSelect}
                    />
                    <span className={styles.imageHint}>JPG, PNG o WebP · máx. {MAX_MB} MB</span>
                  </div>

                  {/* URL manual como alternativa */}
                  <input
                    className={styles.input}
                    style={{ marginTop: 6 }}
                    placeholder="O pega una URL directamente"
                    value={editing.imagen_url}
                    onChange={e => fieldChange('imagen_url', e.target.value)}
                  />

                  {uploadError && (
                    <p className={styles.uploadError}>{uploadError}</p>
                  )}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Categorías (coma: Aislamiento, Conductos)</label>
                <input className={styles.input} value={editing.categorias} onChange={e => fieldChange('categorias', e.target.value)} />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Descripción</label>
                <textarea className={styles.textarea} rows={3} value={editing.descripcion} onChange={e => fieldChange('descripcion', e.target.value)} />
              </div>

              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Día</label>
                  <input className={styles.input} type="number" min="1" max="31" value={editing.fecha_dia} onChange={e => fieldChange('fecha_dia', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Mes (1–12)</label>
                  <input className={styles.input} type="number" min="1" max="12" value={editing.fecha_mes} onChange={e => fieldChange('fecha_mes', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Año</label>
                  <input className={styles.input} type="number" min="2000" value={editing.fecha_anyo} onChange={e => fieldChange('fecha_anyo', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Orden (menor = primero)</label>
                  <input className={styles.input} type="number" value={editing.orden} onChange={e => fieldChange('orden', e.target.value)} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Gradiente CSS</label>
                  <input className={styles.input} value={editing.gradiente} onChange={e => fieldChange('gradiente', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Acento (rgba)</label>
                  <input className={styles.input} value={editing.acento} onChange={e => fieldChange('acento', e.target.value)} />
                </div>
              </div>

            </div>
            <div className={styles.formActions}>
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={save}
                disabled={saving || uploading || !editing.titulo || !editing.slug}
              >
                {saving ? 'Guardando…' : 'Guardar'}
              </button>
              <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={cancel} disabled={saving || uploading}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <p style={{ color: '#555' }}>Cargando…</p>
        ) : rows.length === 0 ? (
          <div className={styles.empty}><p>No hay proyectos. Crea el primero.</p></div>
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
