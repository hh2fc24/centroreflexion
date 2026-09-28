/** Directores del CRC que aparecen como responsables de cada área. */

export type Person = {
    name: string;
    role: string;
    image: string;
    imageAlt: string;
    credentials: string;
    linkedin?: string;
};

export const HUGO: Person = {
    name: "Hugo Felipe Hormazábal",
    role: "Socio · Director Comercial y de Desarrollo Institucional",
    image: "/images/hugo-hormazabal-crc-2026-large.png",
    imageAlt: "Hugo Felipe Hormazábal",
    credentials: "Ingeniero Comercial · Diplomado en Marketing & Analytics, UAI · Fundador de Altius Ignite",
    linkedin: "https://www.linkedin.com/in/hugo-felipe-hormazabal-561005332/",
};

export const ROCIO: Person = {
    name: "Rocío Solar",
    role: "Cofundadora · Directora Clínica",
    image: "/images/rocio-solar-crc-2026.png",
    imageAlt: "Rocío Solar",
    credentials: "Terapeuta ocupacional · Magíster (c) en Ocupación y Terapia Ocupacional, Universidad de Chile",
    linkedin: "https://www.linkedin.com/in/roc%C3%ADo-solar-guerra-168693138/",
};

export const JUAN_CARLOS: Person = {
    name: "Juan Carlos Rauld",
    role: "Director del CRC",
    image: "/images/juan_carlos_real_white.png",
    imageAlt: "Juan Carlos Rauld",
    credentials: "Trabajador social · Doctorando en Trabajo Social, Universitat Rovira i Virgili · Autor de tres libros con Editorial Hammurabi",
    linkedin: "https://www.linkedin.com/in/juan-carlos-rauld-farias-a64710a4/",
};
