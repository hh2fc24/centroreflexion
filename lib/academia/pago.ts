/**
 * Configuración de pago manual de la Academia CRC.
 * Mientras no haya pasarela integrada, las inscripciones de pago se
 * activan manualmente tras confirmar la transferencia.
 *
 * ✏️  EDITA estos datos con la cuenta real de transferencia.
 */
export const PAGO_CONFIG = {
  whatsapp: "56949186447", // número CRC (formato internacional sin +)
  email: "contacto@centrodereflexionescriticas.com",
  transferencia: {
    titular: "Centro de Reflexiones Críticas",
    rut: "—  (completar)",
    banco: "—  (completar)",
    tipoCuenta: "Cuenta Corriente",
    numeroCuenta: "—  (completar)",
    correoComprobante: "contacto@centrodereflexionescriticas.com",
  },
};

export function formatoCLP(n: number) {
  return "$" + n.toLocaleString("es-CL");
}

export function whatsappLink(mensaje: string) {
  return `https://wa.me/${PAGO_CONFIG.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}
