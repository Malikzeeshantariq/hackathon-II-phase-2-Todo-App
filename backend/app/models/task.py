"""T009: Task SQLModel definition.

Spec Reference: data-model.md - Task Entity
Functional Requirements: FR-001 through FR-011
"""

from datetime import datetime, timezone
from typing import Optional
from uuid import UUID, uuid4

from sqlmodel import SQLModel, Field


class Task(SQLModel, table=True):
    """Task entity for Todo CRUD API.

    Represents a unit of work to be completed by a user.
    Each task belongs to exactly one user (user_id from JWT).

    Attributes:
        id: Unique task identifier (UUID, auto-generated)
        user_id: Owner's user ID (from JWT sub claim)
        title: Task title (required, max 255 chars)
        description: Detailed description (optional)
        completed: Completion status (default: False)
        created_at: Creation timestamp (auto-set)
        updated_at: Last modification timestamp (auto-updated)
    """

    __tablename__ = "tasks"

    id: UUID = Field(
        default_factory=uuid4,
        primary_key=True,
        description="Unique task identifier"
    )
    user_id: str = Field(
        index=True,
        nullable=False,
        description="Owner's user ID from JWT"
    )
    title: str = Field(
        max_length=255,
        nullable=False,
        description="Task title"
    )
    description: Optional[str] = Field(
        default=None,
        description="Detailed task description"
    )
    completed: bool = Field(
        default=False,
        description="Completion status"
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Creation timestamp"
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Last modification timestamp"
    )
