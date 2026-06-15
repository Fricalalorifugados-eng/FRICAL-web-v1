import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import styles from './admin.module.css'

const MAX_MB = 8
const MAX_BYTES = MAX_MB * 1024 * 1024

const EMPTY = {
  slug: '', titulo: '', descripcion: '', enlace: '',
  imagen_url: '', destacado: false, orden: 0,
}

function RowItem({ row, onEdit, onDelete, onToggle }) {
  return (
    <div className={`${styles.itemCard} ${row.destacado ? styles.itemCardDestacado : ''}`}>
      <div className={styles.itemThumb} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {row.imagen_url
          ? <img src={row.imagen_url} alt="" onError={e => { e.target.style.display = 'none' }} />
          : <span style={{ fontSize: 18, opacity: .3 }}>⚙️</span>
        }
      </div>
      <div className={styles.itemBody}>
        <p className={styles.itemTitle}>{row.titulo}</p>
        <p className={styles.itemMeta}>{row.enlace || '—'}{row.destacado ? ' · ★ Destacado' : ''}</p>
      </div>
      <div className={styles.itemActions}>
        <button
          className={`${styles.btn} ${row.destacado ? styles.btnPrimary : styles.btnSecondary} ${styles.btnSm}`}
          onClick={() => onToggle(row)}
          title={row.destacado ? 'Destacado — clic para quitar' : 'Clic para marcar como destacado'}
        >
          {row.destacado ? '★ Destacado' : '☆ Normal'}
        </button>
        <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`} onClick={() => onEdit(row)}>Editar</button>
        <button className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`} onClick={() => onDelete(row.id)}>✕</button>
      </div>
    </div>
  )
}

export default function AdminServicios() {
  const [rows, setRows]           = useState([])
  const [editing, setEditing]     = useState(null)
  const [saving, setSaving]       = useState(false)
  const [loading, setLoading]     = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [dbError, setDbError]     = useState(null)
  const fileRef = useRef(null)

  async function load() {
    setLoading(true)
    setDbError(null)
    try {
      const { data, error } = await supabase.from('services').select('*').order('orden')
      if (error) throw error
      setRows(data || [])
    } catch (err) {
      setDbError(err?.message || 'Error al cargar servicios.')
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
        body: JSON.stringify({ filename: file.name, contentType: file.type, folder: 'servicios' }),
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
      enlace:      editing.enlace.trim() || null,
      imagen_url:  editing.imagen_url || null,
      destacado:   editing.destacado,
      orden:       Number(editing.orden) || 0,
    }
    if (editing.id) {
      await supabase.from('services').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('services').insert(payload)
    }
    setSaving(false)
    setEditing(null)
    load()
  }

  async function del(id) {
    if (!confirm('¿Eliminar este servicio?')) return
    await supabase.from('services').delete().eq('id', id)
    load()
  }

  async function toggleDestacado(row) {
    await supabase.from('services').update({ destacado: !row.destacado }).eq('id', row.id)
    load()
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Servicios</h1>
          <p className={styles.pageSubtitle}>{rows.length} servicio{rows.length !== 1 ? 's' : ''}</p>
        </div>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleNew} disabled={!!editing}>
          + Nuevo servicio
        </button>
      </div>

      <div className={styles.content}>
        {dbError && <div className={styles.dbError}>Error de base de datos: {dbError}</div>}

        {editing && (
          <div className={styles.editorPanel}>
            <p className={styles.editorTitle}>{editing.id ? 'Editar servicio' : 'Nuevo servicio'}</p>
            <div className={styles.formGrid}>

              <div className={styles.field}>
                <label className={styles.label}>Título *</label>
                <input
                  className={styles.input}
                  value={editing.titulo}
                  onChange={e => fieldChange('titulo', e.target.value)}
                  placeholder="ej: Aislamiento y Calorifugado"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Slug único * (ej: aislamiento)</label>
                <input
                  className={styles.input}
                  value={editing.slug}
                  onChange={e => fieldChange('slug', e.target.value)}
                  placeholder="aislamiento"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Descripción</label>
                <textarea
                  className={styles.textarea}
                  rows={4}
                  value={editing.descripcion}
                  onChange={e => fieldChange('descripcion', e.target.value)}
                  placeholder="Descripción del servicio que aparece en la home..."
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Enlace (ruta de la página del servicio)</label>
                <input
                  className={styles.input}
                  value={editing.enlace}
                  onChange={e => fieldChange('enlace', e.target.value)}
                  placeholder="/servicios/aislamiento-y-calorifugado"
                />
              </div>

              {/* ── Imagen ── */}
              <div className={styles.field}>
                <label className={styles.label}>Imagen del servicio (opcional)</label>
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
                  <label className={styles.label}>Orden (menor = primero)</label>
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
                      checked={editing.destacado}
                      onChange={e => fieldChange('destacado', e.target.checked)}
                      style={{ accentColor: 'var(--frical-green)', width: 16, height: 16, cursor: 'pointer' }}
                    />
                    <span style={{ color: editing.destacado ? 'var(--frical-green)' : 'var(--frical-mist)', fontSize: 13 }}>
                      {editing.destacado ? '★ Servicio destacado (badge en la web)' : 'Servicio normal'}
                    </span>
                  </label>
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
          <p style={{ color: 'rgba(185,194,187,.45)', fontSize: 13 }}>Cargando…</p>
        ) : rows.length === 0 ? (
          <div className={styles.empty}><p>No hay servicios. Crea el primero.</p></div>
        ) : (
          <div className={styles.itemList}>
            {rows.map(r => (
              <RowItem key={r.id} row={r} onEdit={handleEdit} onDelete={del} onToggle={toggleDestacado} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
