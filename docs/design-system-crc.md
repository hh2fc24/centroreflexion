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

Las imágenes editoriales del CRC (fotografía de estilo documental, generada o
real, en `/public/images`) son la **línea editorial del centro y se conservan**.
Cada columna, artículo, servicio y sección que tenía imagen la mantiene. Lo
mismo para los videos de formación y clínica y las capturas de prensa.

Cómo se tratan en el diseño sobrio:
- Encuadre limpio, `rounded-[6px]`, `object-cover`, sin marcos decorativos.
- Sin `mix-blend-luminosity`, sin grano encima y sin degradados fuertes. Solo
  un velo suave de tinta cuando hay texto sobre la imagen, para que se lea.
- Pie de foto breve cuando la imagen es una persona o un evento real.
- La portada tipográfica (`TypographicCover`) queda solo como respaldo cuando
  un contenido no tiene imagen.
- Videos: `muted`, `playsInline`, `preload="metadata"`; en autoplay solo si ya
  lo estaban.

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
