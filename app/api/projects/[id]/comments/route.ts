import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Endpoint deshabilitado - usar /api/comments/verify en su lugar
  return NextResponse.json(
    { error: 'Debes verificar tu email para comentar. Usa el formulario de comentarios.' },
    { status: 403 }
  )
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const comments = await prisma.comment.findMany({
      where: { projectId: id },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(comments)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Error al obtener comentarios' },
      { status: 500 }
    )
  }
}
