import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        comments: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })
    
    if (!project) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Error al obtener proyecto' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, description, imageUrl, projectUrl, videoUrl, gallery, tags } = body
    
    const { slugify } = await import('@/lib/slugify')
    const slug = slugify(title)
    
    const project = await prisma.project.update({
      where: { id },
      data: {
        slug,
        title,
        description,
        imageUrl,
        projectUrl,
        videoUrl: videoUrl || null,
        gallery: gallery && gallery.length > 0 ? JSON.stringify(gallery) : null,
        tags: JSON.stringify(tags || [])
      }
    })
    
    return NextResponse.json(project)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Error al actualizar proyecto' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.project.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Error al eliminar proyecto' },
      { status: 500 }
    )
  }
}
