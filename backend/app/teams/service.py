from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.teams.model import Team
from app.teams.repository import TeamRepository
from app.teams.schema import TeamCreate, TeamUpdate


class TeamService:
    def __init__(self, db: Session) -> None:
        self.repository = TeamRepository(db)

    def create_team(self, team_data: TeamCreate) -> Team:
        if self.repository.get_by_department_and_name(team_data.department_id, team_data.name):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Team name already exists in this department",
            )

        return self.repository.create(team_data)

    def get_team(self, team_id: int) -> Team:
        team = self.repository.get_by_id(team_id)
        if team is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found",
            )
        return team

    def get_teams(self, skip: int = 0, limit: int = 100) -> list[Team]:
        return self.repository.get_all(skip=skip, limit=limit)

    def get_department_teams(self, department_id: int, skip: int = 0, limit: int = 100) -> list[Team]:
        return self.repository.get_by_department(department_id=department_id, skip=skip, limit=limit)

    def update_team(self, team_id: int, team_data: TeamUpdate) -> Team:
        team = self.get_team(team_id)
        department_id = team_data.department_id if team_data.department_id is not None else team.department_id
        name = team_data.name if team_data.name is not None else team.name

        if department_id != team.department_id or name != team.name:
            existing_team = self.repository.get_by_department_and_name(department_id, name)
            if existing_team:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Team name already exists in this department",
                )

        return self.repository.update(team, team_data)
