-- ============================================================
-- Academia CRC – Migración 002
-- Inscripción de pago con activación manual + datos de pago
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- ────────────────────────────────────────────
-- 1) Nuevo estado 'pendiente' para inscripciones de pago
--    (el alumno solicita, el admin activa tras confirmar pago)
-- ────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'pendiente'
      AND enumtypid = 'inscripcion_estado'::regtype
  ) THEN
    ALTER TYPE inscripcion_estado ADD VALUE 'pendiente';
  END IF;
END$$;

-- ────────────────────────────────────────────
-- 2) Metadatos del pago/solicitud en la inscripción
-- ────────────────────────────────────────────
ALTER TABLE inscripciones
  ADD COLUMN IF NOT EXISTS metodo_pago     TEXT,        -- 'transferencia' | 'manual' | ...
  ADD COLUMN IF NOT EXISTS comprobante_ref TEXT,        -- nº operación / nota del alumno
  ADD COLUMN IF NOT EXISTS nota_admin      TEXT,        -- nota interna del admin
  ADD COLUMN IF NOT EXISTS activada_por    UUID REFERENCES profiles(id),
  ADD COLUMN IF NOT EXISTS fecha_activacion TIMESTAMPTZ;

-- ────────────────────────────────────────────
-- 3) Bucket público de Storage para el material de los cursos
--    (idempotente). Las lecciones se sirven desde aquí.
-- ────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('academia', 'academia', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Lectura pública del material (las slides/PDF se controlan a nivel de UI;
-- el material es de marketing/preview servible públicamente y el acceso
-- real al curso se gobierna por inscripción en la capa de aplicación).
DROP POLICY IF EXISTS "academia: lectura publica" ON storage.objects;
CREATE POLICY "academia: lectura publica"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'academia');

-- Escritura sólo para admins autenticados (el seed usa service_role y omite RLS).
DROP POLICY IF EXISTS "academia: escritura admin" ON storage.objects;
CREATE POLICY "academia: escritura admin"
  ON storage.objects FOR ALL
  USING (bucket_id = 'academia' AND public.get_my_role() = 'admin')
  WITH CHECK (bucket_id = 'academia' AND public.get_my_role() = 'admin');

-- ────────────────────────────────────────────
-- 4) FIX: get_my_role() debe ser SECURITY DEFINER
--    Sin esto, las políticas de `profiles` que llaman a get_my_role()
--    provocan recursión infinita (error 54001 "stack depth limit exceeded")
--    al leerse `lecciones`/`modulos`. SECURITY DEFINER omite RLS dentro
--    de la función y rompe la recursión.
-- ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS user_role
LANGUAGE sql STABLE
SECURITY DEFINER
SET search_path = public
AS $$ SELECT rol FROM public.profiles WHERE id = auth.uid() $$;

-- ────────────────────────────────────────────
-- 5) Vista pública de metadatos de lecciones
--    Expone SOLO columnas seguras (sin `contenido` ni `recurso_url`) para
--    mostrar el temario completo —con candado— a visitantes no inscritos.
--    `security_invoker = false` ⇒ omite la RLS de `lecciones` y muestra
--    todas las filas de cursos publicados, pero solo de estas columnas.
-- ────────────────────────────────────────────
CREATE OR REPLACE VIEW public.lecciones_meta AS
  SELECT l.id, l.modulo_id, l.curso_id, l.titulo, l.tipo,
         l.video_duracion_seg, l.es_preview, l.orden
  FROM public.lecciones l
  JOIN public.cursos c ON c.id = l.curso_id
  WHERE c.estado = 'publicado';

ALTER VIEW public.lecciones_meta SET (security_invoker = false);
GRANT SELECT ON public.lecciones_meta TO anon, authenticated;
