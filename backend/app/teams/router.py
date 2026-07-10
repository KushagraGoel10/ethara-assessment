from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.teams.schema import TeamCreate, TeamResponse, TeamUpdate
from app.teams.service import TeamService


router = APIRouter(tags=["Teams"])


@router.get("/teams", response_model=list[TeamResponse])
def get_teams(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=100),
    db: Session = Depends(get_db),
) -> list[TeamResponse]:
    return TeamService(db).get_teams(skip=skip, limit=limit)


@router.get("/teams/{team_id}", response_model=TeamResponse)
def get_team(team_id: int, db: Session = Depends(get_db)) -> TeamResponse:
    return TeamService(db).get_team(team_id)


@router.get("/departments/{department_id}/teams", response_model=list[TeamResponse])
def get_department_teams(
    department_id: int,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=100),
    db: Session = Depends(get_db),
) -> list[TeamResponse]:
    return TeamService(db).get_department_teams(department_id=department_id, skip=skip, limit=limit)


@router.post("/teams", response_model=TeamResponse, status_code=201)
def create_team(team_data: TeamCreate, db: Session = Depends(get_db)) -> TeamResponse:
    return TeamService(db).create_team(team_data)


@router.put("/teams/{team_id}", response_model=TeamResponse)
def update_team(
    team_id: int,
    team_data: TeamUpdate,
    db: Session = Depends(get_db),
) -> TeamResponse:
    return TeamService(db).update_team(team_id, team_data)
