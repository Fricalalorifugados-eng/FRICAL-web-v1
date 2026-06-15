import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import styles from './admin.module.css'

const MAX_MB = 8
const MAX_BYTES = MAX_MB * 1024 * 1024
const TIPOS = ['Jornada completa', 'Jornada parcial', 'Prácticas']

const EMPTY = {
  slug: '', titulo: '', descripcion: '', ubicacion: 'Barcelona',
  tipo: 'Jornada completa', imagen_url: '', activa: true, orden: 0,
}

function RowItem({ row, onEdit, onDelete, onToggle }) {
  return (
    <div className={`${styles.itemCard} ${!row.activa ? styles.itemCardInactive : ''}`}>
      <div className={styles.itemThumb} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {row.imagen_url
          ? <img src={row.imagen_url} alt="" onError={e => { e.target.style.display = 'none' }} />
          : <span style={{ fontSize: 18, opacity: .35 }}>💼</span>
        }
      </div>
      <div className={styles.itemBody}>
        <p className={styles.itemTitle}>{row.titulo}</p>
        <p className={styles.itemMeta}>{row.ubicacion} · {row.tipo}</p>
      </div>
      <div className={styles.itemActions}>
        <button
          className={`${styles.btn} ${row.activa ? styles.btnPrimary : styles.btnSecondary} ${styles.btnSm}`}
          onClick={() => onToggle(row)}
          title={row.activa ? 'Activa — clic para desactivar' : 'Inactiva — clic para activar'}
        >
          {row.activa ? '● Activa' : '○ Inactiva'}
        </button>
        <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`} onClick={() => onEdit(row)}>Editar</button>
        <button className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`} onClick={() => onDelete(row.id)}>✕</button>
      </div>
    </div>
  )
}

export default function AdminOfertas() {
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
      const { data, error } = await supabase.from('job_offers').select('*').order('orden')
      if (error) throw error
      setRows(data || [])
    } catch (err) {
      setDbError(err?.message || 'Error al cargar ofertas.')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [])

  function handleEdit(row) { setEditing({ ...row }); setUploadError(null) }
  function handleNew()      { setEditing({ ...EMPTY }); setUploadError(null) }
  function cancel()         { setEditing(null); setUploadError(null) }
  function fieldChange(k, v) { setEditing(prev => ({ ...prev, [k]: v })) }

  async function handleFileSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError(null)

    if (file.size > MAX_BYTES) {
      setUploadError(`La imagen pesa ${(file.size / 1024 / 1024).toFixed(1)} MB. Máximo ${MAX_MB} MB.`)
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
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ filename: file.name, contentType: file.type, folder: 'ofertas' }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Error al generar URL de subida.')
      const putRes = await fetch(json.signedUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file })
      if (!putRes.ok) throw new Error('Error al subir la imagen a Storage.')
      fieldChange('imagen_url', json.publicUrl)
    } catch (err) {
      setUploadError(err.message || 'Error desconocido.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  async function save() {
    setSaving(true)
    const payload = {
      slug:        editing.slug.trim(),
      titulo:      editing.titulo.trim(),
      descripcion: editing.descripcion.trim(),
      ubicacion:   editing.ubicacion.trim() || 'Barcelona',
      tipo:        editing.tipo,
      imagen_url:  editing.imagen_url || null,
      activa:      editing.activa,
      orden:       Number(editing.orden) || 0,
    }
    if (editing.id) {
      await supabase.from('job_offers').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('job_offers').insert(payload)
    }
    setSaving(false)
    setEditing(null)
    load()
  }

  async function del(id) {
    if (!confirm('¿Eliminar esta oferta?')) return
    await supabase.from('job_offers').delete().eq('id', id)
    load()
  }

  async function toggleActiva(row) {
    await supabase.from('job_offers').update({ activa: !row.activa }).eq('id', row.id)
    load()
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Ofertas de empleo</h1>
          <p className={styles.pageSubtitle}>{rows.length} oferta{rows.length !== 1 ? 's' : ''}</p>
        </div>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleNew} disabled={!!editing}>
          + Nueva oferta
        </button>
      </div>

      <div className={styles.content}>
        {dbError && <div className={styles.dbError}>Error de base de datos: {dbError}</div>}
        {editing && (
          <div className={styles.editorPanel}>
            <p className={styles.editorTitle}>{editing.id ? 'Editar oferta' : 'Nueva oferta'}</p>
            <div className={styles.formGrid}>

              <div className={styles.field}>
                <label className={styles.label}>Título del puesto *</label>
                <input
                  className={styles.input}
                  value={editing.titulo}
                  onChange={e => fieldChange('titulo', e.target.value)}
                  placeholder="ej: Montador/a de aislamiento térmico"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Slug único * (ej: montador-aislamiento)</label>
                <input
                  className={styles.input}
                  value={editing.slug}
                  onChange={e => fieldChange('slug', e.target.value)}
                  placeholder="montador-aislamiento"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Ubicación</label>
                  <input
                    className={styles.input}
                    value={editing.ubicacion}
                    onChange={e => fieldChange('ubicacion', e.target.value)}
                    placeholder="Barcelona"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Tipo de jornada</label>
                  <select className={styles.input} value={editing.tipo} onChange={e => fieldChange('tipo', e.target.value)}>
                    {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Descripción *</label>
                <textarea
                  className={styles.textarea}
                  rows={4}
                  value={editing.descripcion}
                  onChange={e => fieldChange('descripcion', e.target.value)}
                  placeholder="Descripción del puesto, requisitos y condiciones..."
                />
              </div>

              {/* ── Imagen ── */}
              <div className={styles.field}>
                <label className={styles.label}>Imagen de la oferta (opcional)</label>
                <div className={styles.imageUploadArea}>
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
                    <div className={styles.imagePlaceholder}><span>Sin imagen</span></div>
                  )}
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
                  <input
                    className={styles.input}
                    style={{ marginTop: 6 }}
                    placeholder="O pega una URL directamente"
                    value={editing.imagen_url}
                    onChange={e => fieldChange('imagen_url', e.target.value)}
                  />
                  {uploadError && <p className={styles.uploadError}>{uploadError}</p>}
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Orden (menor = antes)</label>
                  <input
                    className={styles.input}
                    type="number"
                    value={editing.orden}
                    onChange={e => fieldChange('orden', e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Estado</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginTop: 4 }}>
                    <input
                      type="checkbox"
                      checked={editing.activa}
                      onChange={e => fieldChange('activa', e.target.checked)}
                      style={{ accentColor: '#7ed957', width: 16, height: 16, cursor: 'pointer' }}
                    />
                    <span style={{ color: editing.activa ? '#7ed957' : '#666', fontSize: 13 }}>
                      {editing.activa ? 'Activa (visible en web)' : 'Inactiva (oculta en web)'}
                    </span>
                  </label>
                </div>
              </div>

            </div>
            <div className={styles.formActions}>
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={save}
                disabled={saving || uploading || !editing.titulo || !editing.slug || !editing.descripcion}
              >
                {saving ? 'Guardando…' : 'Guardar'}
              </button>
              <button
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={cancel}
                disabled={saving || uploading}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <p style={{ color: '#555' }}>Cargando…</p>
        ) : rows.length === 0 ? (
          <div className={styles.empty}><p>No hay ofertas. Crea la primera.</p></div>
        ) : (
          <div className={styles.itemList}>
            {rows.map(r => (
              <RowItem key={r.id} row={r} onEdit={handleEdit} onDelete={del} onToggle={toggleActiva} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
