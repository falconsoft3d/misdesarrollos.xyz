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
    const { userName, userEmail } = body
    
    if (!userName || !userEmail) {
      return NextResponse.json(
        { error: 'Nombre y email son requeridos' },
        { status: 400 }
      )
    }

    // Verificar que no haya votado antes
    const existingVote = await prisma.featureVote.findFirst({
      where: {
        featureId: id,
        userEmail
      }
    })

    if (existingVote) {
      return NextResponse.json(
        { error: 'Ya has votado por esta característica' },
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
        type: 'vote',
        metadata: JSON.stringify({ featureId: id, userName, userEmail }),
        expiresAt
      }
    })

    // Enviar email
    await sendVerificationEmail(userEmail, code, 'vote')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Código de verificación enviado a tu email' 
    })
  } catch (error) {
    console.error('Error requesting vote:', error)
    return NextResponse.json(
      { error: 'Error al enviar código de verificación' },
      { status: 500 }
    )
  }
}
