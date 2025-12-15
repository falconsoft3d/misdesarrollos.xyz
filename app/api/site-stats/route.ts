import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Obtener estadísticas del sitio
export async function GET() {
  try {
    let stats = await prisma.siteStats.findFirst()
    
    if (!stats) {
      // Crear estadísticas iniciales si no existen
      stats = await prisma.siteStats.create({
        data: {
          visits: 0
        }
      })
    }
    
    return NextResponse.json({ visits: stats.visits })
  } catch (error) {
    console.error('Error fetching site stats:', error)
    return NextResponse.json({ visits: 0 })
  }
}

// Incrementar contador de visitas
export async function POST() {
  try {
    let stats = await prisma.siteStats.findFirst()
    
    if (!stats) {
      stats = await prisma.siteStats.create({
        data: {
          visits: 1
        }
      })
    } else {
      stats = await prisma.siteStats.update({
        where: { id: stats.id },
        data: {
          visits: {
            increment: 1
          }
        }
      })
    }
    
    return NextResponse.json({ visits: stats.visits })
  } catch (error) {
    console.error('Error updating site stats:', error)
    return NextResponse.json(
      { error: 'Error al actualizar estadísticas' },
      { status: 500 }
    )
  }
}
