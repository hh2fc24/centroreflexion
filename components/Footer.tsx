import Link from "next/link";
import { Instagram, Linkedin, Twitter, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-gray-900 border-t border-gray-800 pt-16 pb-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
                    {/* Brand Section */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">
                            Centro de Reflexiones <span className="text-blue-500">Críticas</span>
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Un espacio multidisciplinario para el pensamiento crítico, la cultura y las ciencias sociales.
                            Conectando la academia con la realidad.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="https://www.instagram.com/centrodereflexionescriticas/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-pink-500 transition-colors"
                            >
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-blue-500 transition-colors"
                            >
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Explorar</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li>
                                <Link href="/columnas" className="hover:text-blue-400 transition-colors">Columnas de Opinión</Link>
                            </li>
                            <li>
                                <Link href="/critica" className="hover:text-purple-400 transition-colors">Crítica Literaria</Link>
                            </li>
                            <li>
                                <Link href="/servicios" className="hover:text-white transition-colors">Servicios Premium</Link>
                            </li>
                            <li>
                                <Link href="/conocenos" className="hover:text-white transition-colors">Quiénes Somos</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal / Pages */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Comunidad</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li>
                                <Link href="/envia-tu-texto" className="hover:text-white transition-colors">Envía tu Texto</Link>
                            </li>
                            <li>
                                <Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition-colors">Política de Privacidad</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contacto</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-start">
                                <Mail className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" />
                                <span>contacto@centrodereflexionescriticas.com</span>
                            </li>
                            <li className="flex items-start">
                                <MapPin className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" />
                                <span>Santiago, Chile</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8 flex flex-col items-center justify-center">
                    <p className="text-xs text-gray-500 text-center">
                        &copy; {new Date().getFullYear()} Centro de Reflexiones Críticas. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
