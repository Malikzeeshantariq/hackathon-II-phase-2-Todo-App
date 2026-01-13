/**
 * T025: Dashboard page.
 *
 * Spec Reference: US-1 (Create), US-2 (View)
 * Main task management interface.
 */

"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "@/lib/auth"
import { taskApi } from "@/lib/api-client"
import { Task } from "@/lib/types"
import TaskList from "@/components/TaskList"
import TaskForm from "@/components/TaskForm"

/**
 * Dashboard page for task management.
 *
 * Features:
 * - Display user's task list
 * - Create new tasks
 * - Update task title/description (T031)
 * - Toggle task completion (T031)
 * - Delete tasks (T034)
 */
export default function DashboardPage() {
  const { data: session } = useSession()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const userId = session?.user?.id

  // Fetch tasks on mount
  const fetchTasks = useCallback(async () => {
    if (!userId) return

    setIsLoading(true)
    setError(null)

    try {
      const fetchedTasks = await taskApi.listTasks(userId)
      setTasks(fetchedTasks)
    } catch (err) {
      console.error("Failed to fetch tasks:", err)
      setError("Failed to load tasks. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // Create task handler
  const handleCreateTask = async (title: string, description: string | null) => {
    if (!userId) return

    setIsCreating(true)
    setCreateError(null)

    try {
      const newTask = await taskApi.createTask(userId, { title, description })
      setTasks((prev) => [newTask, ...prev])
    } catch (err: unknown) {
      console.error("Failed to create task:", err)
      const error = err as { response?: { data?: { detail?: string } } }
      setCreateError(error.response?.data?.detail || "Failed to create task")
      throw err
    } finally {
      setIsCreating(false)
    }
  }

  // T031: Toggle completion handler
  const handleToggleComplete = async (taskId: string) => {
    if (!userId) return

    try {
      const updatedTask = await taskApi.toggleComplete(userId, taskId)
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updatedTask : t))
      )
    } catch (err) {
      console.error("Failed to toggle task:", err)
      setError("Failed to update task. Please try again.")
    }
  }

  // T031: Update task handler
  const handleUpdateTask = async (
    taskId: string,
    title: string,
    description: string | null
  ) => {
    if (!userId) return

    try {
      const updatedTask = await taskApi.updateTask(userId, taskId, {
        title,
        description,
      })
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updatedTask : t))
      )
    } catch (err) {
      console.error("Failed to update task:", err)
      setError("Failed to update task. Please try again.")
      throw err
    }
  }

  // T034: Delete task handler
  const handleDeleteTask = async (taskId: string) => {
    if (!userId) return

    try {
      await taskApi.deleteTask(userId, taskId)
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
    } catch (err) {
      console.error("Failed to delete task:", err)
      setError("Failed to delete task. Please try again.")
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
        <p className="text-gray-600 mt-1">
          Manage your tasks and stay organized
        </p>
      </div>

      {/* Create task form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Create New Task
        </h2>
        <TaskForm
          onSubmit={handleCreateTask}
          isSubmitting={isCreating}
          error={createError}
        />
      </div>

      {/* Task list */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Your Tasks {!isLoading && `(${tasks.length})`}
        </h2>
        <TaskList
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDeleteTask}
          onUpdate={handleUpdateTask}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  )
}
