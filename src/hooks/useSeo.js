import { useEffect } from 'react'

const BASE_TITLE       = 'FRICAL CALORIFUGADOS, S.L. | Aislamiento Térmico Industrial · Barcelona'
const BASE_DESCRIPTION = 'Especialistas en aislamiento térmico industrial, calorifugado, conductos de ventilación y climatización HVAC en Barcelona y área metropolitana. Más de 25 años de experiencia.'
const BASE_URL         = 'https://fricalcalorifugados.com'
const BASE_OG_IMAGE    = `${BASE_URL}/og-image.jpg`

function setMeta(name, content, attr = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/**
 * Updates <title>, meta description, OG tags, and canonical for the current page.
 * @param {object} opts
 * @param {string} opts.title       - Full page title (will be set as-is)
 * @param {string} opts.description - Meta description (max ~160 chars)
 * @param {string} [opts.url]       - Canonical URL (e.g. 'https://fricalcalorifugados.com/servicios/conductos')
 * @param {string} [opts.ogImage]   - Absolute OG image URL
 */
export function useSeo({ title, description, url = BASE_URL, ogImage = BASE_OG_IMAGE }) {
  useEffect(() => {
    document.title = title

    setMeta('description', description)
    setMeta('og:title',       title,       'property')
    setMeta('og:description', description, 'property')
    setMeta('og:url',         url,         'property')
    setMeta('og:image',       ogImage,     'property')
    setMeta('twitter:title',       title)
    setMeta('twitter:description', description)
    setMeta('twitter:image',       ogImage)

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)

    return () => {
      document.title = BASE_TITLE
      setMeta('description', BASE_DESCRIPTION)
    }
  }, [title, description, url, ogImage])
}
