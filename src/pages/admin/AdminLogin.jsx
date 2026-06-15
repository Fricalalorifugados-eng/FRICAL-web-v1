import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import styles from './admin.module.css'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail]     = useState('')
  const [pass, setPass]       = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password: pass })
    setLoading(false)
    if (err) {
      setError(err.message === 'Invalid login credentials'
        ? 'Email o contraseña incorrectos.'
        : err.message)
    } else {
      navigate('/admin/mensajes', { replace: true })
    }
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginBox}>
        <div className={styles.loginLogo}>
          <img src="/logo-frical.png" alt="FRICAL Calorifugados" className={styles.loginLogoImg} />
          <span>Panel de administración</span>
        </div>

        <h1 className={styles.loginTitle}>Acceder</h1>

        {error && <div className={styles.loginError}>{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.loginField}>
            <label className={styles.loginLabel} htmlFor="email">Email</label>
            <input
              id="email" type="text" inputMode="email" autoComplete="email"
              className={styles.loginInput}
              value={email} onChange={e => setEmail(e.target.value)}
              disabled={loading} required
            />
          </div>
          <div className={styles.loginField}>
            <label className={styles.loginLabel} htmlFor="pass">Contraseña</label>
            <input
              id="pass" type="password" autoComplete="current-password"
              className={styles.loginInput}
              value={pass} onChange={e => setPass(e.target.value)}
              disabled={loading} required
            />
          </div>
          <button type="submit" className={styles.loginBtn} disabled={loading || !email || !pass}>
            {loading ? 'Accediendo…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
