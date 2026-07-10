from sqlalchemy import select
from sqlalchemy.orm import Session

from app.floors.model import Floor
from app.floors.schema import FloorCreate, FloorUpdate


class FloorRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, floor_data: FloorCreate) -> Floor:
        floor = Floor(**floor_data.model_dump())
        self.db.add(floor)
        self.db.commit()
        self.db.refresh(floor)
        return floor

    def get_by_id(self, floor_id: int) -> Floor | None:
        return self.db.get(Floor, floor_id)

    def get_by_name(self, name: str) -> Floor | None:
        statement = select(Floor).where(Floor.name == name)
        return self.db.scalar(statement)

    def get_all(self, skip: int = 0, limit: int = 100) -> list[Floor]:
        statement = select(Floor).order_by(Floor.id).offset(skip).limit(limit)
        return list(self.db.scalars(statement).all())

    def update(self, floor: Floor, floor_data: FloorUpdate) -> Floor:
        update_data = floor_data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(floor, field, value)

        self.db.commit()
        self.db.refresh(floor)
        return floor
