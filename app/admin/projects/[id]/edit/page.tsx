import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import ProjectForm from '@/components/ProjectForm'
import TaskManager from '@/components/TaskManager'
import Link from 'next/link'

export default async function EditProjectPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      tasks: {
        orderBy: { order: 'asc' }
      }
    }
  })

  if (!project) {
    notFound()
  }

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
              Editar Proyecto
            </h1>
            <p className="text-gray-600">
              Actualiza la información del proyecto
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <ProjectForm project={project} isEditing />
            
            {/* Gestión de tareas */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <TaskManager projectId={project.id} initialTasks={project.tasks} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
