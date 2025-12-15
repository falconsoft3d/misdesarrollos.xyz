import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    const adminUsername = process.env.ADMIN_USERNAME
    const adminPassword = process.env.ADMIN_PASSWORD

    if (username === adminUsername && password === adminPassword) {
      const response = NextResponse.json({ success: true })
      
      // Establecer cookie de autenticación
      response.cookies.set('admin-auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 días
      })

      return response
    }

    return NextResponse.json(
      { error: 'Credenciales incorrectas' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json(
      { error: 'Error al iniciar sesión' },
      { status: 500 }
    )
  }
}
