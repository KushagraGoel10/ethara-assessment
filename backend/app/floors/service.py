from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.floors.model import Floor
from app.floors.repository import FloorRepository
from app.floors.schema import FloorCreate, FloorUpdate


class FloorService:
    def __init__(self, db: Session) -> None:
        self.repository = FloorRepository(db)

    def create_floor(self, floor_data: FloorCreate) -> Floor:
        if self.repository.get_by_name(floor_data.name):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Floor name already exists",
            )

        return self.repository.create(floor_data)

    def get_floor(self, floor_id: int) -> Floor:
        floor = self.repository.get_by_id(floor_id)
        if floor is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Floor not found",
            )
        return floor

    def get_floors(self, skip: int = 0, limit: int = 100) -> list[Floor]:
        return self.repository.get_all(skip=skip, limit=limit)

    def update_floor(self, floor_id: int, floor_data: FloorUpdate) -> Floor:
        floor = self.get_floor(floor_id)

        if floor_data.name and floor_data.name != floor.name:
            existing_floor = self.repository.get_by_name(floor_data.name)
            if existing_floor:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Floor name already exists",
                )

        return self.repository.update(floor, floor_data)
