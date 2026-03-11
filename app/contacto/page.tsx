import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Mail, MapPin } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";

export default function Contact() {
    return (
        <div className="bg-white py-16 sm:py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">

                    {/* Contact Info */}
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Ponte en contacto</h2>
                        <p className="mt-4 text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
                            ¿Tienes alguna pregunta sobre nuestros servicios, columnas o quieres colaborar? Escríbenos.
                        </p>

                        <dl className="mt-8 space-y-6 text-base leading-7 text-gray-600">
                            <div className="flex gap-x-4">
                                <dt className="flex-none">
                                    <span className="sr-only">Email</span>
                                    <Mail className="h-7 w-6 text-gray-400" aria-hidden="true" />
                                </dt>
                                <dd>
                                    <a className="break-all hover:text-gray-900 sm:break-normal" href="mailto:centrodereflexionescriticas@gmail.com">
                                        centrodereflexionescriticas@gmail.com
                                    </a>
                                </dd>
                            </div>
                            <div className="flex gap-x-4">
                                <dt className="flex-none">
                                    <span className="sr-only">Dirección</span>
                                    <MapPin className="h-7 w-6 text-gray-400" aria-hidden="true" />
                                </dt>
                                <dd>
                                    Santiago de Chile
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {/* Contact Form Placeholder */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Envíanos un mensaje</CardTitle>
                            <CardDescription>Te responderemos lo antes posible.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ContactForm />
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}
