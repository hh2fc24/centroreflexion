/**
 * Academia CRC – Constructor de plantillas de correo (Supabase Auth)
 * Estética del Centro: oscuro + dorado, tipografía serif, español.
 * Compatible con clientes de correo (tablas + estilos inline).
 *
 * Variables Supabase disponibles: {{ .ConfirmationURL }}, {{ .SiteURL }},
 * {{ .Email }}, {{ .Token }}, {{ .TokenHash }}.
 */

const GOLD = "#d4a843";
const GOLD_LIGHT = "#f0c355";
const BG = "#0c0c10";
const SURFACE = "#14141e";
const BORDER = "#2a2a38";
const TEXT = "#f0ece4";
const TEXT_2 = "#b9b4ab";
const TEXT_3 = "#8a8680";
const SITE = "https://centrodereflexionescriticas.com";

/** Construye un correo HTML branded. */
export function buildEmail({ eyebrow, titulo, intro, cta, urlVar = "{{ .ConfirmationURL }}", nota }) {
  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark light"></head>
<body style="margin:0;padding:0;background:${BG};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:32px 16px;">
<tr><td align="center">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:${SURFACE};border:1px solid ${BORDER};border-radius:14px;overflow:hidden;">
    <!-- Línea dorada superior -->
    <tr><td style="height:3px;background:linear-gradient(90deg,transparent,${GOLD},${GOLD_LIGHT},transparent);font-size:0;line-height:0;">&nbsp;</td></tr>
    <!-- Marca -->
    <tr><td style="padding:30px 40px 0 40px;">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td style="width:34px;height:34px;background:${GOLD};border-radius:8px;text-align:center;vertical-align:middle;font-size:18px;line-height:34px;">&#127891;</td>
        <td style="padding-left:12px;font-family:Georgia,'Times New Roman',serif;font-size:19px;font-weight:bold;color:${TEXT};">Academia <span style="color:${GOLD};">CRC</span></td>
      </tr></table>
    </td></tr>
    <!-- Cuerpo -->
    <tr><td style="padding:28px 40px 8px 40px;">
      <p style="margin:0 0 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${GOLD};">${eyebrow}</p>
      <h1 style="margin:0 0 16px 0;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.15;font-weight:bold;color:${TEXT};">${titulo}</h1>
      <p style="margin:0 0 26px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:${TEXT_2};">${intro}</p>
      <!-- Botón -->
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td style="border-radius:8px;background:linear-gradient(90deg,${GOLD},${GOLD_LIGHT});">
          <a href="${urlVar}" target="_blank" style="display:inline-block;padding:14px 34px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#0c0c10;text-decoration:none;">${cta}</a>
        </td>
      </tr></table>
      <p style="margin:24px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:${TEXT_3};">
        Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
        <a href="${urlVar}" target="_blank" style="color:${GOLD};word-break:break-all;">${urlVar}</a>
      </p>
      ${nota ? `<p style="margin:18px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:${TEXT_3};">${nota}</p>` : ""}
    </td></tr>
    <!-- Separador -->
    <tr><td style="padding:28px 40px 0 40px;"><div style="height:1px;background:${BORDER};font-size:0;line-height:0;">&nbsp;</div></td></tr>
    <!-- Pie -->
    <tr><td style="padding:20px 40px 32px 40px;">
      <p style="margin:0 0 4px 0;font-family:Georgia,serif;font-size:14px;color:${TEXT_2};">Centro de Reflexiones Críticas</p>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:${TEXT_3};">
        Recibiste este correo porque creaste una cuenta en la Academia CRC.
        Si no fuiste tú, puedes ignorarlo.<br>
        <a href="${SITE}" target="_blank" style="color:${TEXT_3};text-decoration:underline;">centrodereflexionescriticas.com</a>
      </p>
    </td></tr>
  </table>
  <p style="margin:18px 0 0 0;font-family:Georgia,serif;font-style:italic;font-size:12px;color:${TEXT_3};">Pensamiento crítico para transformar el mundo.</p>
</td></tr>
</table>
</body></html>`;
}

/** Definición de los 5 correos de Supabase Auth. */
export const TEMPLATES = {
  confirmation: {
    subject: "Confirma tu cuenta · Academia CRC",
    html: buildEmail({
      eyebrow: "Bienvenido a la Academia",
      titulo: "Confirma tu cuenta",
      intro: "Estás a un paso de comenzar. Confirma tu correo para activar tu cuenta y acceder a los cursos de la Academia CRC.",
      cta: "Confirmar mi cuenta",
    }),
  },
  recovery: {
    subject: "Restablece tu contraseña · Academia CRC",
    html: buildEmail({
      eyebrow: "Recuperación de acceso",
      titulo: "Restablece tu contraseña",
      intro: "Recibimos una solicitud para restablecer la contraseña de tu cuenta. Crea una nueva contraseña con el siguiente enlace.",
      cta: "Crear nueva contraseña",
      nota: "Si no solicitaste este cambio, ignora este correo: tu contraseña seguirá siendo la misma.",
    }),
  },
  magic_link: {
    subject: "Tu enlace de acceso · Academia CRC",
    html: buildEmail({
      eyebrow: "Acceso sin contraseña",
      titulo: "Inicia sesión en la Academia",
      intro: "Usa este enlace para entrar a tu cuenta de la Academia CRC. Es válido por tiempo limitado y de un solo uso.",
      cta: "Iniciar sesión",
    }),
  },
  invite: {
    subject: "Te invitaron a la Academia CRC",
    html: buildEmail({
      eyebrow: "Invitación",
      titulo: "Te invitaron a la Academia",
      intro: "Has sido invitado a unirte a la Academia CRC. Acepta la invitación para crear tu cuenta y comenzar.",
      cta: "Aceptar invitación",
    }),
  },
  email_change: {
    subject: "Confirma tu nuevo correo · Academia CRC",
    html: buildEmail({
      eyebrow: "Cambio de correo",
      titulo: "Confirma tu nuevo correo",
      intro: "Para completar el cambio de tu dirección de correo en la Academia CRC, confírmala con el siguiente enlace.",
      cta: "Confirmar correo",
    }),
  },
};
