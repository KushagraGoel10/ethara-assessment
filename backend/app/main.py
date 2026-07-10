from fastapi import APIRouter, FastAPI

from app.core.config import settings


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
)

api_router = APIRouter()
app.include_router(api_router, prefix=settings.API_PREFIX)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
