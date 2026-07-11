# AI_PROMPTS.md

# AI Usage Documentation

## Project

Ethara AI Technical Assessment

Seat Allocation & Project Mapping System

---

# AI Tools Used

## 1. OpenAI Codex

Primary implementation assistant used for code generation.

Responsibilities:

- Backend module implementation
- Frontend module implementation
- API integration
- CRUD generation
- React Query integration
- UI scaffolding
- Dashboard implementation
- AI Assistant implementation

---

## 2. ChatGPT (GPT-5.5)

Used as a:

- Technical Lead
- Software Architect
- Code Reviewer
- Debugging Assistant

Responsibilities:

- Architecture planning
- Sprint planning
- Reviewing Codex-generated code
- Database design validation
- FastAPI best practices
- Repository-Service-Router architecture guidance
- React Query guidance
- Frontend debugging
- Backend debugging
- CORS troubleshooting
- Documentation generation
- Deployment planning
- Code quality review

ChatGPT acted as an engineering reviewer rather than directly generating the entire project.

---

# Development Workflow

The project was developed incrementally using sprint-based implementation.

For every sprint the following workflow was followed:

1. Plan the sprint using ChatGPT.
2. Generate implementation using OpenAI Codex.
3. Review generated code manually.
4. Apply manual fixes wherever required.
5. Validate APIs using Swagger.
6. Integrate frontend with backend.
7. Perform end-to-end testing.
8. Commit verified changes to Git.

No AI generated code was merged without manual review and testing.

---

# Sprint History

---

# Sprint 1

## Module

Employee Management

## Objective

Implement Employee CRUD module using FastAPI.

## Codex Prompt Summary

- Create SQLAlchemy model
- Create Pydantic schemas
- Repository
- Service
- Router
- Alembic migration
- Swagger endpoints

## AI Output

Generated:

- Employee model
- CRUD endpoints
- Validation schemas
- Migration
- Repository layer
- Service layer

## Manual Fixes

- Fixed PUT request validation.
- Corrected JSON payload issue.
- Verified PostgreSQL migration.

## Validation

- Swagger
- PostgreSQL
- CRUD tested successfully

---

# Sprint 2

## Module

Department Management

## Objective

Implement Department CRUD.

## AI Output

Generated:

- Department model
- Repository
- Service
- Router
- Migration

## Manual Fixes

- Verified relationships.
- Tested all CRUD operations.

## Validation

Swagger

---

# Sprint 3

## Module

Team & Project Management

## Objective

Implement:

- Team CRUD
- Department-wise Teams
- Project CRUD

## AI Output

Generated:

- Team module
- Project module
- API endpoints
- Repository layer
- Services

## Manual Fixes

- Validated foreign key relationships.
- Verified Department → Team mapping.

## Validation

Swagger

PostgreSQL

---

# Sprint 4

## Module

Project Assignment & Seat Allocation

## Objective

Implement business workflows.

## AI Output

Generated

- Project Assignment
- Seat Allocation
- Release Seat
- Employee Seat Lookup

## Manual Fixes

- Verified allocation workflow.
- Tested release and re-allocation.
- Validated business rules.

## Validation

Swagger

Frontend

End-to-End Testing

---

# Sprint 5

## Module

Dashboard Analytics

## Objective

Generate dashboard summary endpoint.

## AI Output

Generated dashboard service containing:

- Employee count
- Seat statistics
- Utilization
- Active projects
- New joiners
- Floor statistics
- Team statistics

## Manual Fixes

- Connected dashboard to frontend.
- Corrected CORS configuration.

## Validation

Swagger

Frontend Dashboard

---

# Sprint 6

## Module

Frontend Application

## Objective

Develop complete frontend using Next.js.

---

## Sprint 6.1

Frontend Foundation

Generated

- App Layout
- Sidebar
- Navbar
- React Query Provider
- Axios Service
- Route Structure

Validation

Frontend build

---

## Sprint 6.2

Dashboard Integration

Generated

- Dashboard hooks
- Dashboard services
- Dashboard cards
- Loading states

Manual Fixes

Resolved CORS issue.

Validation

Dashboard loaded successfully.

---

## Sprint 6.3

Master Modules

Generated

- Employees
- Departments
- Teams
- Projects
- Floors
- Zones
- Seats

Features

- Tables
- Forms
- Search
- Create
- Update

Manual Fixes

Resolved Employee form validation issue.

Validation

CRUD verified.

---

## Sprint 6.4

Business Workflow Modules

Generated

- Project Assignments
- Seat Allocations

Features

- Assignment
- Seat Allocation
- Seat Release
- React Query cache invalidation

Validation

End-to-End tested.

---

## Sprint 6.5

UI Improvements

Generated

- Better tables
- Skeleton loaders
- Empty states
- Error states
- Responsive layout
- Improved forms
- Toast notifications
- Better spacing

Validation

Frontend tested.

---

# Sprint 7

## Module

AI Assistant

## Objective

Implement Natural Language Query Interface.

## AI Output

Generated

Backend

- AI Router
- AI Service
- Prompt orchestration
- Intent classification
- Existing service integration

Frontend

- Chat interface
- Loading state
- Error handling
- AI service layer

## Manual Fixes

Configured OpenAI API integration.

Verified endpoint.

## Validation

Verified backend implementation.

Note:

The OpenAI API requires a funded API key with available credits.

The implementation is complete but responses depend on API availability.

---

# Major Manual Fixes

During development the following issues were manually resolved:

- Fixed PUT JSON validation.
- Fixed malformed request payloads.
- Corrected Employee validation schema.
- Fixed CORS configuration.
- Connected dashboard to live APIs.
- Verified React Query cache invalidation.
- Tested seat allocation rules.
- Tested release workflow.
- Corrected frontend API integration.
- Verified Alembic migrations.
- Configured OpenAI environment variables.

---

# Validation Methods

Each completed sprint was validated using:

Backend

- Swagger UI
- PostgreSQL
- Alembic migrations

Frontend

- React UI
- CRUD operations
- Search
- Dashboard
- Business workflows

End-to-End

- Employee creation
- Project assignment
- Seat allocation
- Seat release
- Dashboard updates

---

# AI Usage Philosophy

Artificial Intelligence was used to accelerate development while maintaining engineering quality.

All AI-generated code was:

- Reviewed manually.
- Tested before merging.
- Debugged where necessary.
- Validated against project requirements.
- Integrated incrementally through sprint-based development.

The final implementation reflects manual engineering decisions, testing, debugging, and validation in addition to AI-assisted code generation.

---

# Supporting Files

Codex prompt history is included separately as:

```
codex_export.zip
```

Additional architectural planning, debugging assistance, and implementation reviews were performed using ChatGPT throughout the project lifecycle.