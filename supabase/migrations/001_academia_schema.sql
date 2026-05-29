-- ============================================================
-- Academia CRC – Schema inicial
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- O via: supabase db push
-- ============================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ────────────────────────────────────────────
-- ENUMs
-- ────────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('admin', 'profesor', 'alumno');
CREATE TYPE curso_estado AS ENUM ('borrador', 'publicado', 'archivado');
CREATE TYPE inscripcion_estado AS ENUM ('activa', 'completada', 'cancelada');
CREATE TYPE leccion_tipo AS ENUM ('video', 'texto', 'documento', 'quiz');
CREATE TYPE curso_nivel AS ENUM ('basico', 'intermedio', 'avanzado');

-- ────────────────────────────────────────────
-- PROFILES (extiende auth.users de Supabase)
-- ────────────────────────────────────────────

CREATE TABLE profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        TEXT NOT NULL,
  nombre       TEXT,
  apellido     TEXT,
  avatar_url   TEXT,
  rol          user_role NOT NULL DEFAULT 'alumno',
  bio          TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger: crear profile automáticamente al registrarse
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ────────────────────────────────────────────
-- CURSOS
-- ────────────────────────────────────────────

CREATE TABLE cursos (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug             TEXT NOT NULL UNIQUE,
  titulo           TEXT NOT NULL,
  descripcion      TEXT,
  descripcion_corta TEXT,
  imagen_url       TEXT,
  precio           NUMERIC(10, 2) NOT NULL DEFAULT 0,
  moneda           TEXT NOT NULL DEFAULT 'CLP',
  estado           curso_estado NOT NULL DEFAULT 'borrador',
  profesor_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  duracion_horas   NUMERIC(5, 1),
  nivel            curso_nivel,
  categoria        TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────
-- MÓDULOS
-- ────────────────────────────────────────────

CREATE TABLE modulos (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  curso_id    UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  titulo      TEXT NOT NULL,
  descripcion TEXT,
  orden       INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────
-- LECCIONES
-- ────────────────────────────────────────────

CREATE TABLE lecciones (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  modulo_id           UUID NOT NULL REFERENCES modulos(id) ON DELETE CASCADE,
  curso_id            UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,  -- desnormalizado
  titulo              TEXT NOT NULL,
  descripcion         TEXT,
  tipo                leccion_tipo NOT NULL DEFAULT 'video',
  video_url           TEXT,
  video_duracion_seg  INTEGER,
  contenido           TEXT,
  recurso_url         TEXT,
  orden               INTEGER NOT NULL DEFAULT 0,
  es_preview          BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────
-- INSCRIPCIONES
-- ────────────────────────────────────────────

CREATE TABLE inscripciones (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alumno_id          UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  curso_id           UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  estado             inscripcion_estado NOT NULL DEFAULT 'activa',
  fecha_inscripcion  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fecha_completado   TIMESTAMPTZ,
  monto_pagado       NUMERIC(10, 2),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (alumno_id, curso_id)  -- un alumno no puede inscribirse dos veces
);

-- ────────────────────────────────────────────
-- PROGRESO POR LECCIÓN
-- ────────────────────────────────────────────

CREATE TABLE progreso_lecciones (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alumno_id             UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  leccion_id            UUID NOT NULL REFERENCES lecciones(id) ON DELETE CASCADE,
  curso_id              UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,  -- desnormalizado
  completada            BOOLEAN NOT NULL DEFAULT FALSE,
  porcentaje_visto      SMALLINT NOT NULL DEFAULT 0 CHECK (porcentaje_visto BETWEEN 0 AND 100),
  ultima_posicion_seg   INTEGER,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (alumno_id, leccion_id)
);

-- ────────────────────────────────────────────
-- ÍNDICES
-- ────────────────────────────────────────────

CREATE INDEX idx_cursos_profesor     ON cursos(profesor_id);
CREATE INDEX idx_cursos_estado       ON cursos(estado);
CREATE INDEX idx_modulos_curso       ON modulos(curso_id, orden);
CREATE INDEX idx_lecciones_modulo    ON lecciones(modulo_id, orden);
CREATE INDEX idx_lecciones_curso     ON lecciones(curso_id);
CREATE INDEX idx_inscripciones_alumno ON inscripciones(alumno_id);
CREATE INDEX idx_inscripciones_curso  ON inscripciones(curso_id);
CREATE INDEX idx_progreso_alumno     ON progreso_lecciones(alumno_id, curso_id);

-- ────────────────────────────────────────────
-- TRIGGERS updated_at automático
-- ────────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_cursos_updated_at
  BEFORE UPDATE ON cursos
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_modulos_updated_at
  BEFORE UPDATE ON modulos
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_lecciones_updated_at
  BEFORE UPDATE ON lecciones
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_inscripciones_updated_at
  BEFORE UPDATE ON inscripciones
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_progreso_updated_at
  BEFORE UPDATE ON progreso_lecciones
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ────────────────────────────────────────────

ALTER TABLE profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos               ENABLE ROW LEVEL SECURITY;
ALTER TABLE modulos              ENABLE ROW LEVEL SECURITY;
ALTER TABLE lecciones            ENABLE ROW LEVEL SECURITY;
ALTER TABLE inscripciones        ENABLE ROW LEVEL SECURITY;
ALTER TABLE progreso_lecciones   ENABLE ROW LEVEL SECURITY;

-- Helper: obtener rol del usuario actual
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS user_role
LANGUAGE sql STABLE
AS $$
  SELECT rol FROM profiles WHERE id = auth.uid();
$$;

-- ── profiles ──
CREATE POLICY "profiles: lectura propia"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "profiles: admin lee todo"
  ON profiles FOR SELECT
  USING (get_my_role() = 'admin');

CREATE POLICY "profiles: actualizar propio"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- ── cursos ──
CREATE POLICY "cursos: cualquiera ve publicados"
  ON cursos FOR SELECT
  USING (estado = 'publicado');

CREATE POLICY "cursos: profesor ve y edita los suyos"
  ON cursos FOR ALL
  USING (profesor_id = auth.uid());

CREATE POLICY "cursos: admin acceso total"
  ON cursos FOR ALL
  USING (get_my_role() = 'admin');

-- ── módulos y lecciones: heredan acceso del curso ──
CREATE POLICY "modulos: acceso via curso publicado"
  ON modulos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cursos
      WHERE cursos.id = modulos.curso_id
        AND (cursos.estado = 'publicado' OR cursos.profesor_id = auth.uid())
    )
  );

CREATE POLICY "modulos: profesor gestiona los suyos"
  ON modulos FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM cursos
      WHERE cursos.id = modulos.curso_id
        AND cursos.profesor_id = auth.uid()
    )
  );

CREATE POLICY "modulos: admin acceso total"
  ON modulos FOR ALL
  USING (get_my_role() = 'admin');

CREATE POLICY "lecciones: preview publica"
  ON lecciones FOR SELECT
  USING (es_preview = TRUE);

CREATE POLICY "lecciones: alumno inscrito lee todo"
  ON lecciones FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM inscripciones
      WHERE inscripciones.curso_id = lecciones.curso_id
        AND inscripciones.alumno_id = auth.uid()
        AND inscripciones.estado = 'activa'
    )
  );

CREATE POLICY "lecciones: profesor gestiona las suyas"
  ON lecciones FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM cursos
      WHERE cursos.id = lecciones.curso_id
        AND cursos.profesor_id = auth.uid()
    )
  );

CREATE POLICY "lecciones: admin acceso total"
  ON lecciones FOR ALL
  USING (get_my_role() = 'admin');

-- ── inscripciones ──
CREATE POLICY "inscripciones: alumno ve las suyas"
  ON inscripciones FOR SELECT
  USING (alumno_id = auth.uid());

CREATE POLICY "inscripciones: alumno crea la suya"
  ON inscripciones FOR INSERT
  WITH CHECK (alumno_id = auth.uid());

CREATE POLICY "inscripciones: profesor ve inscritos en sus cursos"
  ON inscripciones FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cursos
      WHERE cursos.id = inscripciones.curso_id
        AND cursos.profesor_id = auth.uid()
    )
  );

CREATE POLICY "inscripciones: admin acceso total"
  ON inscripciones FOR ALL
  USING (get_my_role() = 'admin');

-- ── progreso ──
CREATE POLICY "progreso: alumno gestiona el suyo"
  ON progreso_lecciones FOR ALL
  USING (alumno_id = auth.uid());

CREATE POLICY "progreso: profesor ve progreso en sus cursos"
  ON progreso_lecciones FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cursos
      WHERE cursos.id = progreso_lecciones.curso_id
        AND cursos.profesor_id = auth.uid()
    )
  );

CREATE POLICY "progreso: admin acceso total"
  ON progreso_lecciones FOR ALL
  USING (get_my_role() = 'admin');
