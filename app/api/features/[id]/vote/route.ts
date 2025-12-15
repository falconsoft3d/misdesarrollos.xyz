import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Endpoint deshabilitado - usar /api/votes/verify en su lugar
  return NextResponse.json(
    { error: 'Debes verificar tu email para votar. Usa el botón de votación correspondiente.' },
    { status: 403 }
  )
}

