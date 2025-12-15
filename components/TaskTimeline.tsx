'use client'

interface Task {
  id: string
  title: string
  description: string | null
  status: string
  order: number
  createdAt: Date
  updatedAt: Date
  completedAt: Date | null
}

interface TaskTimelineProps {
  tasks: Task[]
}

export default function TaskTimeline({ tasks }: TaskTimelineProps) {
  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'in-progress':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓'
      case 'in-progress':
        return '⟳'
      default:
        return '○'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado'
      case 'in-progress':
        return 'En progreso'
      default:
        return 'Pendiente'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Timeline del Proyecto</h2>
      
      {sortedTasks.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No hay tareas registradas aún</p>
      ) : (
        <div className="relative">
          {/* Línea vertical */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          {/* Lista de tareas */}
          <div className="space-y-6">
            {sortedTasks.map((task, index) => (
              <div key={task.id} className="relative pl-12">
                {/* Círculo indicador */}
                <div className={`absolute left-0 w-8 h-8 rounded-full ${getStatusColor(task.status)} flex items-center justify-center text-white font-bold shadow-md`}>
                  {getStatusIcon(task.status)}
                </div>
                
                {/* Contenido de la tarea */}
                <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      task.status === 'completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {getStatusText(task.status)}
                    </span>
                  </div>
                  
                  {task.description && (
                    <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                  )}
                  
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>
                      Creado: {new Date(task.createdAt).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    {task.completedAt && (
                      <span>
                        Completado: {new Date(task.completedAt).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
