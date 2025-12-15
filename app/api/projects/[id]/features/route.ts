import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Endpoint deshabilitado - usar /api/features/verify en su lugar
  return NextResponse.json(
    { error: 'Debes verificar tu email para solicitar características. Usa el formulario correspondiente.' },
    { status: 403 }
  )
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const features = await prisma.feature.findMany({
      where: { projectId: id },
      include: {
        votes: true
      },
      orderBy: [
        {
          votes: {
            _count: 'desc'
          }
        },
        {
          createdAt: 'desc'
        }
      ]
    })
    
    return NextResponse.json(features)
  } catch (error) {
    console.error('Error fetching features:', error)
    return NextResponse.json(
      { error: 'Error al obtener características' },
      { status: 500 }
    )
  }
}
