/**
 * T015: TypeScript type definitions.
 *
 * Spec Reference: contracts/openapi.yaml - schemas
 * Spec Reference: data-model.md - Entities
 */

/**
 * Task entity as returned by the API.
 *
 * Spec Reference: TaskResponse schema in openapi.yaml
 */
export interface Task {
  id: string
  title: string
  description: string | null
  completed: boolean
  created_at: string
  updated_at: string
}

/**
 * Request body for creating a task.
 *
 * Spec Reference: TaskCreate schema in openapi.yaml
 */
export interface TaskCreate {
  title: string
  description?: string | null
}

/**
 * Request body for updating a task.
 *
 * Spec Reference: TaskUpdate schema in openapi.yaml
 */
export interface TaskUpdate {
  title?: string
  description?: string | null
}

/**
 * Response body for listing tasks.
 *
 * Spec Reference: TaskListResponse schema in openapi.yaml
 */
export interface TaskListResponse {
  tasks: Task[]
}

/**
 * User information from auth session.
 */
export interface User {
  id: string
  email: string
  name?: string
}

/**
 * API error response format.
 *
 * Spec Reference: ErrorResponse schema in openapi.yaml
 */
export interface ApiError {
  detail: string
}

/**
 * Validation error response format.
 *
 * Spec Reference: ValidationErrorResponse schema in openapi.yaml
 */
export interface ValidationError {
  detail: Array<{
    loc: string[]
    msg: string
    type: string
  }>
}
