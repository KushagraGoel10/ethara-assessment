# Deployment Notes

## Frontend

Platform

- Vercel

Framework

- Next.js (App Router)

Environment Variables

```
NEXT_PUBLIC_API_URL=<Backend URL>/api/v1
```

---

## Backend

Platform

- Render / Railway

Framework

- FastAPI

Command

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Environment Variables

```
DATABASE_URL=

OPENAI_API_KEY=
```

---

## Database

Platform

- PostgreSQL

Migration

```bash
alembic upgrade head
```

---

## API Documentation

Swagger

```
<Backend URL>/docs
```

---

## Notes

- CORS configured for frontend origin.
- Alembic migrations executed before deployment.
- React frontend consumes FastAPI REST APIs.
- AI Assistant requires a valid OpenAI API key with available API credits.