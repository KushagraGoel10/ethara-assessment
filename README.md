# Seat Allocation & Project Mapping System

A full-stack Seat Allocation & Project Mapping System built as part of the Ethara AI Technical Assessment.

The application enables organizations to efficiently manage employees, departments, projects, seating layouts, project assignments, and seat allocations while providing real-time dashboard analytics and an AI-powered natural language interface.

---

# Tech Stack

## Frontend

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- React Query
- Axios
- React Hook Form
- Zod
- Lucide Icons

## Backend

- FastAPI
- SQLAlchemy
- Pydantic
- Alembic
- PostgreSQL

## AI

- OpenAI API (Natural Language Query Interface)

---

# Features

## Employee Management

- Create Employee
- Update Employee
- Employee Search
- Active / Inactive Status
- New Joiner Flag

---

## Department Management

- Create Department
- Update Department
- View Departments

---

## Team Management

- Create Team
- Update Team
- Department-wise Team Listing

---

## Project Management

- Create Project
- Update Project
- Active Project Tracking

---

## Floor Management

- CRUD Operations

---

## Zone Management

- CRUD Operations

---

## Seat Management

- Create Seats
- Zone Mapping
- Floor Mapping
- Seat Availability

---

## Project Assignment

- Assign Employee to Project
- Update Assignment
- Employee Project Lookup

---

## Seat Allocation

- Allocate Seat
- Release Seat
- Prevent Duplicate Active Allocation
- Employee Seat Lookup

---

## Dashboard

Live dashboard displaying:

- Total Employees
- Total Departments
- Total Teams
- Total Projects
- Total Floors
- Total Zones
- Total Seats
- Occupied Seats
- Available Seats
- Seat Utilization %
- Active Projects
- New Joiners
- New Joiners Without Seat Allocation

---

## AI Assistant

Natural language assistant capable of answering queries such as:

- Where is Rahul seated?
- Which employees are in Project X?
- How many seats are available?
- Show seat utilization.
- Which new joiners don't have seats?

> Note:
> The AI module requires a valid OpenAI API Key with available API credits.

---

# Architecture

The application follows a layered architecture.

```
Frontend (Next.js)

        ↓

REST API

        ↓

FastAPI Router

        ↓

Service Layer

        ↓

Repository Layer

        ↓

PostgreSQL
```

---

# Project Structure

```
seat-allocation-system/

backend/
    app/
        employees/
        departments/
        teams/
        projects/
        floors/
        zones/
        seats/
        project_assignments/
        seat_allocations/
        dashboard/
        ai/

frontend/
    app/
    components/
    hooks/
    services/
    types/

alembic/

README.md
AI_PROMPTS.md
```

---

# Installation

## Backend

```bash
cd backend

python -m venv .venv

.venv\Scripts\activate

pip install -r requirements.txt

alembic upgrade head

uvicorn app.main:app --reload
```

Swagger

```
http://localhost:8000/docs
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

```
http://localhost:3000
```

---

# Environment Variables

## Backend

```
DATABASE_URL=

OPENAI_API_KEY=
```

---

## Frontend

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
```

---

# API Documentation

Swagger

```
http://localhost:8000/docs
```

---

# Database

PostgreSQL

Managed using:

- SQLAlchemy ORM
- Alembic Migrations

---

# AI Usage

AI tools used during development:

- OpenAI Codex
- ChatGPT

Complete prompt history is available in:

```
AI_PROMPTS.md
```

---

# Screenshots

The repository includes screenshots for:

- Dashboard
- Employees
- Departments
- Teams
- Projects
- Floors
- Zones
- Seats
- Project Assignments
- Seat Allocations
- AI Assistant
- Swagger Documentation

---

# Future Improvements

- Authentication & Authorization
- Role Based Access Control
- Seat Layout Visualization
- AI Streaming Responses
- Advanced Dashboard Charts
- CSV Import / Export
- Bulk Employee Upload
- Notifications
- Audit Logs

---

# Author

Kushagra Goel

Ethara AI Technical Assessment