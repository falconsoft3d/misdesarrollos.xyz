import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
})

export async function sendVerificationEmail(to: string, code: string, type: 'comment' | 'vote') {
  const subject = type === 'comment' 
    ? 'Verifica tu comentario - Mis Desarrollos' 
    : 'Verifica tu voto - Mis Desarrollos'
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #FFE600; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
          .code { 
            background: #fff; 
            border: 2px solid #FFE600; 
            padding: 20px; 
            text-align: center; 
            font-size: 32px; 
            font-weight: bold; 
            letter-spacing: 5px;
            margin: 20px 0;
          }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; color: #333;">Mis Desarrollos</h1>
          </div>
          <div class="content">
            <h2>Código de Verificación</h2>
            <p>Has solicitado ${type === 'comment' ? 'dejar un comentario' : 'votar por una característica'}.</p>
            <p>Para completar la acción, usa el siguiente código:</p>
            <div class="code">${code}</div>
            <p><strong>Este código expira en 10 minutos.</strong></p>
            <p>Si no solicitaste esto, puedes ignorar este correo.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Mis Desarrollos. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html
  })

  return info
}

export function generateVerificationCode(): string {
  // Genera un código de exactamente 6 dígitos
  const code = Math.floor(100000 + Math.random() * 900000)
  return code.toString().substring(0, 6)
}

export async function sendContactEmail(data: {
  name: string
  email: string
  message: string
}) {
  const adminEmail = process.env.CONTACT_EMAIL || process.env.SMTP_FROM

  // Email para el administrador
  const adminHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #FFE600; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
          .field { margin-bottom: 20px; }
          .label { font-weight: bold; color: #666; }
          .value { margin-top: 5px; padding: 10px; background: #fff; border-left: 3px solid #FFE600; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; color: #333;">Nuevo Mensaje de Contacto</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">De:</div>
              <div class="value">${data.name}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${data.email}</div>
            </div>
            <div class="field">
              <div class="label">Mensaje:</div>
              <div class="value">${data.message}</div>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Mis Desarrollos</p>
          </div>
        </div>
      </body>
    </html>
  `

  // Email de confirmación para el remitente
  const confirmationHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #FFE600; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; color: #333;">¡Gracias por tu mensaje!</h1>
          </div>
          <div class="content">
            <p>Hola ${data.name},</p>
            <p>He recibido tu mensaje y te responderé lo antes posible.</p>
            <p><strong>Tu mensaje:</strong></p>
            <p style="padding: 15px; background: #fff; border-left: 3px solid #FFE600;">${data.message}</p>
            <p>Saludos,<br>Mis Desarrollos</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Mis Desarrollos</p>
          </div>
        </div>
      </body>
    </html>
  `

  // Enviar email al administrador
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: adminEmail,
    subject: `Nuevo mensaje de contacto de ${data.name}`,
    html: adminHtml,
    replyTo: data.email
  })

  // Enviar confirmación al remitente
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: data.email,
    subject: 'Confirmación: Tu mensaje ha sido recibido - Mis Desarrollos',
    html: confirmationHtml
  })
}

