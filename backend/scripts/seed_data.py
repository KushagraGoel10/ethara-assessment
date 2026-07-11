from __future__ import annotations

import sys
from datetime import date, timedelta
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.append(str(BACKEND_DIR))

from app.db.database import SessionLocal
from app.departments.model import Department
from app.employees.model import Employee
from app.floors.model import Floor
from app.project_assignments.model import ProjectAssignment
from app.projects.model import Project
from app.seat_allocations.model import SeatAllocation
from app.seats.model import Seat
from app.teams.model import Team
from app.zones.model import Zone


DEPARTMENTS = [
    "Engineering",
    "Product",
    "Design",
    "Operations",
    "People",
]

TEAMS = [
    ("Engineering", "Backend"),
    ("Engineering", "Frontend"),
    ("Engineering", "Platform"),
    ("Product", "Product Management"),
    ("Product", "Product Analytics"),
    ("Design", "UX Design"),
    ("Design", "Research"),
    ("Operations", "Facilities"),
    ("Operations", "IT Support"),
    ("People", "Talent"),
]

PROJECTS = [
    ("Seat Allocation System", "SAS", "Internal platform for workplace seat allocation."),
    ("Project Mapping Portal", "PMP", "Project assignment and reporting workspace."),
    ("Workspace Analytics", "WKA", "Dashboard metrics for office utilization."),
    ("Employee Onboarding", "EOB", "New joiner onboarding improvements."),
    ("Facility Planner", "FPL", "Floor and zone planning tools."),
    ("HR Insights", "HRI", "Employee and team analytics."),
    ("Access Automation", "AUA", "Automation for access request workflows."),
    ("Support Desk Upgrade", "SDU", "Internal support desk modernization."),
]

FLOORS = ["Floor 1", "Floor 2", "Floor 3"]

ZONES = [
    ("Floor 1", "Zone A"),
    ("Floor 1", "Zone B"),
    ("Floor 2", "Zone A"),
    ("Floor 2", "Zone B"),
    ("Floor 3", "Zone A"),
    ("Floor 3", "Zone B"),
]

EMPLOYEE_NAMES = [
    ("Rahul", "Nair"),
    ("Ananya", "Sharma"),
    ("Vikram", "Menon"),
    ("Priya", "Iyer"),
    ("Arjun", "Rao"),
    ("Sneha", "Kapoor"),
    ("Karan", "Mehta"),
    ("Neha", "Joshi"),
    ("Amit", "Verma"),
    ("Riya", "Sen"),
    ("Dev", "Patel"),
    ("Maya", "Pillai"),
    ("Ishaan", "Gupta"),
    ("Tara", "Malhotra"),
    ("Nikhil", "Bose"),
    ("Aisha", "Khan"),
    ("Rohan", "Das"),
    ("Meera", "Nambiar"),
    ("Kabir", "Sethi"),
    ("Pooja", "Naik"),
    ("Aditya", "Kulkarni"),
    ("Sonia", "Thomas"),
    ("Harsh", "Jain"),
    ("Lavanya", "Reddy"),
    ("Manav", "Chopra"),
    ("Diya", "Bhat"),
    ("Yash", "Agarwal"),
    ("Nandini", "Mishra"),
    ("Samar", "Chawla"),
    ("Kavya", "Krishnan"),
    ("Varun", "Saxena"),
    ("Ira", "Banerjee"),
    ("Akash", "Shetty"),
    ("Mira", "George"),
    ("Siddharth", "Roy"),
    ("Esha", "Arora"),
    ("Om", "Desai"),
    ("Tanvi", "Sinha"),
    ("Raghav", "Bajaj"),
    ("Leela", "Mathew"),
    ("Dhruv", "Madan"),
    ("Sara", "Dutta"),
    ("Parth", "Wadhwa"),
    ("Kiara", "Sood"),
    ("Vivaan", "Ahuja"),
    ("Amrita", "Ghosh"),
    ("Neil", "Fernandes"),
    ("Jaya", "Prasad"),
    ("Aarav", "Trivedi"),
    ("Reva", "Bhandari"),
]

DESIGNATIONS = [
    "Software Engineer",
    "Senior Software Engineer",
    "Product Manager",
    "UX Designer",
    "Data Analyst",
    "Operations Executive",
    "HR Specialist",
    "IT Support Engineer",
]


def main() -> None:
    db = SessionLocal()
    created_counts = {
        "departments": 0,
        "teams": 0,
        "projects": 0,
        "floors": 0,
        "zones": 0,
        "seats": 0,
        "employees": 0,
        "project_assignments": 0,
        "seat_allocations": 0,
    }

    try:
        departments = seed_departments(db, created_counts)
        teams = seed_teams(db, departments, created_counts)
        projects = seed_projects(db, created_counts)
        floors = seed_floors(db, created_counts)
        zones = seed_zones(db, floors, created_counts)
        seats = seed_seats(db, zones, created_counts)
        employees = seed_employees(db, departments, teams, created_counts)
        seed_project_assignments(db, employees, projects, created_counts)
        seed_seat_allocations(db, employees, seats, created_counts)
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

    print("Seed data summary")
    print("-----------------")
    for entity, count in created_counts.items():
        print(f"{entity}: {count} created")


def seed_departments(db: Session, created_counts: dict[str, int]) -> dict[str, Department]:
    departments: dict[str, Department] = {}
    for name in DEPARTMENTS:
        department = db.scalar(select(Department).where(Department.name == name))
        if department is None:
            department = Department(name=name)
            db.add(department)
            db.flush()
            created_counts["departments"] += 1
        departments[name] = department
    return departments


def seed_teams(
    db: Session,
    departments: dict[str, Department],
    created_counts: dict[str, int],
) -> dict[str, Team]:
    teams: dict[str, Team] = {}
    for department_name, team_name in TEAMS:
        department = departments[department_name]
        team = db.scalar(
            select(Team).where(
                Team.department_id == department.id,
                Team.name == team_name,
            )
        )
        if team is None:
            team = Team(department_id=department.id, name=team_name)
            db.add(team)
            db.flush()
            created_counts["teams"] += 1
        teams[team_name] = team
    return teams


def seed_projects(db: Session, created_counts: dict[str, int]) -> list[Project]:
    projects: list[Project] = []
    for name, code, description in PROJECTS:
        project = db.scalar(select(Project).where(Project.code == code))
        if project is None:
            project = Project(
                name=name,
                code=code,
                description=description,
                is_active=True,
            )
            db.add(project)
            db.flush()
            created_counts["projects"] += 1
        projects.append(project)
    return projects


def seed_floors(db: Session, created_counts: dict[str, int]) -> dict[str, Floor]:
    floors: dict[str, Floor] = {}
    for name in FLOORS:
        floor = db.scalar(select(Floor).where(Floor.name == name))
        if floor is None:
            floor = Floor(name=name)
            db.add(floor)
            db.flush()
            created_counts["floors"] += 1
        floors[name] = floor
    return floors


def seed_zones(
    db: Session,
    floors: dict[str, Floor],
    created_counts: dict[str, int],
) -> dict[str, Zone]:
    zones: dict[str, Zone] = {}
    for floor_name, zone_name in ZONES:
        floor = floors[floor_name]
        zone = db.scalar(
            select(Zone).where(
                Zone.floor_id == floor.id,
                Zone.name == zone_name,
            )
        )
        if zone is None:
            zone = Zone(floor_id=floor.id, name=zone_name)
            db.add(zone)
            db.flush()
            created_counts["zones"] += 1
        zones[f"{floor_name}-{zone_name}"] = zone
    return zones


def seed_seats(
    db: Session,
    zones: dict[str, Zone],
    created_counts: dict[str, int],
) -> list[Seat]:
    seats: list[Seat] = []
    for zone_index, zone in enumerate(zones.values(), start=1):
        for seat_index in range(1, 11):
            seat_number = f"S{zone_index:02d}-{seat_index:02d}"
            seat = db.scalar(
                select(Seat).where(
                    Seat.zone_id == zone.id,
                    Seat.seat_number == seat_number,
                )
            )
            if seat is None:
                seat = Seat(zone_id=zone.id, seat_number=seat_number)
                db.add(seat)
                db.flush()
                created_counts["seats"] += 1
            seats.append(seat)
    return seats


def seed_employees(
    db: Session,
    departments: dict[str, Department],
    teams: dict[str, Team],
    created_counts: dict[str, int],
) -> list[Employee]:
    employees: list[Employee] = []
    team_list = list(teams.values())
    start_date = date.today() - timedelta(days=420)

    for index, (first_name, last_name) in enumerate(EMPLOYEE_NAMES, start=1):
        employee_code = f"EMP{index:03d}"
        email = f"{first_name.lower()}.{last_name.lower()}@ethara.example.com"
        team = team_list[(index - 1) % len(team_list)]
        department = next(
            department
            for department in departments.values()
            if department.id == team.department_id
        )

        employee = db.scalar(select(Employee).where(Employee.employee_code == employee_code))
        if employee is None:
            employee = Employee(
                employee_code=employee_code,
                first_name=first_name,
                last_name=last_name,
                email=email,
                designation=DESIGNATIONS[(index - 1) % len(DESIGNATIONS)],
                department_id=department.id,
                team_id=team.id,
                joining_date=start_date + timedelta(days=index * 6),
                is_new_joiner=index > 40,
                is_active=True,
            )
            db.add(employee)
            db.flush()
            created_counts["employees"] += 1
        employees.append(employee)
    return employees


def seed_project_assignments(
    db: Session,
    employees: list[Employee],
    projects: list[Project],
    created_counts: dict[str, int],
) -> None:
    for index, employee in enumerate(employees[:40]):
        existing_assignment = db.scalar(
            select(ProjectAssignment).where(ProjectAssignment.employee_id == employee.id)
        )
        if existing_assignment is not None:
            continue

        assignment = ProjectAssignment(
            employee_id=employee.id,
            project_id=projects[index % len(projects)].id,
            is_active=True,
        )
        db.add(assignment)
        db.flush()
        created_counts["project_assignments"] += 1


def seed_seat_allocations(
    db: Session,
    employees: list[Employee],
    seats: list[Seat],
    created_counts: dict[str, int],
) -> None:
    for employee, seat in zip(employees[:35], seats[:35]):
        employee_allocation = db.scalar(
            select(SeatAllocation).where(
                SeatAllocation.employee_id == employee.id,
                SeatAllocation.is_active.is_(True),
            )
        )
        seat_allocation = db.scalar(
            select(SeatAllocation).where(
                SeatAllocation.seat_id == seat.id,
                SeatAllocation.is_active.is_(True),
            )
        )

        if employee_allocation is not None or seat_allocation is not None:
            continue

        allocation = SeatAllocation(
            employee_id=employee.id,
            seat_id=seat.id,
            is_active=True,
        )
        db.add(allocation)
        db.flush()
        created_counts["seat_allocations"] += 1


if __name__ == "__main__":
    main()
