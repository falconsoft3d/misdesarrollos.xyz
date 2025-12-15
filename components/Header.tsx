import Link from 'next/link'
import LogoutButton from './LogoutButton'
import { cookies } from 'next/headers'

export default async function Header() {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get('admin-auth')?.value === 'authenticated'

  return (
    <header className="bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Mis Desarrollos</h1>
              <p className="text-sm text-yellow-100">Proyectos Open Source</p>
            </div>
          </Link>
          <nav className="flex gap-4">
            <Link 
              href="/" 
              className="px-4 py-2 bg-white text-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors font-medium"
            >
              Proyectos
            </Link>
            {isAuthenticated ? (
              <>
                <Link 
                  href="/admin" 
                  className="px-4 py-2 bg-white/20 text-white border border-white/30 rounded-lg hover:bg-white/30 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <LogoutButton />
              </>
            ) : (
              <Link 
                href="/admin/login" 
                className="px-4 py-2 bg-white/20 text-white border border-white/30 rounded-lg hover:bg-white/30 transition-colors font-medium"
              >
                Admin
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
