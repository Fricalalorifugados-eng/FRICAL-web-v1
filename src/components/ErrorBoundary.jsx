import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info?.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          color: '#e0e0e0',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          textAlign: 'center',
          padding: 24,
        }}>
          <div>
            <div style={{ fontSize: 44, marginBottom: 20 }}>⚙️</div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f0f0f0', marginBottom: 12 }}>
              Estamos teniendo problemas técnicos
            </h1>
            <p style={{ fontSize: 15, color: '#888', maxWidth: 400, lineHeight: 1.65, margin: '0 auto 28px' }}>
              La página no ha podido cargarse correctamente. Por favor, recarga e inténtalo de nuevo.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#6FCB6F',
                color: '#000',
                border: 'none',
                borderRadius: 8,
                padding: '12px 28px',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Recargar página
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
