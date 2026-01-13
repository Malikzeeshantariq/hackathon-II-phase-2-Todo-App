/**
 * T022: TaskList component.
 *
 * Spec Reference: US-2 (View Tasks)
 * Displays all tasks belonging to the authenticated user.
 */

"use client"

import { Task } from "@/lib/types"
import TaskItem from "./TaskItem"

interface TaskListProps {
  tasks: Task[]
  onToggleComplete: (taskId: string) => Promise<void>
  onDelete: (taskId: string) => Promise<void>
  onUpdate: (taskId: string, title: string, description: string | null) => Promise<void>
  isLoading?: boolean
  error?: string | null
}

/**
 * Renders a list of tasks with actions.
 *
 * Features:
 * - Displays tasks with title, description, and completion status
 * - Supports toggle complete, edit, and delete actions
 * - Shows loading and error states
 */
export default function TaskList({
  tasks,
  onToggleComplete,
  onDelete,
  onUpdate,
  isLoading = false,
  error = null,
}: TaskListProps) {
  // T043: Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // T043: Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-medium">Error loading tasks</p>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  // Empty state
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new task.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  )
}
