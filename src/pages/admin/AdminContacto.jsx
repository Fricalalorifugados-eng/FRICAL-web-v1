import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import styles from './admin.module.css'

const FIELDS = [
  { key: 'empresa',      label: 'Empresa',          section: 'Datos generales' },
  { key: 'cif',          label: 'CIF/NIF' },
  { key: 'direccion',    label: 'Dirección' },
  { key: 'horario',      label: 'Horario' },
  { key: 'zona',         label: 'Zona de trabajo' },
  { key: 'email',        label: 'Email principal',  section: 'Emails' },
  { key: 'email_ruben',  label: 'Email Rubén' },
  { key: 'email_sergio', label: 'Email Sergio' },
  { key: 'telefono',     label: 'Teléfono Rubén',   section: 'Teléfonos y WhatsApp' },
  { key: 'telefono2',    label: 'Teléfono Sergio' },
  { key: 'whatsapp',     label: 'WhatsApp (formato +34…)' },
  { key: 'whatsapp_msg', label: 'Mensaje WhatsApp predeterminado' },
  { key: 'instagram',    label: 'Instagram URL',     section: 'Redes sociales' },
  { key: 'linkedin',     label: 'LinkedIn URL' },
  { key: 'tiktok',       label: 'TikTok URL' },
]

export default function AdminContacto() {
  const [form, setForm]     = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('contact_info').select('*').eq('id', 'main').single()
      .then(({ data }) => {
        if (data) setForm(data)
        setLoading(false)
      })
  }, [])

  function change(k, v) {
    setForm(prev => ({ ...prev, [k]: v }))
    setSaved(false)
  }

  async function save() {
    setSaving(true)
    const { id: _id, updated_at: _ua, ...payload } = form
    await supabase.from('contact_info').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', 'main')
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  let lastSection = null

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Datos de contacto</h1>
          <p className={styles.pageSubtitle}>Información de la empresa que aparece en la web y los emails</p>
        </div>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={save} disabled={saving || loading}>
          {saving ? 'Guardando…' : saved ? '✓ Guardado' : 'Guardar cambios'}
        </button>
      </div>

      <div className={styles.content}>
        {loading ? (
          <p style={{ color: '#555' }}>Cargando…</p>
        ) : (
          <div className={styles.editorPanel} style={{ maxWidth: 680 }}>
            <div className={styles.formGrid}>
              {FIELDS.map(({ key, label, section }) => {
                const showSection = section && section !== lastSection
                lastSection = section || lastSection
                return (
                  <div key={key}>
                    {showSection && <p className={styles.sectionTitle} style={{ marginTop: lastSection !== section ? 8 : 0 }}>{section}</p>}
                    <div className={styles.field}>
                      <label className={styles.label}>{label}</label>
                      <input
                        className={styles.input}
                        value={form[key] || ''}
                        onChange={e => change(key, e.target.value)}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
