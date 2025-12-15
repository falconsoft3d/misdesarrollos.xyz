import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true })
  
  // Eliminar cookie de autenticación
  response.cookies.delete('admin-auth')

  return response
}
