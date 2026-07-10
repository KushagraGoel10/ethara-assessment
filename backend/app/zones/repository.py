from sqlalchemy import select
from sqlalchemy.orm import Session

from app.zones.model import Zone
from app.zones.schema import ZoneCreate, ZoneUpdate


class ZoneRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, zone_data: ZoneCreate) -> Zone:
        zone = Zone(**zone_data.model_dump())
        self.db.add(zone)
        self.db.commit()
        self.db.refresh(zone)
        return zone

    def get_by_id(self, zone_id: int) -> Zone | None:
        return self.db.get(Zone, zone_id)

    def get_by_floor_and_name(self, floor_id: int, name: str) -> Zone | None:
        statement = select(Zone).where(Zone.floor_id == floor_id, Zone.name == name)
        return self.db.scalar(statement)

    def get_all(self, skip: int = 0, limit: int = 100) -> list[Zone]:
        statement = select(Zone).order_by(Zone.id).offset(skip).limit(limit)
        return list(self.db.scalars(statement).all())

    def get_by_floor(self, floor_id: int, skip: int = 0, limit: int = 100) -> list[Zone]:
        statement = (
            select(Zone)
            .where(Zone.floor_id == floor_id)
            .order_by(Zone.id)
            .offset(skip)
            .limit(limit)
        )
        return list(self.db.scalars(statement).all())

    def update(self, zone: Zone, zone_data: ZoneUpdate) -> Zone:
        update_data = zone_data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(zone, field, value)

        self.db.commit()
        self.db.refresh(zone)
        return zone
