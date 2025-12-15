'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Task {
  id?: string
  title: string
  description: string | null
  status: string
  order: number
}

interface TaskManagerProps {
  projectId: string
  initialTasks?: Task[]
}

export default function TaskManager({ projectId, initialTasks = [] }: TaskManagerProps) {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [isAdding, setIsAdding] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'pending', order: tasks.length })

  const handleAdd = async () => {
    if (!newTask.title.trim()) return

    try {
      const response = await fetch(`/api/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      })

      if (response.ok) {
        const task = await response.json()
        setTasks([...tasks, task])
        setNewTask({ title: '', description: '', status: 'pending', order: tasks.length + 1 })
        setIsAdding(false)
        router.refresh()
      }
    } catch (error) {
      console.error('Error adding task:', error)
      alert('Error al agregar tarea')
    }
  }

  const handleDelete = async (taskId: string) => {
    if (!confirm('¿Eliminar esta tarea?')) return

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setTasks(tasks.filter(t => t.id !== taskId))
        router.refresh()
      }
    } catch (error) {
      console.error('Error deleting task:', error)
      alert('Error al eliminar tarea')
    }
  }

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...task,
          status: newStatus,
          completedAt: newStatus === 'completed' ? new Date().toISOString() : null
        })
      })

      if (response.ok) {
        const updatedTask = await response.json()
        setTasks(tasks.map(t => t.id === taskId ? updatedTask : t))
        router.refresh()
      }
    } catch (error) {
      console.error('Error updating task:', error)
      alert('Error al actualizar tarea')
    }
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Tareas del Timeline</h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
        >
          {isAdding ? 'Cancelar' : '+ Agregar Tarea'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <input
            type="text"
            placeholder="Título de la tarea *"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 text-gray-900"
          />
          <textarea
            placeholder="Descripción (opcional)"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 text-gray-900"
            rows={2}
          />
          <select
            value={newTask.status}
            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 text-gray-900"
          >
            <option value="pending">Pendiente</option>
            <option value="in-progress">En Progreso</option>
            <option value="completed">Completado</option>
          </select>
          <button
            onClick={handleAdd}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            Guardar Tarea
          </button>
        </div>
      )}

      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{task.title}</h4>
                {task.description && (
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id!, e.target.value)}
                  className="text-xs px-2 py-1 border border-gray-300 rounded text-gray-900"
                >
                  <option value="pending">Pendiente</option>
                  <option value="in-progress">En Progreso</option>
                  <option value="completed">Completado</option>
                </select>
                <button
                  onClick={() => handleDelete(task.id!)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
