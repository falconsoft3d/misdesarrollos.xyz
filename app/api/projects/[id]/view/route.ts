import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const project = await prisma.project.update({
      where: { slug: id },
      data: {
        views: {
          increment: 1
        }
      }
    })
    
    return NextResponse.json({ views: project.views })
  } catch (error) {
    console.error('Error incrementing views:', error)
    return NextResponse.json(
      { error: 'Error al incrementar visitas' },
      { status: 500 }
    )
  }
}
