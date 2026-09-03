-- ============================================================
-- Pagos del seminario "Desprotección de la Infancia"
-- Cohorte 1 · octubre–diciembre 2026
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS seminario_pagos (
  id                  TEXT PRIMARY KEY,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- 'pendiente' | 'aprobado' | 'rechazado'. Solo 'aprobado' ocupa cupo.
  estado              TEXT NOT NULL DEFAULT 'pendiente',
  -- 'fundadores' | 'anticipada' | 'general'
  tramo               TEXT NOT NULL,
  monto               INTEGER NOT NULL,
  name                TEXT NOT NULL,
  email               TEXT NOT NULL,
  phone               TEXT,
  institucion         TEXT,
  -- Es la llave con la que el webhook de Mercado Pago encuentra la fila.
  external_reference  TEXT NOT NULL UNIQUE,
  preference_id       TEXT,
  payment_id          TEXT,
  aprobado_at         TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS seminario_pagos_estado_idx ON seminario_pagos (estado);
CREATE INDEX IF NOT EXISTS seminario_pagos_created_at_idx ON seminario_pagos (created_at DESC);

-- Solo el service role (API server-side) toca esta tabla.
ALTER TABLE seminario_pagos ENABLE ROW LEVEL SECURITY;
