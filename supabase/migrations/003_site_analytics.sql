-- ============================================================
-- Analítica propia del sitio (pageviews + consentimiento de cookies)
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ────────────────────────────────────────────
-- PAGEVIEWS
-- ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS analytics_pageviews (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  path        TEXT NOT NULL,
  referrer    TEXT,
  ip          TEXT,
  country     TEXT,
  region      TEXT,
  city        TEXT,
  user_agent  TEXT,
  device      TEXT,
  is_bot      BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_analytics_pageviews_created_at ON analytics_pageviews (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_pageviews_country ON analytics_pageviews (country);
CREATE INDEX IF NOT EXISTS idx_analytics_pageviews_path ON analytics_pageviews (path);

ALTER TABLE analytics_pageviews ENABLE ROW LEVEL SECURITY;

-- Sin policies públicas: solo el service role (usado server-side) puede leer/escribir.
-- Esto bloquea por defecto cualquier acceso desde el cliente con la anon key.

-- ────────────────────────────────────────────
-- CONSENTIMIENTO DE COOKIES
-- ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS analytics_consent_events (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  choice      TEXT NOT NULL CHECK (choice IN ('accepted', 'rejected')),
  path        TEXT,
  ip          TEXT,
  country     TEXT
);

CREATE INDEX IF NOT EXISTS idx_analytics_consent_created_at ON analytics_consent_events (created_at DESC);

ALTER TABLE analytics_consent_events ENABLE ROW LEVEL SECURITY;

-- Retención: opcional, borrar pageviews de más de 180 días para no acumular indefinidamente.
-- Ejecutar manualmente o agendar (pg_cron si está disponible):
-- DELETE FROM analytics_pageviews WHERE created_at < NOW() - INTERVAL '180 days';
