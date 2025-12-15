'use client'

import { useEffect } from 'react'

interface ViewTrackerProps {
  projectSlug: string
}

export default function ViewTracker({ projectSlug }: ViewTrackerProps) {
  useEffect(() => {
    // Incrementar vista solo una vez por sesión
    const viewedKey = `viewed_${projectSlug}`
    const hasViewed = sessionStorage.getItem(viewedKey)
    
    if (!hasViewed) {
      fetch(`/api/projects/${projectSlug}/view`, {
        method: 'POST'
      }).then(() => {
        sessionStorage.setItem(viewedKey, 'true')
      }).catch(err => console.error('Error tracking view:', err))
    }
  }, [projectSlug])

  return null
}
