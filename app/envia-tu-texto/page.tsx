import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import Link from "next/link";

export default function SubmitText() {
    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Envía tu Texto
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-gray-600">
                        ¿Tienes una opinión crítica, un ensayo literario o un análisis social que quieres compartir? ¡Queremos leerte!
                    </p>
                </div>

                <div className="mt-16 mx-auto max-w-3xl">
                    <div className="space-y-8">
                        <section>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Lineamientos Editoriales</h3>
                            <ul className="list-disc list-inside space-y-3 text-gray-600">
                                <li><strong>Originalidad:</strong> Aceptamos textos inéditos que aporten una perspectiva fresca.</li>
                                <li><strong>Extensión:</strong> Recomendamos entre 800 y 1,500 palabras para artículos de fondo.</li>
                                <li><strong>Estilo:</strong> Buscamos rigor intelectual pero con un lenguaje accesible y claro.</li>
                                <li><strong>Formato:</strong> Envía tu archivo en Word o PDF, interlineado 1.5.</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Proceso de Selección</h3>
                            <p className="text-gray-600 mb-4">
                                Nuestro comité editorial revisa todas las propuestas. El tiempo de respuesta estimado es de 2 semanas.
                            </p>
                        </section>

                        <Card className="bg-blue-50 border-blue-100">
                            <CardHeader>
                                <CardTitle className="text-blue-900">¿Listo para enviar?</CardTitle>
                                <CardDescription className="text-blue-700">Envía tu propuesta a nuestro correo editorial.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col sm:flex-row gap-4 items-center">
                                    <Link href="/contacto" className="w-full sm:w-auto">
                                        <Button className="w-full">Enviar por Email</Button>
                                    </Link>
                                    <span className="text-sm text-gray-500">o escríbenos a: editorial@crcritica.com</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

            </div>
        </div>
    );
}
