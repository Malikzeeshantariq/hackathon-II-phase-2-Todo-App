/**
 * T023: TaskForm component.
 *
 * Spec Reference: US-1 (Create Task)
 * Form for creating new tasks with title and optional description.
 */

"use client"

import { useState, FormEvent } from "react"

interface TaskFormProps {
  onSubmit: (title: string, description: string | null) => Promise<void>
  isSubmitting?: boolean
  error?: string | null
}

/**
 * Form for creating new tasks.
 *
 * Features:
 * - Title field (required, max 255 chars)
 * - Description field (optional, max 10000 chars)
 * - Submit button with loading state
 * - Error display (T044)
 */
export default function TaskForm({
  onSubmit,
  isSubmitting = false,
  error = null,
}: TaskFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    // Client-side validation
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setLocalError("Title is required")
      return
    }
    if (trimmedTitle.length > 255) {
      setLocalError("Title must be 255 characters or less")
      return
    }
    if (description.length > 10000) {
      setLocalError("Description must be 10000 characters or less")
      return
    }

    try {
      await onSubmit(trimmedTitle, description.trim() || null)
      // Clear form on success
      setTitle("")
      setDescription("")
    } catch {
      // Error handled by parent
    }
  }

  const displayError = localError || error

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* T044: Error display */}
      {displayError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {displayError}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          maxLength={255}
          required
          disabled={isSubmitting}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <p className="mt-1 text-xs text-gray-500">
          {title.length}/255 characters
        </p>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details (optional)"
          maxLength={10000}
          rows={3}
          disabled={isSubmitting}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-y"
        />
        <p className="mt-1 text-xs text-gray-500">
          {description.length}/10000 characters
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !title.trim()}
        className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Creating...
          </span>
        ) : (
          "Create Task"
        )}
      </button>
    </form>
  )
}
