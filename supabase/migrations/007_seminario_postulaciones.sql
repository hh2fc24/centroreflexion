-- ============================================================
-- Postulaciones al seminario "Desprotección de la Infancia"
-- Cohorte 1 · octubre–diciembre 2026
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS seminario_postulaciones (
  id          TEXT PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  message     TEXT,
  page        TEXT,
  fields      JSONB
);

CREATE INDEX IF NOT EXISTS seminario_postulaciones_created_at_idx
  ON seminario_postulaciones (created_at DESC);

CREATE INDEX IF NOT EXISTS seminario_postulaciones_email_idx
  ON seminario_postulaciones (email);

-- Solo el service role (API server-side) escribe y lee esta tabla.
-- RLS activo sin políticas = nadie con anon key puede tocarla.
ALTER TABLE seminario_postulaciones ENABLE ROW LEVEL SECURITY;
