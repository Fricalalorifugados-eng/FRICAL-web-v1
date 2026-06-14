const CONSENT_KEY = 'frical_cookie_consent'

// In-memory fallback when localStorage is unavailable
let memoryFallback = null

/**
 * Returns the stored consent object or null if the user hasn't chosen yet.
 * Shape: { esenciales: true, analiticas: bool, marketing: bool, fecha: ISO string }
 */
export function getCookieConsent() {
  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return memoryFallback
  }
}

/**
 * Persists the consent object and returns it.
 * Silently degrades to in-memory storage if localStorage is unavailable.
 */
export function setCookieConsent(prefs) {
  const payload = {
    esenciales: true,
    analiticas: prefs.analiticas ?? false,
    marketing: prefs.marketing ?? false,
    fecha: new Date().toISOString(),
  }
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(payload))
  } catch {
    // localStorage unavailable (private mode, quota exceeded) — use memory fallback
    memoryFallback = payload
  }
  // TODO Fase 2: activar/desactivar scripts de analítica y marketing según payload:
  //   if (payload.analiticas) activarAnalytics(); else desactivarAnalytics();
  //   if (payload.marketing)  activarMarketing(); else desactivarMarketing();
  return payload
}
