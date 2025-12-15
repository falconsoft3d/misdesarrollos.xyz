'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ProjectFormProps {
  project?: {
    id: string
    title: string
    description: string
    imageUrl: string
    projectUrl: string
    videoUrl?: string | null
    gallery?: string | null
    tags: string
  }
  isEditing?: boolean
}

function convertToEmbedUrl(url: string): string {
  if (!url) return ''
  
  // YouTube: convertir watch?v= a embed/
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
  const youtubeMatch = url.match(youtubeRegex)
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`
  }
  
  // Vimeo: convertir a player.vimeo.com
  const vimeoRegex = /vimeo\.com\/(\d+)/
  const vimeoMatch = url.match(vimeoRegex)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }
  
  return url
}

export default function ProjectForm({ project, isEditing = false }: ProjectFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    imageUrl: project?.imageUrl || '',
    projectUrl: project?.projectUrl || '',
    videoUrl: project?.videoUrl || '',
    gallery: project?.gallery ? JSON.parse(project.gallery).join(', ') : '',
    tags: project?.tags ? JSON.parse(project.tags).join(', ') : ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const tags = formData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
      const gallery = formData.gallery.split(',').map((url: string) => url.trim()).filter((url: string) => url)
      
      const url = isEditing ? `/api/projects/${project?.id}` : '/api/projects'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          imageUrl: formData.imageUrl,
          projectUrl: formData.projectUrl,
          videoUrl: formData.videoUrl || null,
          gallery,
          tags
        }),
      })

      if (response.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        alert('Error al guardar el proyecto')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al guardar el proyecto')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Título *
        </label>
        <input
          type="text"
          id="title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900"
          placeholder="Nombre del proyecto"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Descripción *
        </label>
        <textarea
          id="description"
          required
          rows={5}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none text-gray-900"
          placeholder="Descripción detallada del proyecto"
        />
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
          URL de la Imagen (opcional)
        </label>
        <input
          type="url"
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900"
          placeholder="https://example.com/image.jpg"
        />
        {formData.imageUrl && (
          <div className="mt-2">
            <img 
              src={formData.imageUrl} 
              alt="Preview" 
              className="w-full h-48 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="projectUrl" className="block text-sm font-medium text-gray-700 mb-2">
          URL del Proyecto *
        </label>
        <input
          type="url"
          id="projectUrl"
          required
          value={formData.projectUrl}
          onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900"
          placeholder="https://github.com/usuario/proyecto"
        />
      </div>

      <div>
        <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-2">
          URL del Video (opcional)
        </label>
        <input
          type="url"
          id="videoUrl"
          value={formData.videoUrl}
          onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
          onBlur={(e) => {
            const converted = convertToEmbedUrl(e.target.value)
            if (converted !== e.target.value) {
              setFormData({ ...formData, videoUrl: converted })
            }
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900"
          placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
        />
        <p className="mt-1 text-sm text-gray-500">
          Pega cualquier URL de YouTube o Vimeo, se convertirá automáticamente
        </p>
      </div>

      <div>
        <label htmlFor="gallery" className="block text-sm font-medium text-gray-700 mb-2">
          Galería de Imágenes (opcional)
        </label>
        <textarea
          id="gallery"
          rows={3}
          value={formData.gallery}
          onChange={(e) => setFormData({ ...formData, gallery: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none text-gray-900"
          placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
        />
        <p className="mt-1 text-sm text-gray-500">
          Separa las URLs con comas para crear una galería de capturas de pantalla
        </p>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
          Tags (separados por comas)
        </label>
        <input
          type="text"
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900"
          placeholder="React, TypeScript, Next.js"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar Proyecto' : 'Crear Proyecto'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
