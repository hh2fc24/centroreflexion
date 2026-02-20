"use client";

import { motion } from "framer-motion";
import {
    HeartHandshake, Brain, BookOpen, ShieldAlert, Users,
    BriefcaseMedical, Sparkles, GraduationCap, ArrowRight,
    Activity, Smile, Sun
} from "lucide-react";

export function RocioPortfolio() {
    const formation = [
        "Terapeuta Ocupacional – Universidad Andrés Bello",
        "Magíster (c) en Ocupación y Terapia Ocupacional – U. de Chile",
        "Diplomado en Salud Mental y Psiquiatría Comunitaria – U. de Chile",
        "Diplomado en Género e Intervención Psicosocial – U. Central",
        "Diplomado en Riesgos y Reducción de Daños en Drogodependencias – U. Central",
    ];

    const experience = [
        "9 años de experiencia profesional en salud mental",
        "Experiencia clínica en el sector público (COSAM y Hospitales)",
        "Experiencia clínica en consulta privada (Centro Recreo)",
    ];

    const services = [
        {
            title: "Clínica Infanto-Juvenil e Integral",
            desc: "Evaluación, intervención y acompañamiento individual, de parejas, familias y cuidadores en salud mental.",
            icon: <Users className="h-6 w-6 text-pink-600" />
        },
        {
            title: "Ámbito Educativo",
            desc: "Evaluación e intervención incluyendo observación en aula y trabajo colaborativo con la comunidad.",
            icon: <BookOpen className="h-6 w-6 text-pink-600" />
        },
        {
            title: "Integración Sensorial",
            desc: "Evaluación e intervención considerando el perfil sensorial en niñeces, juventudes y personas adultas.",
            icon: <Brain className="h-6 w-6 text-pink-600" />
        },
        {
            title: "Asesoría Ocupacional",
            desc: "Desarrollo de independencia, autonomía, rutinas y hábitos, vinculados a habilidades sociales y regulación emocional.",
            icon: <Sparkles className="h-6 w-6 text-pink-600" />
        },
        {
            title: "Análisis del Entorno",
            desc: "Evaluación del entorno y análisis ambiental del hogar mediante visitas domiciliarias.",
            icon: <HeartHandshake className="h-6 w-6 text-pink-600" />
        }
    ];

    const supervisions = [
        {
            title: "Supervisión Clínica",
            items: ["Supervisión de casos en salud mental", "Orientación en evaluación e intervención", "Supervisión individual o grupal"]
        },
        {
            title: "Asesoría Técnico-Ocupacional",
            items: ["Apoyo en planificación e intervenciones", "Formación y actualización de conocimientos", "Acompañamiento en procesos terapéuticos"]
        },
        {
            title: "Charlas y Jornadas Clínicas",
            items: ["Capacitaciones al equipo y formación continua", "Charlas clínicas y espacios de reflexión sobre buenas prácticas"]
        },
        {
            title: "Apoyo Técnico y Consultorías",
            items: ["Trabajo interdisciplinario con equipos de salud y educación", "Métodos, instrumentos de evaluación y planificaciones"]
        }
    ];

    const conditions = [
        { name: "Trastornos del Neurodesarrollo", details: "TEA, TDAH, Discapacidad Intelectual, T. del Aprendizaje y Coordinación." },
        { name: "Trastornos del Estado de Ánimo", details: "Depresión mayor, Distimia, Bipolaridad (I y II), y asociados a condiciones médicas." },
        { name: "Trastornos de Ansiedad y Relacionados", details: "Ansiedad generalizada, Pánico, Fobias específicas, Ansiedad social, TOC." },
        { name: "Trastornos Psicóticos", details: "Esquizofrenia, T. esquizoafectivo, T. delirante, Primer episodio psicótico." },
        { name: "Trastornos de la Personalidad", details: "Límite (TLP), Evitativo, Dependiente, Antisocial." },
    ];

    const derivations = [
        "Alta desregulación emocional y dificultades para manejar las emociones.",
        "Dificultades en la organización y desempeño de rutinas.",
        "Problemas para adaptarse a cambios en la vida diaria.",
        "Retraimiento, apatía o dificultades para participar socialmente.",
        "Dificultades en la autonomía o habilidades sociales.",
        "Necesidad de aprender estrategias para manejar el estrés y la ansiedad.",
        "Hiperactividad, impulsividad o inatención interfiriendo en aprendizaje.",
        "Integración sensorial alterada y dificultades frente a estímulos."
    ];

    return (
        <div className="mt-16 w-full space-y-16">

            {/* Portfolio Header */}
            <div className="text-center pt-8 border-t border-gray-100">
                <h3 className="text-3xl font-serif font-bold text-gray-900 mb-4">Portafolio Clínico y Servicios</h3>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                    Un enfoque integral, respetuoso y colaborativo, considerando la singularidad de cada persona y su contexto.
                </p>
            </div>

            {/* Formación y Experiencia */}
            <div className="bg-pink-50/50 rounded-3xl p-8 lg:p-12 border border-pink-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <GraduationCap className="h-8 w-8 text-pink-600" />
                            <h4 className="text-2xl font-bold text-gray-900 font-serif">Formación</h4>
                        </div>
                        <ul className="space-y-4">
                            {formation.map((item, idx) => (
                                <li key={idx} className="flex gap-3 text-gray-700">
                                    <span className="text-pink-400 font-bold">•</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <BriefcaseMedical className="h-8 w-8 text-pink-600" />
                            <h4 className="text-2xl font-bold text-gray-900 font-serif">Experiencia</h4>
                        </div>
                        <ul className="space-y-4">
                            {experience.map((item, idx) => (
                                <li key={idx} className="flex gap-3 text-gray-700">
                                    <span className="text-pink-400 font-bold">•</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Prestaciones */}
            <div>
                <div className="flex items-center gap-3 mb-8 justify-center">
                    <Activity className="h-8 w-8 text-pink-600" />
                    <h4 className="text-2xl font-bold text-gray-900 font-serif text-center">Prestaciones en Terapia Ocupacional</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((svc, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -5 }}
                            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="h-12 w-12 bg-pink-50 rounded-xl flex items-center justify-center mb-4">
                                {svc.icon}
                            </div>
                            <h5 className="text-lg font-bold text-gray-900 mb-2">{svc.title}</h5>
                            <p className="text-gray-600 text-sm leading-relaxed">{svc.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Condiciones */}
                <div className="bg-white rounded-3xl p-8 border border-gray-200">
                    <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                        <Sun className="h-7 w-7 text-pink-600" />
                        <h4 className="text-xl font-bold text-gray-900 font-serif">Condiciones que Acompaño</h4>
                    </div>
                    <div className="space-y-6">
                        {conditions.map((cond, idx) => (
                            <div key={idx}>
                                <h6 className="font-semibold text-gray-900">{cond.name}</h6>
                                <p className="text-sm text-gray-600 mt-1">{cond.details}</p>
                            </div>
                        ))}
                    </div>
                    <p className="mt-8 text-sm italic text-center text-gray-500">
                        Con respeto y calidez, acompaño cada proceso con una mirada integral. No estás solo/a.
                    </p>
                </div>

                {/* Cuándo Derivar */}
                <div className="bg-white rounded-3xl p-8 border border-gray-200">
                    <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                        <ShieldAlert className="h-7 w-7 text-pink-600" />
                        <h4 className="text-xl font-bold text-gray-900 font-serif">¿Cuándo Derivar a Terapia Ocupacional?</h4>
                    </div>
                    <ul className="space-y-4">
                        {derivations.map((item, idx) => (
                            <li key={idx} className="flex gap-3 text-gray-700 text-sm">
                                <ArrowRight className="h-5 w-5 text-pink-400 shrink-0" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Supervisión y Asesorías */}
            <div className="bg-gray-50 rounded-3xl p-8 lg:p-12">
                <div className="text-center mb-10">
                    <h4 className="text-2xl font-bold text-gray-900 font-serif">Servicios de Supervisión y Asesorías</h4>
                    <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                        Instancias de supervisión clínica y asesoría técnico-ocupacional para colegas y equipos de salud, integrando el bienestar, la reflexión y la buena praxis.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {supervisions.map((sup, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h5 className="font-bold text-gray-900 mb-4">{sup.title}</h5>
                            <ul className="space-y-2">
                                {sup.items.map((item, i) => (
                                    <li key={i} className="flex gap-2 text-sm text-gray-600">
                                        <div className="h-1.5 w-1.5 bg-pink-400 rounded-full mt-2 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <a
                        href="mailto:to.rociosolar@gmail.com"
                        className="inline-flex items-center justify-center rounded-full bg-pink-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 transition-all"
                    >
                        Consultas y Agenda: to.rociosolar@gmail.com
                    </a>
                </div>
            </div>

        </div>
    );
}
