import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendVerificationEmail, generateVerificationCode } from '@/lib/email'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, email, message } = body
    
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    // Generar código de verificación
    const code = generateVerificationCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutos

    // Guardar código en la base de datos
    await prisma.verificationCode.create({
      data: {
        email,
        code,
        type: 'comment',
        metadata: JSON.stringify({ projectId: id, name, email, message }),
        expiresAt
      }
    })

    // Enviar email
    await sendVerificationEmail(email, code, 'comment')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Código de verificación enviado a tu email' 
    })
  } catch (error) {
    console.error('Error requesting comment:', error)
    return NextResponse.json(
      { error: 'Error al enviar código de verificación' },
      { status: 500 }
    )
  }
}
