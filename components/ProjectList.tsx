'use client'

import { useState, useEffect } from 'react'
import ProjectCard from '@/components/ProjectCard'
import ContactForm from '@/components/ContactForm'
import FilterBar from '@/components/FilterBar'

interface Project {
  id: string
  name: string
  description: string
  projectUrl: string
  createdAt: Date
  views: number
  comments: any[]
}

interface ProjectListProps {
  initialProjects: Project[]
}

export default function ProjectList({ initialProjects }: ProjectListProps) {
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(initialProjects)

  // Sincronizar cuando initialProjects cambie
  useEffect(() => {
    setFilteredProjects(initialProjects)
  }, [initialProjects])

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredProjects(initialProjects)
      return
    }

    const lowercaseQuery = query.toLowerCase()
    const filtered = initialProjects.filter(project => 
      project.name.toLowerCase().includes(lowercaseQuery) ||
      project.description.toLowerCase().includes(lowercaseQuery)
    )
    
    setFilteredProjects(filtered)
  }

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Hero Section con Formulario de Contacto */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Texto Hero */}
          <div>
            {/* Perfil del desarrollador */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden border-4 border-yellow-500 shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&fit=crop"
                  alt="Desarrollador"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Marlon Falcon</h3>
                <p className="text-gray-600">Desarrollador Full Stack</p>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Construyendo el
              <span className="text-yellow-500"> Futuro </span>
              con Código Abierto
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Explora mis proyectos open source, deja tus comentarios y sugiere nuevas características. 
              Juntos creamos mejores soluciones.
            </p>
            <div className="flex gap-4 text-gray-700">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-semibold">Código Abierto</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Colaborativo</span>
              </div>
            </div>
          </div>

          {/* Formulario de Contacto */}
          <div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Sección de Proyectos */}
      <section>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Mis Proyectos Open Source
          </h2>
          <p className="text-gray-600">
            Explora mis aplicaciones de código abierto y deja tus comentarios
          </p>
        </div>

        {/* Filtros de Búsqueda */}
        <FilterBar onSearch={handleSearch} />

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No se encontraron proyectos
              </h3>
              <p className="text-gray-500">
                Intenta con otros términos de búsqueda
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
