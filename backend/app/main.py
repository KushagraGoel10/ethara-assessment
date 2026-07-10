from fastapi import APIRouter, FastAPI

from app.core.config import settings
from app.departments.router import router as departments_router
from app.employees.router import router as employees_router
from app.projects.router import router as projects_router
from app.teams.router import router as teams_router


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
)

api_router = APIRouter()
api_router.include_router(departments_router)
api_router.include_router(employees_router)
api_router.include_router(teams_router)
api_router.include_router(projects_router)
app.include_router(api_router, prefix=settings.API_PREFIX)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
