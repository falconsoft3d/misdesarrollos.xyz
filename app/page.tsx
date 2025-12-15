import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import ProjectList from '@/components/ProjectList'
import SiteStatsTracker from '@/components/SiteStatsTracker'

export const revalidate = 0

export default async function Home() {
  const projects = await prisma.project.findMany({
    include: {
      comments: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <ProjectList initialProjects={projects} />

      <footer className="bg-white border-t mt-16 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600">
              © {new Date().getFullYear()} Mis Desarrollos. Todos los derechos reservados.
            </p>
            <SiteStatsTracker />
          </div>
        </div>
      </footer>
    </div>
  )
}

