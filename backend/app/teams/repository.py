from sqlalchemy import select
from sqlalchemy.orm import Session

from app.teams.model import Team
from app.teams.schema import TeamCreate, TeamUpdate


class TeamRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, team_data: TeamCreate) -> Team:
        team = Team(**team_data.model_dump())
        self.db.add(team)
        self.db.commit()
        self.db.refresh(team)
        return team

    def get_by_id(self, team_id: int) -> Team | None:
        return self.db.get(Team, team_id)

    def get_by_department_and_name(self, department_id: int, name: str) -> Team | None:
        statement = select(Team).where(Team.department_id == department_id, Team.name == name)
        return self.db.scalar(statement)

    def get_all(self, skip: int = 0, limit: int = 100) -> list[Team]:
        statement = select(Team).order_by(Team.id).offset(skip).limit(limit)
        return list(self.db.scalars(statement).all())

    def get_by_department(self, department_id: int, skip: int = 0, limit: int = 100) -> list[Team]:
        statement = (
            select(Team)
            .where(Team.department_id == department_id)
            .order_by(Team.id)
            .offset(skip)
            .limit(limit)
        )
        return list(self.db.scalars(statement).all())

    def update(self, team: Team, team_data: TeamUpdate) -> Team:
        update_data = team_data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(team, field, value)

        self.db.commit()
        self.db.refresh(team)
        return team
