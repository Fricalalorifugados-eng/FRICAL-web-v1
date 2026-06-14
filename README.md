# FRICAL CALORIFUGADOS, S.L. — Web Corporativa

Web corporativa de FRICAL CALORIFUGADOS, S.L. desarrollada con React 18 + Vite 5 + GSAP 3.

---

## Stack

| Capa | Tecnología |
|---|---|
| UI | React 18 + CSS Modules |
| Animaciones | GSAP 3 + ScrollTrigger |
| Enrutamiento | react-router-dom v6 |
| Build | Vite 5 |
| Deploy | Vercel (SPA routing via vercel.json) |

---

## Desarrollo local

### Requisitos
- Node.js 18+ (recomendado: 20 LTS)
- npm 9+

### Instalación

```bash
npm install
```

### Servidor de desarrollo

```bash
npm run dev
# → http://localhost:5173
```

### Build de producción

```bash
npm run build
# Output en /dist/
```

### Preview local del build

```bash
npm run preview
# → http://localhost:4173
```

---

## Despliegue en Vercel

### Primer despliegue (desde CLI)

```bash
npm install -g vercel
vercel login
vercel --prod
```

Vercel detecta automáticamente Vite y usa:
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Framework preset:** Vite

El fichero `vercel.json` ya incluye el rewrite SPA necesario:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Despliegue continuo (recomendado)

1. Sube el repositorio a GitHub.
2. Importa el proyecto en [vercel.com](https://vercel.com) → "Add New Project".
3. Vercel desplegará automáticamente en cada push a `main`.

---

## Variables de entorno

La versión actual **no requiere variables de entorno** (datos del cliente en `src/data/contacto.js`).

### Fase 2 — Formulario con backend real

Cuando se integre el endpoint de email (`/api/contacto`), añadir en Vercel:

| Variable | Descripción |
|---|---|
| `RESEND_API_KEY` | API key de Resend (o proveedor equivalente) |
| `CONTACT_EMAIL_TO` | Email de destino del formulario |

---

## Imágenes de cliente

La web muestra gradientes CSS hasta que el cliente proporcione las fotos reales.
Instrucciones completas en `/public/proyectos/README.txt`.

**Resumen:**

| Carpeta | Contenido |
|---|---|
| `/public/proyectos/` | Fotos de proyectos terminados (6 imágenes) |
| `/public/proyectos/proximamente/` | Fotos de próximos proyectos (4 imágenes) |
| `/public/servicios/` | Fondos hero de las páginas de servicio (3 imágenes) |
| `/public/og-image.jpg` | Imagen Open Graph 1200×630 px (a añadir) |

Formato: JPG o WebP · 1 600 px ancho · ≤ 300 KB · calidad 80-85 %.

---

## SEO

- Títulos y meta descriptions configurados per-página mediante `src/hooks/useSeo.js`
- `lang="es"` en `index.html`
- Open Graph y Twitter Card en `index.html` (actualizados dinámicamente)
- `public/sitemap.xml` — actualizar URL base si el dominio cambia
- `public/robots.txt` — permite indexación completa
- Si el dominio final es distinto de `fricalcalorifugados.com`, actualizar la constante
  `BASE_URL` en `src/hooks/useSeo.js` y las URLs en `public/sitemap.xml`

---

## Formulario de contacto (Fase 1 — mailto:)

El formulario compone los datos del usuario y abre el gestor de correo con todo prefilled.
El mensaje va a `info@fricalcalorifugados.com`. El TODO para la integración real está
marcado en `src/components/Contacto.jsx`:

```
// TODO (Fase 2): sustituir el mailto: por una llamada POST a /api/contacto
```

---

## Checklist post-despliegue

- [ ] Verificar que todas las rutas funcionan (/, /servicios/*, /aviso-legal, etc.)
- [ ] Comprobar `https://dominio.com/sitemap.xml` accesible
- [ ] Comprobar `https://dominio.com/robots.txt` accesible
- [ ] Enviar sitemap a Google Search Console
- [ ] Añadir `/public/og-image.jpg` (1200×630 px) y verificar OG con [opengraph.xyz](https://www.opengraph.xyz)
- [ ] Añadir fotos reales en `/public/proyectos/` y `/public/servicios/`
- [ ] Probar formulario de contacto en móvil y escritorio
- [ ] Auditoría Lighthouse (Performance · Accessibility · SEO) en producción
- [ ] Configurar dominio personalizado en Vercel y forzar HTTPS

---

## Estructura del proyecto

```
frical-corporate/
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── og-image.jpg             ← AÑADIR (1200×630 px)
│   ├── proyectos/
│   │   ├── README.txt           ← instrucciones para el cliente
│   │   ├── proyecto-01-*.jpg    ← fotos proyectos terminados (a añadir)
│   │   └── proximamente/
│   │       └── prx-0*.jpg       ← fotos próximos proyectos (a añadir)
│   └── servicios/
│       └── *-hero.jpg           ← fondos hero de servicio (a añadir)
├── src/
│   ├── components/              ← 14 componentes, cada uno con su CSS Module
│   ├── data/                    ← contacto.js · servicios.js · proyectos.js · proximos.js · …
│   ├── hooks/
│   │   └── useSeo.js            ← SEO per-página (title, description, OG, canonical)
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── LegalLayout.jsx
│   │   ├── AvisoLegal.jsx · PoliticaPrivacidad.jsx · PoliticaCookies.jsx · TerminosCondiciones.jsx
│   │   └── servicios/
│   │       ├── ServicioHero.jsx
│   │       ├── AislamientoPage.jsx
│   │       ├── ConductosPage.jsx
│   │       └── ClimatizacionPage.jsx
│   ├── styles/global.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vercel.json
└── vite.config.js
```

---

## Datos del cliente — fichero único

Todos los datos de contacto se centralizan en `src/data/contacto.js`.
Modificar ese único fichero actualiza Navbar, Footer, Contacto y páginas legales.

```
Empresa:   FRICAL CALORIFUGADOS, S.L.
CIF:       B98127855
Dirección: C/ Jocs Florals, 1-3, 08950 Esplugues de Llobregat (Barcelona)
Tel 1:     673 177 887 (Rubén Pérez)
Tel 2:     672 629 743 (Sergio Pérez)
WhatsApp:  +34673177887
Email:     info@fricalcalorifugados.com
```
