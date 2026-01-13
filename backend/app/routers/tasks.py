"""T018-T020: Task CRUD endpoints.

Spec Reference: contracts/openapi.yaml
User Stories: US-1 (Create), US-2 (View)
"""

from datetime import datetime, timezone
from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.database import get_session
from app.middleware.auth import TokenPayload, get_current_user, verify_user_access
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse, TaskListResponse

router = APIRouter(prefix="/api/{user_id}/tasks", tags=["Tasks"])


@router.post(
    "",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new task",
    description="Creates a new task for the authenticated user.",
)
async def create_task(
    user_id: str,
    task_data: TaskCreate,
    session: Session = Depends(get_session),
    current_user: TokenPayload = Depends(get_current_user),
) -> Task:
    """T018: Create a new task.

    Spec Reference: FR-001 to FR-004
    - FR-001: User provides title (required) and description (optional)
    - FR-002: Task is associated with user_id from JWT
    - FR-003: completed defaults to false
    - FR-004: created_at is set automatically

    Args:
        user_id: User ID from URL path
        task_data: Task creation payload
        session: Database session
        current_user: Authenticated user from JWT

    Returns:
        Task: Created task with all fields

    Raises:
        HTTPException: 403 if user_id doesn't match JWT
        HTTPException: 422 if validation fails
    """
    # AR-005: Verify URL user_id matches JWT user
    verify_user_access(current_user.user_id, user_id)

    # Create task with user_id from JWT (not from request body)
    task = Task(
        user_id=current_user.user_id,
        title=task_data.title,
        description=task_data.description,
        completed=False,  # FR-003: Default to incomplete
    )

    session.add(task)
    session.commit()
    session.refresh(task)

    return task


@router.get(
    "",
    response_model=TaskListResponse,
    summary="List all tasks",
    description="Returns all tasks belonging to the authenticated user.",
)
async def list_tasks(
    user_id: str,
    session: Session = Depends(get_session),
    current_user: TokenPayload = Depends(get_current_user),
) -> TaskListResponse:
    """T019: List all user tasks.

    Spec Reference: FR-005, FR-006
    - FR-005: Retrieve tasks owned by authenticated user
    - FR-006: Response includes all task fields

    Args:
        user_id: User ID from URL path
        session: Database session
        current_user: Authenticated user from JWT

    Returns:
        TaskListResponse: List of user's tasks

    Raises:
        HTTPException: 403 if user_id doesn't match JWT
    """
    # AR-005: Verify URL user_id matches JWT user
    verify_user_access(current_user.user_id, user_id)

    # Query tasks with user isolation
    statement = select(Task).where(Task.user_id == current_user.user_id)
    tasks = session.exec(statement).all()

    return TaskListResponse(tasks=list(tasks))


@router.get(
    "/{task_id}",
    response_model=TaskResponse,
    summary="Get task details",
    description="Returns details of a specific task.",
)
async def get_task(
    user_id: str,
    task_id: UUID,
    session: Session = Depends(get_session),
    current_user: TokenPayload = Depends(get_current_user),
) -> Task:
    """T020: Get a single task by ID.

    Spec Reference: FR-005

    Args:
        user_id: User ID from URL path
        task_id: Task UUID
        session: Database session
        current_user: Authenticated user from JWT

    Returns:
        Task: Task details

    Raises:
        HTTPException: 403 if user_id doesn't match JWT
        HTTPException: 404 if task not found or not owned by user
    """
    # AR-005: Verify URL user_id matches JWT user
    verify_user_access(current_user.user_id, user_id)

    # Query with user isolation
    statement = select(Task).where(
        Task.id == task_id,
        Task.user_id == current_user.user_id
    )
    task = session.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return task


@router.put(
    "/{task_id}",
    response_model=TaskResponse,
    summary="Update a task",
    description="Updates title and/or description of an existing task.",
)
async def update_task(
    user_id: str,
    task_id: UUID,
    task_data: TaskUpdate,
    session: Session = Depends(get_session),
    current_user: TokenPayload = Depends(get_current_user),
) -> Task:
    """T027: Update an existing task.

    Spec Reference: FR-007, FR-008
    - FR-007: Update title and/or description
    - FR-008: updated_at is automatically updated

    Args:
        user_id: User ID from URL path
        task_id: Task UUID
        task_data: Update payload (partial)
        session: Database session
        current_user: Authenticated user from JWT

    Returns:
        Task: Updated task

    Raises:
        HTTPException: 403 if user_id doesn't match JWT
        HTTPException: 404 if task not found or not owned by user
    """
    # AR-005: Verify URL user_id matches JWT user
    verify_user_access(current_user.user_id, user_id)

    # Query with user isolation
    statement = select(Task).where(
        Task.id == task_id,
        Task.user_id == current_user.user_id
    )
    task = session.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Update only provided fields
    if task_data.title is not None:
        task.title = task_data.title
    if task_data.description is not None:
        task.description = task_data.description

    # FR-008: Auto-update timestamp
    task.updated_at = datetime.now(timezone.utc)

    session.add(task)
    session.commit()
    session.refresh(task)

    return task


@router.patch(
    "/{task_id}/complete",
    response_model=TaskResponse,
    summary="Toggle task completion",
    description="Marks a task as completed.",
)
async def complete_task(
    user_id: str,
    task_id: UUID,
    session: Session = Depends(get_session),
    current_user: TokenPayload = Depends(get_current_user),
) -> Task:
    """T028: Toggle task completion status.

    Spec Reference: FR-009

    Args:
        user_id: User ID from URL path
        task_id: Task UUID
        session: Database session
        current_user: Authenticated user from JWT

    Returns:
        Task: Task with updated completion status

    Raises:
        HTTPException: 403 if user_id doesn't match JWT
        HTTPException: 404 if task not found or not owned by user
    """
    # AR-005: Verify URL user_id matches JWT user
    verify_user_access(current_user.user_id, user_id)

    # Query with user isolation
    statement = select(Task).where(
        Task.id == task_id,
        Task.user_id == current_user.user_id
    )
    task = session.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Toggle completion status
    task.completed = not task.completed
    task.updated_at = datetime.now(timezone.utc)

    session.add(task)
    session.commit()
    session.refresh(task)

    return task


@router.delete(
    "/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a task",
    description="Permanently removes a task.",
)
async def delete_task(
    user_id: str,
    task_id: UUID,
    session: Session = Depends(get_session),
    current_user: TokenPayload = Depends(get_current_user),
) -> None:
    """T032: Delete a task.

    Spec Reference: FR-010, FR-011
    - FR-010: Delete a specific task
    - FR-011: Task is permanently removed (hard delete)

    Args:
        user_id: User ID from URL path
        task_id: Task UUID
        session: Database session
        current_user: Authenticated user from JWT

    Raises:
        HTTPException: 403 if user_id doesn't match JWT
        HTTPException: 404 if task not found or not owned by user
    """
    # AR-005: Verify URL user_id matches JWT user
    verify_user_access(current_user.user_id, user_id)

    # Query with user isolation
    statement = select(Task).where(
        Task.id == task_id,
        Task.user_id == current_user.user_id
    )
    task = session.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    session.delete(task)
    session.commit()
