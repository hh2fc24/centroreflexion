/**
 * Información extendida (editorial) de profesores de la Academia CRC.
 * El perfil base (nombre, bio, avatar) vive en la tabla `profiles`.
 * Aquí se enriquece con material curado (libros, ideas, credenciales)
 * para profesores destacados, indexado por email.
 */
export interface ProfesorExtra {
  titulo: string; // rol / tagline
  temaCentral?: string;
  credenciales: string[];
  ideasClave: string[];
  libros: { titulo: string; anio: string; resena?: string }[];
  fraseDestacada?: string;
}

export const PROFESORES_EXTRA: Record<string, ProfesorExtra> = {
  "juan.rauld@centrodereflexionescriticas.com": {
    titulo: "Trabajador Social · Autor · Analista en políticas de infancia",
    temaCentral: "Infancia, desprotección y neoliberalismo en Chile",
    credenciales: [
      "Doctorando en Trabajo Social, Universidad Rovira i Virgili (España)",
      "Magíster en Filosofía Política Contemporánea, Universidad Diego Portales",
      "Trabajador Social, Universidad Tecnológica Metropolitana",
      "16 años de experiencia en dirección de programas de infancia y gestión pública",
    ],
    ideasClave: [
      "La desprotección infantil no es ausencia del Estado, sino una forma específica de intervención.",
      "En Chile los niños no están fuera del sistema de protección; están atrapados en él.",
      "Cuando el cuidado se vuelve solo técnico, deja de ser cuidado.",
      "La forma en que una sociedad trata a sus niños revela su proyecto político.",
    ],
    libros: [
      {
        titulo: "Desprotección de la infancia: Dominación, Biopolítica y Gobierno",
        anio: "2021",
        resena:
          "Analiza críticamente el sistema de protección de la niñez desde una perspectiva político-institucional " +
          "y sociohistórica, situando la desprotección infantil como un problema estructural del Estado contemporáneo.",
      },
      {
        titulo: "Perspectivas críticas de la salud mental infantil: Trauma, Institucionalización y Suplicio",
        anio: "2022",
        resena:
          "Examina la salud mental infantil como un campo atravesado por saberes expertos, dispositivos de control y " +
          "racionalidades biomédicas, cuestionando la expansión diagnóstica y la medicalización de la infancia.",
      },
      {
        titulo: "Tecnócratas de la infancia: Desprotección y neoliberalismo en Chile",
        anio: "2026",
        resena:
          "Desmonta la gestión tecnocrática de la infancia pobre mediante una lectura genealógica y biopolítica. " +
          "La noción de «suplicio» permite comprender el daño institucional prolongado más allá del trauma individual.",
      },
    ],
    fraseDestacada: "Chile gobierna a su infancia pobre con tecnocracia, no con cuidado.",
  },
};
