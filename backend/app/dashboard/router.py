from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dashboard.schema import DashboardSummaryResponse
from app.dashboard.service import DashboardService
from app.db.database import get_db


router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(db: Session = Depends(get_db)) -> DashboardSummaryResponse:
    return DashboardService(db).get_summary()
