import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, code } = body
    
    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email y código son requeridos' },
        { status: 400 }
      )
    }

    // Buscar código válido
    const verification = await prisma.verificationCode.findFirst({
      where: {
        email,
        code,
        type: 'comment',
        verified: false,
        expiresAt: {
          gt: new Date()
        }
      }
    })

    if (!verification) {
      return NextResponse.json(
        { error: 'Código inválido o expirado' },
        { status: 400 }
      )
    }

    // Marcar como verificado
    await prisma.verificationCode.update({
      where: { id: verification.id },
      data: { verified: true }
    })

    // Crear el comentario
    const metadata = JSON.parse(verification.metadata)
    const comment = await prisma.comment.create({
      data: {
        name: metadata.name,
        email: metadata.email,
        message: metadata.message,
        projectId: metadata.projectId
      }
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Error verifying comment:', error)
    return NextResponse.json(
      { error: 'Error al verificar código' },
      { status: 500 }
    )
  }
}
