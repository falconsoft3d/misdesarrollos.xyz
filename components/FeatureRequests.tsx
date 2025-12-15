'use client'

import { useState } from 'react'

interface Feature {
  id: string
  title: string
  description: string
  userName: string
  createdAt: Date
  votes: { id: string }[]
}

interface FeatureRequestsProps {
  projectId: string
  initialFeatures: Feature[]
}

export default function FeatureRequests({ projectId, initialFeatures }: FeatureRequestsProps) {
  const [features, setFeatures] = useState<Feature[]>(initialFeatures)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    userName: '',
    userEmail: ''
  })
  const [votingFeatures, setVotingFeatures] = useState<Set<string>>(new Set())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/projects/${projectId}/features/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowFeatureVerification(true)
        alert('¡Código de verificación enviado! Revisa tu email.')
      } else {
        const data = await response.json()
        alert(data.error || 'Error al solicitar característica')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al solicitar característica')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyFeature = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/features/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.userEmail,
          code: featureVerificationCode
        }),
      })

      if (response.ok) {
        const newFeature = await response.json()
        setFeatures([newFeature, ...features])
        setFormData({ title: '', description: '', userName: '', userEmail: '' })
        setFeatureVerificationCode('')
        setShowFeatureVerification(false)
        alert('¡Característica solicitada exitosamente!')
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

  const handleVote = async (featureId: string, userName: string, userEmail: string) => {
    if (votingFeatures.has(featureId)) return

    setVotingFeatures(new Set(votingFeatures).add(featureId))

    try {
      const response = await fetch(`/api/features/${featureId}/vote/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, userEmail }),
      })

      if (response.ok) {
        alert('¡Código de verificación enviado! Revisa tu email.')
        setShowVoteVerification(featureId)
        setVoteData({ name: userName, email: userEmail })
        setShowVoteForm(null)
      } else {
        const data = await response.json()
        alert(data.error || 'Error al solicitar voto')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al solicitar voto')
    } finally {
      setVotingFeatures(prev => {
        const newSet = new Set(prev)
        newSet.delete(featureId)
        return newSet
      })
    }
  }
  
  const handleVerifyVote = async (featureId: string) => {
    if (!verificationCode) {
      alert('Ingresa el código de verificación')
      return
    }

    try {
      const response = await fetch('/api/votes/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: voteData.email,
          code: verificationCode
        }),
      })

      if (response.ok) {
        const { voteCount } = await response.json()
        setFeatures(features.map(f =>
          f.id === featureId
            ? { ...f, votes: Array(voteCount).fill({ id: '' }) }
            : f
        ))
        setShowVoteVerification(null)
        setVerificationCode('')
        setVoteData({ name: '', email: '' })
        alert('¡Voto registrado exitosamente!')
      } else {
        const data = await response.json()
        alert(data.error || 'Código inválido')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al verificar código')
    }
  }

  const [showVoteForm, setShowVoteForm] = useState<string | null>(null)
  const [showVoteVerification, setShowVoteVerification] = useState<string | null>(null)
  const [showFeatureVerification, setShowFeatureVerification] = useState(false)
  const [voteData, setVoteData] = useState({ name: '', email: '' })
  const [verificationCode, setVerificationCode] = useState('')
  const [featureVerificationCode, setFeatureVerificationCode] = useState('')

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Solicitudes de Características
      </h2>

      {/* Formulario para solicitar característica */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Solicita una nueva característica
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                Tu nombre *
              </label>
              <input
                type="text"
                id="userName"
                required
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Tu email *
              </label>
              <input
                type="email"
                id="userEmail"
                required
                value={formData.userEmail}
                onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900"
                placeholder="tu@email.com"
              />
            </div>
          </div>
          <div>
            <label htmlFor="featureTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Título de la característica *
            </label>
            <input
              type="text"
              id="featureTitle"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900"
              placeholder="Ej: Modo oscuro"
            />
          </div>
          <div>
            <label htmlFor="featureDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción *
            </label>
            <textarea
              id="featureDescription"
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none text-gray-900"
              placeholder="Describe la característica que te gustaría ver..."
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Enviando...' : 'Solicitar Característica'}
          </button>
        </form>
        
        {/* Modal de verificación para característica */}
        {showFeatureVerification && (
          <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Verifica tu email</h4>
            <p className="text-sm text-gray-600 mb-4">
              Hemos enviado un código de 6 dígitos a <strong>{formData.userEmail}</strong>
            </p>
            <form onSubmit={handleVerifyFeature} className="flex gap-2">
              <input
                type="text"
                value={featureVerificationCode}
                onChange={(e) => setFeatureVerificationCode(e.target.value)}
                placeholder="Código de 6 dígitos"
                maxLength={6}
                required
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 text-center text-2xl font-bold tracking-widest"
              />
              <button
                type="submit"
                disabled={isSubmitting || featureVerificationCode.length !== 6}
                className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-300"
              >
                Verificar
              </button>
            </form>
            <button
              onClick={() => setShowFeatureVerification(false)}
              className="mt-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Lista de características solicitadas */}
      <div className="space-y-4">
        {features.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">
              No hay solicitudes todavía. ¡Sé el primero en solicitar una característica!
            </p>
          </div>
        ) : (
          features.map((feature) => (
            <div key={feature.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start gap-4">
                {/* Botón de votos */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => setShowVoteForm(showVoteForm === feature.id ? null : feature.id)}
                    disabled={votingFeatures.has(feature.id)}
                    className="flex flex-col items-center justify-center w-16 h-16 bg-gray-50 hover:bg-yellow-50 border-2 border-gray-200 hover:border-yellow-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Votar"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    <span className="text-lg font-bold text-gray-800">{feature.votes.length}</span>
                  </button>
                  <span className="text-xs text-gray-500">votos</span>
                </div>

                {/* Contenido de la característica */}
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h4>
                  <p className="text-gray-700 mb-3">{feature.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Por {feature.userName}</span>
                    <span>•</span>
                    <span>
                      {new Date(feature.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* Formulario de votación */}
                  {showVoteForm === feature.id && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h5 className="font-semibold text-gray-800 mb-3">Vota por esta característica</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Tu nombre"
                          value={voteData.name}
                          onChange={(e) => setVoteData({ ...voteData, name: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900"
                        />
                        <input
                          type="email"
                          placeholder="tu@email.com"
                          value={voteData.email}
                          onChange={(e) => setVoteData({ ...voteData, email: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900"
                        />
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => {
                            if (voteData.name && voteData.email) {
                              handleVote(feature.id, voteData.name, voteData.email)
                              setVoteData({ name: '', email: '' })
                              setShowVoteForm(null)
                            } else {
                              alert('Por favor completa todos los campos')
                            }
                          }}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                        >
                          Votar
                        </button>
                        <button
                          onClick={() => setShowVoteForm(null)}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Modal de verificación de voto */}
                  {showVoteVerification === feature.id && (
                    <div className="mt-4 p-4 bg-green-50 border-2 border-green-400 rounded-lg">
                      <h5 className="font-semibold text-gray-800 mb-2">Verifica tu voto</h5>
                      <p className="text-sm text-gray-600 mb-3">
                        Hemos enviado un código de 6 dígitos a <strong>{voteData.email}</strong>
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          placeholder="Código de 6 dígitos"
                          maxLength={6}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 text-center text-2xl font-bold tracking-widest"
                        />
                        <button
                          onClick={() => handleVerifyVote(feature.id)}
                          disabled={verificationCode.length !== 6}
                          className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-300"
                        >
                          Verificar
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          setShowVoteVerification(null)
                          setVerificationCode('')
                        }}
                        className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
