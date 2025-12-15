import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        comments: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Error al obtener proyectos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, imageUrl, projectUrl, githubUrl, videoUrl, gallery, tags } = body
    
    const { slugify } = await import('@/lib/slugify')
    const slug = slugify(title)
    
    const project = await prisma.project.create({
      data: {
        slug,
        title,
        description,
        imageUrl,
        projectUrl,
        githubUrl: githubUrl || null,
        videoUrl: videoUrl || null,
        gallery: gallery && gallery.length > 0 ? JSON.stringify(gallery) : null,
        tags: JSON.stringify(tags || [])
      }
    })
    
    // Crear tarea inicial por defecto
    await prisma.task.create({
      data: {
        title: 'Documentación en la web',
        description: 'Publicación del proyecto en la plataforma',
        status: 'completed',
        order: 0,
        completedAt: new Date(),
        projectId: project.id
      }
    })
    
    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Error al crear proyecto' },
      { status: 500 }
    )
  }
}
