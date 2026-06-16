# Academia CRC — Despliegue del primer curso

Curso: **Intervención Social en Salud Mental Infantil en Trabajo Social**
Profesor: **Juan Carlos Rauld Farías** · Precio: **$149.000 CLP** (pago por transferencia con activación manual).

El material ya está procesado en `academia-content/` (no se versiona en git): por cada clase hay
`doc.pdf` (descarga), `slide-001.webp…` (lectura en línea como diapositivas), `cover.webp` y
`text.json` (lectura accesible en texto). Total: 11 lecciones, 265 diapositivas.

## Pasos para dejarlo en vivo

### 1) Aplicar el schema en Supabase
En el **SQL Editor** del proyecto Supabase (o con `supabase db push`), ejecuta en orden:

1. `supabase/migrations/001_academia_schema.sql`  — tablas de la academia (si aún no está aplicado).
2. `supabase/migrations/002_academia_inscripcion_pendiente.sql` — estado `pendiente`, datos de pago y bucket `academia`.

> ⚠️ La base de producción es compartida con otros sistemas. La migración 001 crea un trigger
> sobre `auth.users` (`on_auth_user_created`) que inserta en `profiles` en cada registro. Revísalo
> antes de aplicarlo si ese proyecto de Supabase aloja otras apps con autenticación.

### 2) Subir el material y sembrar el curso
Con `.env.local` poblado (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`):

```bash
npm install
node scripts/seed-academia.mjs
```

Esto: crea el bucket `academia`, sube los PDFs/diapositivas, crea el perfil del profesor,
el curso, los 2 módulos y las 11 lecciones (Programa y Clase 1 quedan como **preview** gratis).

Variables opcionales:
- `PROFESOR_EMAIL` — email de la cuenta del profesor (por defecto `juan.rauld@centrodereflexionescriticas.com`).

### 3) Editar datos de pago
En `lib/academia/pago.ts` completa los datos reales de transferencia (titular, RUT, banco, cuenta).
El WhatsApp ya apunta a `+56 9 4918 6447`.

### 4) Rol admin (para activar inscripciones)
Marca tu usuario como admin (una vez creada tu cuenta en `/academia/login`):

```sql
update profiles set rol = 'admin' where email = 'TU_EMAIL';
```

Las solicitudes de pago llegan a **`/academia/admin/solicitudes`**: confirmas la transferencia y
activas el acceso del alumno con un clic.

### 5) Lanzamiento del catálogo
La portada `/academia` ya queda **lanzada** por defecto. Para volver al modo "Próximamente"
(waitlist): define `NEXT_PUBLIC_ACADEMIA_LAUNCHED=false`.

## Mapa de la experiencia del alumno
- `/academia` — catálogo.
- `/academia/cursos/[slug]` — ficha del curso (temario, instructor, precio, solicitar inscripción).
- `/academia/cursos/[slug]/leccion/[id]` — **aula**: lectura en línea en 3 modos (diapositivas / PDF / texto), descarga, progreso, anterior/siguiente.
- `/academia/cursos/[slug]/inscripcion` — instrucciones de pago tras solicitar.
- `/academia/profesores/[id]` — perfil público del profesor (bio, libros, ideas clave, cursos).
- `/academia/mis-cursos`, `/academia/dashboard` — área del alumno.
- `/academia/admin/cursos`, `/academia/admin/solicitudes` — administración.
