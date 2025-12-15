'use client'

import { useEffect, useState } from 'react'

export default function SiteStatsTracker() {
  const [visits, setVisits] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const trackVisit = async () => {
      // Verificar si ya visitó en esta sesión
      const hasVisited = sessionStorage.getItem('site_visited')
      
      if (!hasVisited) {
        // Incrementar contador
        await fetch('/api/site-stats', {
          method: 'POST'
        })
        sessionStorage.setItem('site_visited', 'true')
      }
      
      // Obtener contador actual
      const response = await fetch('/api/site-stats')
      const data = await response.json()
      setVisits(data.visits)
      setLoading(false)
    }

    trackVisit()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-600">
        <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span>Cargando...</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-gray-600">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      <span>
        <strong>{visits.toLocaleString()}</strong> visitas totales
      </span>
    </div>
  )
}
