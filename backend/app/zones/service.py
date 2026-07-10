from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.zones.model import Zone
from app.zones.repository import ZoneRepository
from app.zones.schema import ZoneCreate, ZoneUpdate


class ZoneService:
    def __init__(self, db: Session) -> None:
        self.repository = ZoneRepository(db)

    def create_zone(self, zone_data: ZoneCreate) -> Zone:
        if self.repository.get_by_floor_and_name(zone_data.floor_id, zone_data.name):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Zone name already exists on this floor",
            )

        return self.repository.create(zone_data)

    def get_zone(self, zone_id: int) -> Zone:
        zone = self.repository.get_by_id(zone_id)
        if zone is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Zone not found",
            )
        return zone

    def get_zones(self, skip: int = 0, limit: int = 100) -> list[Zone]:
        return self.repository.get_all(skip=skip, limit=limit)

    def get_floor_zones(self, floor_id: int, skip: int = 0, limit: int = 100) -> list[Zone]:
        return self.repository.get_by_floor(floor_id=floor_id, skip=skip, limit=limit)

    def update_zone(self, zone_id: int, zone_data: ZoneUpdate) -> Zone:
        zone = self.get_zone(zone_id)
        floor_id = zone_data.floor_id if zone_data.floor_id is not None else zone.floor_id
        name = zone_data.name if zone_data.name is not None else zone.name

        if floor_id != zone.floor_id or name != zone.name:
            existing_zone = self.repository.get_by_floor_and_name(floor_id, name)
            if existing_zone:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Zone name already exists on this floor",
                )

        return self.repository.update(zone, zone_data)
