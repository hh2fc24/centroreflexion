/**
 * Tipos TypeScript del schema de Academia CRC en Supabase.
 *
 * Generados manualmente para esta versión inicial.
 * Una vez conectado Supabase, reemplazar con:
 *   npx supabase gen types typescript --project-id <id> > lib/supabase/database.types.ts
 */

export type UserRole = "admin" | "profesor" | "alumno";
export type CursoEstado = "borrador" | "publicado" | "archivado";
export type InscripcionEstado = "pendiente" | "activa" | "completada" | "cancelada";

// ─────────────────────────────────────────────
// Tablas
// ─────────────────────────────────────────────

export interface Profile {
  id: string;                  // UUID — mismo que auth.users.id
  email: string;
  nombre: string | null;
  apellido: string | null;
  avatar_url: string | null;
  rol: UserRole;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface Curso {
  id: string;
  slug: string;
  titulo: string;
  descripcion: string | null;
  descripcion_corta: string | null;
  imagen_url: string | null;
  precio: number;              // 0 = gratuito
  moneda: string;              // "CLP" | "USD"
  estado: CursoEstado;
  profesor_id: string;         // FK → profiles.id
  duracion_horas: number | null;
  nivel: "basico" | "intermedio" | "avanzado" | null;
  categoria: string | null;
  created_at: string;
  updated_at: string;
}

export interface Modulo {
  id: string;
  curso_id: string;            // FK → cursos.id
  titulo: string;
  descripcion: string | null;
  orden: number;
  created_at: string;
  updated_at: string;
}

export interface Leccion {
  id: string;
  modulo_id: string;           // FK → modulos.id
  curso_id: string;            // desnormalizado para queries directas
  titulo: string;
  descripcion: string | null;
  tipo: "video" | "texto" | "documento" | "quiz";
  video_url: string | null;    // URL del video (Vimeo, YouTube, Supabase Storage, etc.)
  video_duracion_seg: number | null;
  contenido: string | null;    // Markdown / texto enriquecido
  recurso_url: string | null;  // URL de archivo descargable
  orden: number;
  es_preview: boolean;         // visible sin inscripción
  created_at: string;
  updated_at: string;
}

export interface Inscripcion {
  id: string;
  alumno_id: string;           // FK → profiles.id
  curso_id: string;            // FK → cursos.id
  estado: InscripcionEstado;
  fecha_inscripcion: string;
  fecha_completado: string | null;
  monto_pagado: number | null;
  metodo_pago: string | null;
  comprobante_ref: string | null;
  nota_admin: string | null;
  activada_por: string | null;
  fecha_activacion: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProgresoLeccion {
  id: string;
  alumno_id: string;           // FK → profiles.id
  leccion_id: string;          // FK → lecciones.id
  curso_id: string;            // desnormalizado
  completada: boolean;
  porcentaje_visto: number;    // 0–100
  ultima_posicion_seg: number | null;  // para retomar video
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────
// Tipo Database completo (compatible con createClient<Database>)
// ─────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      cursos: {
        Row: Curso;
        Insert: Omit<Curso, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Curso, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      modulos: {
        Row: Modulo;
        Insert: Omit<Modulo, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Modulo, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      lecciones: {
        Row: Leccion;
        Insert: Omit<Leccion, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Leccion, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      inscripciones: {
        Row: Inscripcion;
        Insert: Omit<Inscripcion, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Inscripcion, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      progreso_lecciones: {
        Row: ProgresoLeccion;
        Insert: Omit<ProgresoLeccion, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<ProgresoLeccion, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      curso_estado: CursoEstado;
      inscripcion_estado: InscripcionEstado;
    };
    CompositeTypes: Record<string, never>;
  };
}
