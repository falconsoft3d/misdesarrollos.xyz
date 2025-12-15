import Header from '@/components/Header'
import ProjectForm from '@/components/ProjectForm'
import Link from 'next/link'

export default function NewProjectPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link 
              href="/admin"
              className="text-yellow-600 hover:text-yellow-700 inline-flex items-center gap-1 mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver al Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Crear Nuevo Proyecto
            </h1>
            <p className="text-gray-600">
              Completa los datos para agregar un nuevo proyecto
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <ProjectForm />
          </div>
        </div>
      </main>
    </div>
  )
}
