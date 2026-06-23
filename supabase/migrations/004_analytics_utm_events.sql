-- ============================================================
-- Analítica: UTM, metadata de navegador y eventos de conversión
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- ────────────────────────────────────────────
-- Columnas nuevas en pageviews (UTM + metadata de cliente)
-- ────────────────────────────────────────────

ALTER TABLE analytics_pageviews
  ADD COLUMN IF NOT EXISTS utm_source TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
  ADD COLUMN IF NOT EXISTS language TEXT,
  ADD COLUMN IF NOT EXISTS browser TEXT,
  ADD COLUMN IF NOT EXISTS os TEXT,
  ADD COLUMN IF NOT EXISTS viewport_width INTEGER;

CREATE INDEX IF NOT EXISTS idx_analytics_pageviews_utm_source ON analytics_pageviews (utm_source);

-- ────────────────────────────────────────────
-- Eventos de conversión (lead, suscripción, inscripción, pago)
-- ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS analytics_events (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  event_name  TEXT NOT NULL,
  path        TEXT,
  ip          TEXT,
  country     TEXT,
  metadata    JSONB
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics_events (event_name);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Sin policies públicas: igual que analytics_pageviews, solo el service role
-- (server-side) puede leer/escribir.
