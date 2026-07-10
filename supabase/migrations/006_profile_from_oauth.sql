-- ────────────────────────────────────────────
-- 006 · Poblar profiles con los datos del SSO (Google)
-- ────────────────────────────────────────────
-- Problema: handle_new_user() solo guardaba id + email, por lo que
-- profiles.nombre quedaba NULL y la UI caía al prefijo del correo
-- (ej. "hh2fc24"). Google entrega el nombre y el avatar en
-- auth.users.raw_user_meta_data (full_name / name / given_name /
-- family_name / avatar_url / picture). Aquí los extraemos.

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  meta        JSONB := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);
  full_name   TEXT  := NULLIF(TRIM(COALESCE(meta->>'full_name', meta->>'name', '')), '');
  v_nombre    TEXT;
  v_apellido  TEXT;
  v_avatar    TEXT  := COALESCE(meta->>'avatar_url', meta->>'picture');
BEGIN
  -- Nombre: given_name si viene; si no, la primera palabra del nombre completo.
  v_nombre := COALESCE(
    NULLIF(TRIM(meta->>'given_name'), ''),
    NULLIF(split_part(COALESCE(full_name, ''), ' ', 1), '')
  );
  -- Apellido: family_name si viene; si no, el resto del nombre completo.
  v_apellido := COALESCE(
    NULLIF(TRIM(meta->>'family_name'), ''),
    NULLIF(TRIM(SUBSTRING(COALESCE(full_name, '') FROM POSITION(' ' IN COALESCE(full_name, '') || ' '))), '')
  );

  INSERT INTO profiles (id, email, nombre, apellido, avatar_url)
  VALUES (NEW.id, NEW.email, v_nombre, v_apellido, v_avatar)
  ON CONFLICT (id) DO UPDATE SET
    email      = EXCLUDED.email,
    nombre     = COALESCE(profiles.nombre, EXCLUDED.nombre),
    apellido   = COALESCE(profiles.apellido, EXCLUDED.apellido),
    avatar_url = COALESCE(profiles.avatar_url, EXCLUDED.avatar_url),
    updated_at = NOW();

  RETURN NEW;
END;
$$;

-- Backfill: rellenar los perfiles existentes que quedaron sin nombre.
UPDATE profiles p
SET
  nombre = COALESCE(
    p.nombre,
    NULLIF(TRIM(u.raw_user_meta_data->>'given_name'), ''),
    NULLIF(split_part(TRIM(COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', '')), ' ', 1), '')
  ),
  apellido = COALESCE(
    p.apellido,
    NULLIF(TRIM(u.raw_user_meta_data->>'family_name'), ''),
    NULLIF(TRIM(SUBSTRING(
      TRIM(COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', ''))
      FROM POSITION(' ' IN TRIM(COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', '')) || ' ')
    )), '')
  ),
  avatar_url = COALESCE(p.avatar_url, u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture'),
  updated_at = NOW()
FROM auth.users u
WHERE u.id = p.id
  AND (p.nombre IS NULL OR p.avatar_url IS NULL);
