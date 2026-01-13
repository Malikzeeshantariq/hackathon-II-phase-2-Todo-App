"""T007: Database connection module for Neon PostgreSQL.

Spec Reference: plan.md - Database: Neon PostgreSQL
"""

from sqlmodel import SQLModel, Session, create_engine
from typing import Generator

from app.config import get_settings

settings = get_settings()

# Create database engine with connection pooling
# Neon PostgreSQL connection
engine = create_engine(
    settings.DATABASE_URL,
    echo=False,  # Set to True for SQL logging during development
    pool_pre_ping=True,  # Verify connections before using
)


def create_db_and_tables() -> None:
    """Create all database tables.

    Called at application startup to ensure tables exist.
    """
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """Dependency injection for database sessions.

    Yields:
        Session: SQLModel database session

    Usage:
        @app.get("/")
        def endpoint(session: Session = Depends(get_session)):
            ...
    """
    with Session(engine) as session:
        yield session
