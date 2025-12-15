import { prisma } from '@/lib/prisma'

async function main() {
  // Limpiar datos existentes
  await prisma.comment.deleteMany()
  await prisma.project.deleteMany()

  // Crear proyectos de ejemplo
  const project1 = await prisma.project.create({
    data: {
      title: 'Sistema de Gestión de Inventario',
      slug: 'sistema-de-gestion-de-inventario',
      description: 'Aplicación web completa para gestionar inventarios, con control de stock, alertas de reposición, reportes y análisis en tiempo real. Desarrollado con tecnologías modernas y escalables.',
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop',
      projectUrl: 'https://github.com/usuario/inventario-app',
      tags: JSON.stringify(['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'])
    }
  })

  const project2 = await prisma.project.create({
    data: {
      title: 'E-commerce Moderno',
      slug: 'e-commerce-moderno',
      description: 'Plataforma de comercio electrónico full-stack con carrito de compras, pasarela de pagos integrada, panel de administración y análisis de ventas. Diseño responsive y optimizado para SEO.',
      imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop',
      projectUrl: 'https://github.com/usuario/ecommerce-app',
      tags: JSON.stringify(['React', 'Node.js', 'MongoDB', 'Stripe'])
    }
  })

  const project3 = await prisma.project.create({
    data: {
      title: 'Dashboard de Análisis',
      slug: 'dashboard-de-analisis',
      description: 'Dashboard interactivo para visualización de datos empresariales con gráficos dinámicos, filtros avanzados y exportación de reportes. Perfecto para tomar decisiones basadas en datos.',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      projectUrl: 'https://github.com/usuario/dashboard-analytics',
      tags: JSON.stringify(['Vue.js', 'Chart.js', 'Python', 'FastAPI'])
    }
  })

  // Agregar algunos comentarios de ejemplo
  await prisma.comment.createMany({
    data: [
      {
        name: 'Ana García',
        email: 'ana@example.com',
        message: '¡Excelente proyecto! Me encanta la interfaz y la facilidad de uso. ¿Planeas agregar soporte para múltiples idiomas?',
        projectId: project1.id
      },
      {
        name: 'Carlos Rodríguez',
        email: 'carlos@example.com',
        message: 'Muy útil para mi negocio. ¿Podrías agregar la funcionalidad de códigos de barras?',
        projectId: project1.id
      },
      {
        name: 'María López',
        email: 'maria@example.com',
        message: 'Impresionante trabajo. La integración con Stripe funciona perfectamente.',
        projectId: project2.id
      }
    ]
  })

  console.log('✅ Base de datos inicializada con datos de ejemplo')
}

main()
  .catch((e) => {
    console.error('Error al inicializar la base de datos:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
