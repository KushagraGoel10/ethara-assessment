# CODING_RULES.md

## Project

Seat Allocation & Project Mapping System

## Tech Stack

- FastAPI
- PostgreSQL
- SQLAlchemy 2.x
- Alembic
- Pydantic
- Next.js
- TypeScript
- Tailwind CSS

---

## Frozen Decisions

Do NOT change unless explicitly instructed.

- Requirements
- Architecture
- Database Schema
- API Design
- Folder Structure

---

## Architecture

Frontend
↓
REST API
↓
Router
↓
Service
↓
Repository
↓
PostgreSQL

---

## Coding Rules

- Keep the implementation simple.
- Suitable for a 48-hour assessment.
- Do not over-engineer.
- Use SQLAlchemy 2.x.
- Follow REST conventions.
- Reuse existing code.
- Do not modify unrelated files.
- Keep changes limited to the requested feature.
- Follow SOLID where practical.
- Use clean naming.

---

## If Something Needs to Change

Stop.

Explain the reason first.

Do not implement the change without approval.

---

## Every Task Should End With

- Files modified
- Manual steps
- Testing commands