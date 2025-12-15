import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const tasks = await prisma.task.findMany({
      where: { projectId: id },
      orderBy: { order: 'asc' }
    })
    
    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Error al obtener tareas' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, description, status, order } = body
    
    if (!title) {
      return NextResponse.json(
        { error: 'El título es requerido' },
        { status: 400 }
      )
    }
    
    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        status: status || 'pending',
        order: order || 0,
        projectId: id
      }
    })
    
    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Error al crear tarea' },
      { status: 500 }
    )
  }
}
