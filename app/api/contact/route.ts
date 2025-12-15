import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    // Validación básica
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Enviar emails (al admin y confirmación al remitente)
    await sendContactEmail({
      name,
      email,
      message
    })

    return NextResponse.json({ 
      success: true,
      message: 'Mensaje enviado exitosamente' 
    })
  } catch (error) {
    console.error('Error sending contact email:', error)
    return NextResponse.json(
      { error: 'Error al enviar el mensaje' },
      { status: 500 }
    )
  }
}
