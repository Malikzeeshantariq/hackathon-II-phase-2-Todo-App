"""T012: FastAPI application entry point.

Spec Reference: plan.md - Component Responsibilities
"""
from pathlib import Path
from dotenv import load_dotenv

# Load .env from project root
load_dotenv(Path(__file__).resolve().parent.parent.parent / ".env")

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from app.config import get_settings
from app.database import create_db_and_tables
from app.routers import tasks

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager.

    Creates database tables on startup.
    """
    # Startup
    create_db_and_tables()
    yield
    # Shutdown (cleanup if needed)


app = FastAPI(
    title="Todo CRUD API",
    description="RESTful API for task management with JWT authentication",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS
# Spec Reference: plan.md - CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# T021: Register task router
app.include_router(tasks.router)


@app.get("/health")
async def health_check():
    """Health check endpoint.

    Returns:
        dict: Status information
    """
    return {"status": "ok"}
