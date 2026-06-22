# SEO y tráfico cruzado — Centro de Reflexiones Críticas

## 1. Qué se corrigió en el sitio

El sitio (Next.js, dominio `centrodereflexionescriticas.com`) tenía sitemap y robots.txt, pero ocho páginas no exportaban metadata: home, servicios, clínica, consultoría, bienestar escolar, formación, contacto, conócenos, crítica, pensamiento crítico y envía-tu-texto. Google estaba indexando esas páginas sin título ni descripción propios, lo que reduce el CTR en resultados de búsqueda y debilita el posicionamiento por tema.

Se agregó metadata (title, description, Open Graph) a cada una de esas páginas, usando como ejes de palabra clave los temas reales que cubren: atención clínica en salud mental e infancia, consultoría institucional, bienestar y compliance escolar (con foco en la Ley 21.809 de Convivencia Escolar, vigente desde abril 2026), formación de equipos, y columnas de pensamiento crítico y crítica cultural.

También se añadió:
- **Datos estructurados (schema.org):** Organization con enlaces a Instagram y YouTube (`sameAs`), WebSite con SearchAction, y mejoras al schema de Article (fecha en formato ISO, publisher, mainEntityOfPage) para que Google pueda mostrar rich snippets en los artículos.
- **Sitemap ampliado:** se agregaron las rutas `/critica`, `/pensamiento-critico`, `/envia-tu-texto`, `/academia`, la declaración pública sobre niñez migrante haitiana, y los cursos publicados de la Academia (consultados directamente desde Supabase).
- **Alt text:** se corrigió una miniatura de artículo que no describía la imagen (afecta Google Imágenes).

Falta correr `npm run build` en tu máquina o en Vercel para confirmar que todo compila sin errores — no pude completar esa verificación en este entorno por una limitación del sandbox, aunque el chequeo de tipos de TypeScript pasó sin errores.

## 2. Qué buscar para aparecer en Google

La intención de búsqueda más fuerte y de mayor actualidad para el centro está en torno a la nueva ley escolar: "Ley 21.809", "ley convivencia escolar 2026", "coordinador de convivencia educativa", "protocolos acoso escolar Chile". Esto ya está bien cubierto en la página de compliance escolar; conviene que bienestar-escolar, formación y al menos una columna de pensamiento crítico aterricen también en esos términos mientras la ley sigue siendo noticia (plazo de implementación: abril 2027).

El segundo eje es infancia y crianza: "crianza terapéutica", "intervención temprana infancia", "salud mental infantil Chile", "terapia familiar". Hay más competencia académica que comercial en este espacio, así que el contenido que mejor posiciona es el que mezcla rigor técnico con casos o columnas de opinión — el formato que ya usan en pensamiento-crítico y crítica.

El tercer eje es institucional: "consultoría modelos de intervención", "diagnóstico programas sociales", "gestión de convivencia institucional" — bajo volumen de búsqueda pero alta intención (clientes B2B/fundaciones), por lo que vale más por conversión que por tráfico.

## 3. Tráfico cruzado: Instagram y YouTube → sitio

No tengo acceso directo a las cuentas (no hay conector disponible y no se conectó Claude en Chrome), así que esto son recomendaciones para que las apliques tú mismo o me compartas las cuentas más adelante.

**Bio e infraestructura de enlaces.** Si Instagram aún no usa un link-in-bio con varias rutas, conviene uno que reparta tráfico entre `/servicios`, `/pensamiento-critico` y `/contacto` según el tema del post, en lugar de mandar todo siempre a la home. YouTube debería tener la URL del sitio en la descripción del canal y repetida en la primera línea de cada video (lo único visible sin expandir "más").

**Cada publicación debe empujar a una página específica, no a la home.** Un reel sobre bullying escolar enlaza a `/servicios/bienestar-escolar` o a la columna correspondiente en `/pensamiento-critico`; un video sobre crianza enlaza a `/servicios/clinica`; contenido de crítica cultural enlaza a `/critica`. Esto es lo que realmente mueve el "tráfico full al sitio" que buscas: cada pieza de redes necesita su propia URL de destino relacionada, no un enlace genérico.

**Descripciones de YouTube como texto SEO.** Cada descripción debería tener 2–3 frases con las palabras clave del tema del video (las del punto 2) más el enlace directo a la página del sitio que corresponde. YouTube indexa ese texto y también ayuda a que el video aparezca en búsquedas de Google, no solo dentro de YouTube.

**Hashtags y temas alineados con la ley 21.809 mientras esté vigente la conversación pública** (acoso escolar, convivencia, protocolos) van a captar búsqueda real de apoderados y colegios — es el momento de mayor interés sostenido que tiene el centro ahora mismo.

**Republicar columnas como hilos o carruseles.** El contenido de `/pensamiento-critico` y `/critica` ya existe en el sitio; convertir cada columna en un carrusel de Instagram con el titular y 3–4 ideas clave, cerrando con "columna completa en el link de la bio", genera tráfico de vuelta sin crear contenido nuevo desde cero.

## 4. Siguientes pasos sugeridos

Si quieres que esto se vuelva automático en vez de manual, dos caminos: instalar Claude in Chrome para que pueda revisar tus publicaciones reales y dar recomendaciones específicas por post, o decirme directamente los temas de tus próximos 4–5 posts para escribirte el copy y el enlace de destino de cada uno.
