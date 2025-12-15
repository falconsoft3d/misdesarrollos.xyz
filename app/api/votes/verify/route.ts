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
        type: 'vote',
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

    // Crear el voto
    const metadata = JSON.parse(verification.metadata)
    
    const vote = await prisma.featureVote.create({
      data: {
        userName: metadata.userName,
        userEmail: metadata.userEmail,
        featureId: metadata.featureId
      }
    })

    // Obtener el conteo actualizado de votos
    const voteCount = await prisma.featureVote.count({
      where: { featureId: metadata.featureId }
    })

    return NextResponse.json({ vote, voteCount }, { status: 201 })
  } catch (error) {
    console.error('Error verifying vote:', error)
    return NextResponse.json(
      { error: 'Error al verificar código' },
      { status: 500 }
    )
  }
}
