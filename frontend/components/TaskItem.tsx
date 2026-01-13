/**
 * T024, T029, T030, T033: TaskItem component.
 *
 * Spec Reference: US-2 (View), US-3 (Update), US-4 (Complete), US-5 (Delete)
 * Individual task display with all CRUD actions.
 */

"use client"

import { useState } from "react"
import { Task } from "@/lib/types"

interface TaskItemProps {
  task: Task
  onToggleComplete: (taskId: string) => Promise<void>
  onDelete: (taskId: string) => Promise<void>
  onUpdate: (taskId: string, title: string, description: string | null) => Promise<void>
}

/**
 * Renders a single task with actions.
 *
 * Features:
 * - T024: Display task title, description, and completion status
 * - T029: Edit mode for updating title/description
 * - T030: Checkbox to toggle completion status
 * - T033: Delete button with confirmation
 */
export default function TaskItem({
  task,
  onToggleComplete,
  onDelete,
  onUpdate,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDescription, setEditDescription] = useState(task.description || "")
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // T030: Handle completion toggle
  const handleToggleComplete = async () => {
    setIsLoading(true)
    try {
      await onToggleComplete(task.id)
    } finally {
      setIsLoading(false)
    }
  }

  // T029: Handle edit mode
  const handleStartEdit = () => {
    setEditTitle(task.title)
    setEditDescription(task.description || "")
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditTitle(task.title)
    setEditDescription(task.description || "")
  }

  const handleSaveEdit = async () => {
    const trimmedTitle = editTitle.trim()
    if (!trimmedTitle) return

    setIsLoading(true)
    try {
      await onUpdate(task.id, trimmedTitle, editDescription.trim() || null)
      setIsEditing(false)
    } finally {
      setIsLoading(false)
    }
  }

  // T033: Handle delete with confirmation
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return

    setIsDeleting(true)
    try {
      await onDelete(task.id)
    } finally {
      setIsDeleting(false)
    }
  }

  // Edit mode view
  if (isEditing) {
    return (
      <div className="bg-white border border-blue-200 rounded-lg p-4 shadow-sm">
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Task title"
            maxLength={255}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoFocus
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Description (optional)"
            maxLength={10000}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              disabled={isLoading || !editTitle.trim()}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Normal view
  return (
    <div
      className={`bg-white border rounded-lg p-4 shadow-sm transition-all ${
        task.completed ? "border-green-200 bg-green-50" : "border-gray-200"
      } ${isDeleting ? "opacity-50" : ""}`}
    >
      <div className="flex items-start gap-3">
        {/* T030: Completion checkbox */}
        <button
          onClick={handleToggleComplete}
          disabled={isLoading || isDeleting}
          className={`flex-shrink-0 w-6 h-6 mt-0.5 rounded-full border-2 flex items-center justify-center transition-colors ${
            task.completed
              ? "bg-green-500 border-green-500 text-white"
              : "border-gray-300 hover:border-green-400"
          } ${isLoading ? "opacity-50 cursor-wait" : ""}`}
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed && (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        {/* Task content */}
        <div className="flex-grow min-w-0">
          <h3
            className={`font-medium text-gray-900 ${
              task.completed ? "line-through text-gray-500" : ""
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p
              className={`mt-1 text-sm ${
                task.completed ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {task.description}
            </p>
          )}
          <p className="mt-2 text-xs text-gray-400">
            Created: {new Date(task.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex-shrink-0 flex gap-1">
          {/* Edit button */}
          <button
            onClick={handleStartEdit}
            disabled={isDeleting}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Edit task"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          {/* Delete button */}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Delete task"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
