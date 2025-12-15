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
        type: 'feature',
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

    // Crear la característica
    const metadata = JSON.parse(verification.metadata)
    const feature = await prisma.feature.create({
      data: {
        title: metadata.title,
        description: metadata.description,
        userName: metadata.userName,
        userEmail: metadata.userEmail,
        projectId: metadata.projectId
      },
      include: {
        votes: true
      }
    })

    return NextResponse.json(feature, { status: 201 })
  } catch (error) {
    console.error('Error verifying feature:', error)
    return NextResponse.json(
      { error: 'Error al verificar código' },
      { status: 500 }
    )
  }
}
