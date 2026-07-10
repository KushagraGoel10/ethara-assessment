from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.ai.schema import AIQueryRequest, AIQueryResponse
from app.ai.service import AIService
from app.db.database import get_db


router = APIRouter(prefix="/ai", tags=["AI Assistant"])


@router.post("/query", response_model=AIQueryResponse)
def query_ai(
    query_data: AIQueryRequest,
    db: Session = Depends(get_db),
) -> AIQueryResponse:
    return AIService(db).query(query_data.query)
