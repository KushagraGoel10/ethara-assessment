from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.floors.schema import FloorCreate, FloorResponse, FloorUpdate
from app.floors.service import FloorService


router = APIRouter(prefix="/floors", tags=["Floors"])


@router.get("/", response_model=list[FloorResponse])
def get_floors(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=100),
    db: Session = Depends(get_db),
) -> list[FloorResponse]:
    return FloorService(db).get_floors(skip=skip, limit=limit)


@router.get("/{floor_id}", response_model=FloorResponse)
def get_floor(floor_id: int, db: Session = Depends(get_db)) -> FloorResponse:
    return FloorService(db).get_floor(floor_id)


@router.post("/", response_model=FloorResponse, status_code=201)
def create_floor(floor_data: FloorCreate, db: Session = Depends(get_db)) -> FloorResponse:
    return FloorService(db).create_floor(floor_data)


@router.put("/{floor_id}", response_model=FloorResponse)
def update_floor(
    floor_id: int,
    floor_data: FloorUpdate,
    db: Session = Depends(get_db),
) -> FloorResponse:
    return FloorService(db).update_floor(floor_id, floor_data)
