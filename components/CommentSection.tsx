'use client'

import { useState } from 'react'
import type { Comment } from '@/types'

interface CommentSectionProps {
  projectId: string
  initialComments: Comment[]
}

export default function CommentSection({ projectId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/projects/${projectId}/comments/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowVerification(true)
        alert('¡Código de verificación enviado! Revisa tu email.')
      } else {
        const data = await response.json()
        alert(data.error || 'Error al enviar solicitud')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al enviar solicitud')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/comments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          code: verificationCode
        }),
      })

      if (response.ok) {
        const newComment = await response.json()
        setComments([newComment, ...comments])
        setFormData({ name: '', email: '', message: '' })
        setVerificationCode('')
        setShowVerification(false)
        alert('¡Comentario publicado exitosamente!')
      } else {
        const data = await response.json()
        alert(data.error || 'Código inválido')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al verificar código')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Comentarios ({comments.length})
      </h2>

      {/* Formulario de comentarios */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Deja tu comentario
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900"
                placeholder="tu@email.com"
              />
            </div>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Mensaje *
            </label>
            <textarea
              id="message"
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none text-gray-900"
              placeholder="Escribe tu comentario..."
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar comentario'}
          </button>
        </form>
        
        {/* Modal de verificación */}
        {showVerification && (
          <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Verifica tu email</h4>
            <p className="text-sm text-gray-600 mb-4">
              Hemos enviado un código de 6 dígitos a <strong>{formData.email}</strong>
            </p>
            <form onSubmit={handleVerify} className="flex gap-2">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Código de 6 dígitos"
                maxLength={6}
                required
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 text-center text-2xl font-bold tracking-widest"
              />
              <button
                type="submit"
                disabled={isSubmitting || verificationCode.length !== 6}
                className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-300"
              >
                Verificar
              </button>
            </form>
            <button
              onClick={() => setShowVerification(false)}
              className="mt-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Lista de comentarios */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">
              No hay comentarios todavía. ¡Sé el primero en comentar!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {comment.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-800">{comment.name}</h4>
                    <span className="text-gray-400 text-sm">•</span>
                    <span className="text-gray-500 text-sm">
                      {new Date(comment.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{comment.message}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
