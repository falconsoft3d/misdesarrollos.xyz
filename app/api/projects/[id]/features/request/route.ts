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
    const { title, description, userName, userEmail } = body
    
    if (!title || !description || !userName || !userEmail) {
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
        email: userEmail,
        code,
        type: 'feature',
        metadata: JSON.stringify({ projectId: id, title, description, userName, userEmail }),
        expiresAt
      }
    })

    // Enviar email
    await sendVerificationEmail(userEmail, code, 'comment') // Usamos el mismo template
    
    return NextResponse.json({ 
      success: true, 
      message: 'Código de verificación enviado a tu email' 
    })
  } catch (error) {
    console.error('Error requesting feature:', error)
    return NextResponse.json(
      { error: 'Error al enviar código de verificación' },
      { status: 500 }
    )
  }
}
