from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.zones.schema import ZoneCreate, ZoneResponse, ZoneUpdate
from app.zones.service import ZoneService


router = APIRouter(tags=["Zones"])


@router.get("/zones", response_model=list[ZoneResponse])
def get_zones(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=100),
    db: Session = Depends(get_db),
) -> list[ZoneResponse]:
    return ZoneService(db).get_zones(skip=skip, limit=limit)


@router.get("/zones/{zone_id}", response_model=ZoneResponse)
def get_zone(zone_id: int, db: Session = Depends(get_db)) -> ZoneResponse:
    return ZoneService(db).get_zone(zone_id)


@router.get("/floors/{floor_id}/zones", response_model=list[ZoneResponse])
def get_floor_zones(
    floor_id: int,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=100),
    db: Session = Depends(get_db),
) -> list[ZoneResponse]:
    return ZoneService(db).get_floor_zones(floor_id=floor_id, skip=skip, limit=limit)


@router.post("/zones", response_model=ZoneResponse, status_code=201)
def create_zone(zone_data: ZoneCreate, db: Session = Depends(get_db)) -> ZoneResponse:
    return ZoneService(db).create_zone(zone_data)


@router.put("/zones/{zone_id}", response_model=ZoneResponse)
def update_zone(
    zone_id: int,
    zone_data: ZoneUpdate,
    db: Session = Depends(get_db),
) -> ZoneResponse:
    return ZoneService(db).update_zone(zone_id, zone_data)
