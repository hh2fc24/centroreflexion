# Sistema de diseño CRC — dirección "consultora institucional"

Referencia para todo el sitio público. El objetivo es que el CRC se lea como una
consultora y centro de estudios serio, no como una plantilla ni como un sitio
generado con IA. Regla general: sobriedad, evidencia y personas reales.

## 1. Color — NO CAMBIA

La paleta la eligió el equipo y se mantiene tal cual:

| Rol | Valor |
|---|---|
| Fondo | `#f8f5ee` |
| Superficie | `#fffdf8` |
| Tinta | `#171713` (texto), `#15120e` (bandas oscuras) |
| Texto secundario | `#55574f`, `#6f675d` |
| Cobre (acción principal) | `#bd6f3c`, hover `#a85f31` |
| Cobre oscuro (etiquetas, links) | `#9f5528` |
| Cobre claro sobre fondo oscuro | `#e4935d` |
| Bordes | `#d8cfc0`, `#ded5c7`, `#eee8dc` |

El cobre se reserva para la acción principal de cada bloque y para las
etiquetas. No se agregan colores nuevos (nada de slate, gray-*, blue-*, verdes).

## 2. Tipografía

- Títulos: **Source Serif 4** (clase `crc-serif` o `font-serif`), peso 500–600,
  `leading-[1.1]`, `tracking-[-0.01em]`, `text-balance`. Sin cursivas
  decorativas en los titulares, salvo una palabra cuando aporta sentido.
- Texto e interfaz: **IBM Plex Sans** (`font-sans`, por defecto en `body`).
- Escala máxima (no se supera en ninguna página):
  - H1: `text-[clamp(2rem,3.2vw,3.25rem)]`
  - H2: `text-[clamp(1.6rem,2.3vw,2.4rem)]`
  - H3: `text-[1.35rem]` a `text-[1.6rem]`
  - Cuerpo: `text-[1rem]`/`text-[1.0625rem]`, `leading-[1.7]`, máx. ~65 caracteres.
  - Prohibido: `text-5xl` o más, clamps por encima de 3.25rem, `leading-[0.8x]`.
- **Etiquetas pequeñas**: se acabaron las mayúsculas con tracking amplio
  (`uppercase tracking-[0.2em] text-[0.6rem] font-extrabold`). Reemplazo:
  `text-[0.8125rem] font-semibold text-[#9f5528]` en tipo oración.
  Excepción única: abreviaturas reales (UF, CRC, PIE, OPD).
- **Botones**: tipo oración, `text-[0.9375rem] font-semibold`, sin `uppercase`
  ni tracking. Primario: fondo cobre, texto blanco. Secundario: borde tinta o
  link subrayado.
- Números y cifras: `tabular-nums`.

## 3. Superficie y forma

- Radio único: `rounded-[6px]` (tarjetas, botones, imágenes). Sin `rounded-xl/2xl`.
- Sin grano, sin manchas de luz (`blur-[140px]`), sin degradados decorativos,
  sin `backdrop-blur`, sin sombras grandes. Una sombra solo si separa una capa
  real (menú desplegable, modal).
- Tarjetas solo cuando agrupan algo clicable; preferir listas con filetes
  (`border-t border-[#d8cfc0]`) y buena grilla.

## 4. Imágenes

Permitidas solo imágenes reales:
- Retratos del equipo: `juan_carlos_real_white.png`, `juan-carlos-rauld-retrato.jpg`,
  `juan-carlos-rauld-furia-del-libro.jpg` (JC hablando en La Furia del Libro),
  `rocio-solar-crc-2026.png`, `rocio_solar_real_white.png`,
  `hugo-hormazabal-crc-2026-large.png`, `fernanda-gumucio.jpg`.
- Portadas de libros: `book_desproteccion.png`, `book_perspectivas.png`,
  `tecnocratas-portada.jpg`. Afiche real: `tecnocratas-evento-uah.jpeg`.
- Logos (CRC, Hammurabi, Altius) y videos de eventos reales en `/public`.

Todo lo demás en `/public/images` se trata como ilustración generada o stock
(archivos con `_abstract_`, timestamps de 13 dígitos, `-editorial`, `hero_*`,
`pillar_*`, `*_real.*`, etc.) y **no se usa como imagen decorativa**. Donde hoy
hay una, se reemplaza por una composición tipográfica: bloque de color de la
paleta con la categoría, el título en Source Serif y un dato o cita. No se
usan videos de stock (Pixabay).

## 5. Movimiento

- Solo: aparición sutil al entrar (opacidad 0→1 y `y: 12px`, 0.5–0.6 s,
  una vez), hover (color, subrayado, `translate-y-[-1px]`), foco visible.
- Prohibido: texto que se ilumina con scroll (scrub), elementos fijados
  (pin), imágenes que escalan con scroll, recortes animados, parallax.
- Siempre dentro de `prefers-reduced-motion: no-preference`; el contenido debe
  verse completo sin JavaScript.

## 6. Contenido

- Servicios con nombre, qué incluye, entregable y duración habitual. Sin
  precios inventados: "Valor según alcance".
- Nada de testimonios anónimos ni cifras que no tengan fuente.
- Tono: directo, sin adjetivos de venta ("blindar", "potente", "integral").
