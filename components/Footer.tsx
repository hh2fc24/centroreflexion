import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} Centro de Reflexiones Críticas. Todos los derechos reservados.
                    </p>
                    <div className="flex gap-6">
                        <Link href="/contacto" className="text-sm text-gray-500 hover:text-gray-900">
                            Contacto
                        </Link>
                        <Link href="/envia-tu-texto" className="text-sm text-gray-500 hover:text-gray-900">
                            Enviar Texto
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
