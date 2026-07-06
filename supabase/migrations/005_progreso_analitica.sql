-- 005_progreso_analitica.sql
-- Analítica de aprendizaje: tiempo dedicado, número de vistas y fechas por lección.
-- Aditivo y seguro (IF NOT EXISTS). Aplicado en producción el 2026-07-06.

alter table public.progreso_lecciones
  add column if not exists segundos_dedicados integer not null default 0,
  add column if not exists vistas            integer not null default 0,
  add column if not exists primera_vista      timestamptz,
  add column if not exists ultima_vista       timestamptz;

comment on column public.progreso_lecciones.segundos_dedicados is 'Tiempo real acumulado en la lección (segundos, solo pestaña visible).';
comment on column public.progreso_lecciones.vistas is 'Número de aperturas de la lección por el alumno.';
comment on column public.progreso_lecciones.primera_vista is 'Primera vez que el alumno abrió la lección.';
comment on column public.progreso_lecciones.ultima_vista is 'Última actividad del alumno en la lección.';

-- Registro atómico de progreso desde el reproductor (heartbeat + apertura).
-- Usa auth.uid() como alumno; acumula tiempo, cuenta vistas y actualiza fechas.
create or replace function public.registrar_progreso(
  p_leccion uuid,
  p_curso uuid,
  p_delta_seg integer default 0,
  p_pct integer default null,
  p_pos integer default null,
  p_nueva_vista boolean default false
) returns void
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_alumno uuid := auth.uid();
begin
  if v_alumno is null then
    return;
  end if;

  insert into public.progreso_lecciones as pr
    (alumno_id, leccion_id, curso_id, porcentaje_visto, ultima_posicion_seg,
     segundos_dedicados, vistas, primera_vista, ultima_vista, updated_at)
  values
    (v_alumno, p_leccion, p_curso, coalesce(p_pct, 0), p_pos,
     greatest(coalesce(p_delta_seg, 0), 0),
     case when p_nueva_vista then 1 else 0 end,
     now(), now(), now())
  on conflict (alumno_id, leccion_id) do update set
    porcentaje_visto    = greatest(pr.porcentaje_visto, coalesce(p_pct, pr.porcentaje_visto)),
    ultima_posicion_seg = coalesce(p_pos, pr.ultima_posicion_seg),
    segundos_dedicados  = pr.segundos_dedicados + greatest(coalesce(p_delta_seg, 0), 0),
    vistas              = pr.vistas + case when p_nueva_vista then 1 else 0 end,
    primera_vista       = coalesce(pr.primera_vista, now()),
    ultima_vista        = now(),
    updated_at          = now();
end;
$fn$;

grant execute on function public.registrar_progreso(uuid, uuid, integer, integer, integer, boolean)
  to authenticated, anon, service_role;
