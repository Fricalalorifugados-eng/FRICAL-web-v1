ICONOS PERSONALIZADOS — FRICAL CALORIFUGADOS
============================================

Coloca aquí los iconos personalizados del proyecto.


ICONO DE TELÉFONO
-----------------
Nombre exacto: llamada-telefonica-2.png

Requisitos:
  - Fondo transparente (PNG con canal alpha)
  - Icono en color NEGRO (#000000) sobre fondo transparente
  - Tamaño recomendado: 64×64 px o superior (se escala por CSS)
  - El sitio aplica un filtro CSS para teñirlo de verde FRICAL (#7ed957)

Aparece en:
  - Barra de navegación (navbar), tamaño 15×15 px
  - Sección de Contacto (dentro del cuadro verde), tamaño 20×20 px

Si en el futuro se dispone de una versión SVG:
  Indica al desarrollador que reemplace el <img> por el <svg fill="currentColor">
  en src/components/Icons.jsx → función IconTelefono().
  El color se heredará automáticamente sin necesidad de filtro CSS.


AJUSTE DEL FILTRO DE COLOR
---------------------------
Si el tinte verde no es exactamente correcto, edita en src/components/Icons.jsx
la constante TELEFONO_FILTER y ajusta:
  - hue-rotate(Xdeg): aumenta X para más amarillo, disminuye para más azul/cian
  - brightness(X%): sube para más claro, baja para más oscuro
  - saturate(X%): sube para más vivo, baja para más apagado
