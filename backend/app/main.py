from fastapi import APIRouter, FastAPI

from app.core.config import settings
from app.dashboard.router import router as dashboard_router
from app.departments.router import router as departments_router
from app.employees.router import router as employees_router
from app.floors.router import router as floors_router
from app.project_assignments.router import router as project_assignments_router
from app.projects.router import router as projects_router
from app.seat_allocations.router import router as seat_allocations_router
from app.seats.router import router as seats_router
from app.teams.router import router as teams_router
from app.zones.router import router as zones_router


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
)

api_router = APIRouter()
api_router.include_router(departments_router)
api_router.include_router(employees_router)
api_router.include_router(teams_router)
api_router.include_router(projects_router)
api_router.include_router(floors_router)
api_router.include_router(zones_router)
api_router.include_router(seats_router)
api_router.include_router(project_assignments_router)
api_router.include_router(seat_allocations_router)
api_router.include_router(dashboard_router)
app.include_router(api_router, prefix=settings.API_PREFIX)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
