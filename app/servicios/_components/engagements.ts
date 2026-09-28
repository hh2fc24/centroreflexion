/**
 * Oferta institucional con nombre. Una sola fuente para /instituciones y para
 * cada página de servicio. Sin precios: el valor se define según el alcance.
 * Las duraciones son las habituales que ya declara /instituciones (diagnóstico
 * de 2 a 3 semanas, implementación de 1 a 4 meses) o las del propio servicio.
 */

export type Engagement = {
    id: string;
    area: string;
    areaHref: string;
    name: string;
    forWhom: string;
    includes: string[];
    deliverable: string;
    duration: string;
    lead: string;
};

export const VALUE_NOTE = "Valor según alcance";

export const COMPLIANCE_DIAGNOSTICO: Engagement = {
    id: "diagnostico-ley-21809",
    area: "Compliance escolar",
    areaHref: "/servicios/compliance-escolar",
    name: "Diagnóstico de cumplimiento Ley 21.809",
    forWhom: "Sostenedores, equipos directivos y encargados de convivencia escolar.",
    includes: [
        "Revisión del reglamento interno, los protocolos y los registros frente a acoso, violencia y discriminación.",
        "Entrevistas con dirección, convivencia escolar y una muestra de docentes.",
        "Lectura de casos tipo: cuándo se activó el protocolo, quién decidió y qué quedó registrado.",
        "Contraste con las exigencias de la Ley 21.809 y con los criterios de fallos recientes.",
    ],
    deliverable: "Informe de brechas con riesgos priorizados y una ruta de trabajo.",
    duration: "2 a 3 semanas",
    lead: "Hugo Felipe Hormazábal",
};

export const COMPLIANCE_IMPLEMENTACION: Engagement = {
    id: "implementacion-protocolos",
    area: "Compliance escolar",
    areaHref: "/servicios/compliance-escolar",
    name: "Implementación de protocolos y trazabilidad",
    forWhom: "Colegios que ya conocen sus brechas y necesitan cerrarlas con el equipo funcionando.",
    includes: [
        "Ajuste de protocolos para que sean aplicables: roles, plazos y criterios de escalamiento.",
        "Formato de registro de decisiones, medidas y seguimiento de cada caso.",
        "Capacitación de equipo directivo, convivencia, docentes y asistentes en la aplicación.",
        "Acompañamiento en los primeros casos reales con el protocolo ajustado.",
    ],
    deliverable: "Protocolos ajustados, registro en uso y equipo capacitado, con informe de cierre.",
    duration: "1 a 4 meses, según el alcance",
    lead: "Hugo Felipe Hormazábal",
};

export const FORMACION_PROGRAMA: Engagement = {
    id: "programa-formacion",
    area: "Formación",
    areaHref: "/servicios/formacion",
    name: "Programa de formación para equipos",
    forWhom: "Equipos de programas de protección (PRM, PPF, DAM, OPD), colegios, fundaciones y equipos de salud.",
    includes: [
        "Conversación previa con la jefatura para definir el foco y el nivel del equipo.",
        "Módulos en intervención en crisis, evaluación de riesgo psicosocial o gestión de programas sociales.",
        "Trabajo con casos del propio equipo, no con ejemplos genéricos.",
        "Material de apoyo y registro de asistencia.",
    ],
    deliverable: "Programa dictado, material del curso y nota de cierre con recomendaciones para el equipo.",
    duration: "Jornadas de 4 a 8 horas o ciclos de varias sesiones",
    lead: "Juan Carlos Rauld",
};

export const FORMACION_SEMINARIO: Engagement = {
    id: "seminario-cerrado",
    area: "Formación",
    areaHref: "/servicios/formacion#seminario-cerrado",
    name: "Seminario en formato cerrado",
    forWhom: "Un solo equipo, desde 8 personas de la misma institución: programas, escuelas, fundaciones u oficinas locales de niñez.",
    includes: [
        "El seminario Desprotección de la infancia, dictado por su autor, Juan Carlos Rauld.",
        "Fechas y horario definidos con la institución.",
        "Lectura de los casos del equipo con el marco del seminario.",
        "Factura a nombre de la institución.",
    ],
    deliverable: "Seminario completo para el equipo, con la bibliografía y el material de cada sesión.",
    duration: "8 sesiones (16 horas), en el calendario del equipo",
    lead: "Juan Carlos Rauld",
};

export const CONSULTORIA_MODELO: Engagement = {
    id: "rediseno-modelo",
    area: "Consultoría",
    areaHref: "/servicios/consultoria",
    name: "Evaluación y rediseño de modelo de intervención",
    forWhom: "Programas sociales, fundaciones, municipios y equipos directivos.",
    includes: [
        "Revisión del modelo vigente: orientaciones técnicas, flujos, registros y carga de trabajo.",
        "Entrevistas y talleres con el equipo para levantar criterios de decisión.",
        "Rediseño de procesos, roles e indicadores que el equipo pueda sostener.",
        "Reportería y automatización con Altius Ignite, cuando el programa lo requiere.",
    ],
    deliverable: "Informe diagnóstico y modelo rediseñado: criterios, procesos, registros e indicadores.",
    duration: "Diagnóstico en 2 a 3 semanas; rediseño e implementación entre 1 y 4 meses",
    lead: "Hugo Felipe Hormazábal",
};

export const SUPERVISION_CLINICA: Engagement = {
    id: "supervision-clinica",
    area: "Clínica",
    areaHref: "/servicios/clinica#supervision",
    name: "Supervisión clínica de casos complejos",
    forWhom: "Equipos de salud mental, programas PIE, programas de protección y colegios que sostienen casos de alta complejidad.",
    includes: [
        "Revisión de casos en salud mental infanto-juvenil, individual o grupal.",
        "Orientación en evaluación, formulación e intervención.",
        "Apoyo en la planificación de intervenciones y en la coordinación con redes.",
        "Espacio de reflexión sobre buenas prácticas y cuidado del equipo.",
    ],
    deliverable: "Acuerdos y líneas de intervención registrados por caso después de cada sesión.",
    duration: "Ciclos de sesiones periódicas, con la frecuencia que acuerde el equipo",
    lead: "Rocío Solar",
};

export const BIENESTAR_CONVIVENCIA: Engagement = {
    id: "bienestar-convivencia",
    area: "Bienestar escolar",
    areaHref: "/servicios/bienestar-escolar",
    name: "Bienestar y convivencia escolar",
    forWhom: "Colegios y comunidades educativas que necesitan ordenar su gestión preventiva y su respuesta a casos sensibles.",
    includes: [
        "Diagnóstico de brechas, capacidades internas, exposición normativa y casos sensibles.",
        "Rutas de actuación y criterios de escalamiento para convivencia, salud mental y riesgo suicida.",
        "Entrenamiento del equipo para reconocer señales y coordinar decisiones bajo presión.",
        "Seguimiento con revisión de casos y registro de lo actuado.",
    ],
    deliverable: "Rutas y criterios de actuación, equipo entrenado e informe de seguimiento.",
    duration: "1 a 4 meses; puede acompañar el año escolar completo",
    lead: "Hugo Felipe Hormazábal",
};

export const INSTITUTIONAL_ENGAGEMENTS: Engagement[] = [
    COMPLIANCE_DIAGNOSTICO,
    COMPLIANCE_IMPLEMENTACION,
    BIENESTAR_CONVIVENCIA,
    FORMACION_PROGRAMA,
    FORMACION_SEMINARIO,
    CONSULTORIA_MODELO,
    SUPERVISION_CLINICA,
];
