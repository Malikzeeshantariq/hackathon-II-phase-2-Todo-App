"""T010: Pydantic schemas for request/response validation.

Spec Reference: data-model.md - Pydantic Schemas section
Spec Reference: contracts/openapi.yaml - schemas
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class TaskCreate(BaseModel):
    """Request body for creating a task.

    Spec Reference: FR-001
    """
    title: str = Field(
        min_length=1,
        max_length=255,
        description="Task title (required)"
    )
    description: Optional[str] = Field(
        default=None,
        max_length=2000,
        description="Task description (optional, max 2000 chars)"
    )


class TaskUpdate(BaseModel):
    """Request body for updating a task.

    Spec Reference: FR-007
    Both fields are optional - only provided fields are updated.
    """
    title: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=255,
        description="New task title"
    )
    description: Optional[str] = Field(
        default=None,
        max_length=2000,
        description="New task description (max 2000 chars)"
    )


class TaskResponse(BaseModel):
    """Response body for task operations.

    Spec Reference: FR-006, contracts/openapi.yaml TaskResponse
    """
    id: UUID
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TaskListResponse(BaseModel):
    """Response body for listing tasks.

    Spec Reference: FR-005, FR-006
    """
    tasks: list[TaskResponse]
