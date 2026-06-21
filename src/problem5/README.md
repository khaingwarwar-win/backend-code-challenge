# Problem 5 – Task CRUD API

REST API built with Express 5 and TypeScript, backed by SQLite.

## Stack

- Express 5, Zod for request validation
- `better-sqlite3` for persistence
- Vitest + Supertest for integration tests
- Helmet + CORS middleware

## Running

```bash
npm install
npm start
```

Starts at `http://localhost:3000`. Override with environment variables:

```bash
PORT=4000 DATABASE_FILE=my.db npm start
```

## Endpoints

- `GET /health`
- `POST /tasks`
- `GET /tasks` — optional query params: `status`, `search`, `page`, `pageSize`
- `GET /tasks/:id`
- `PATCH /tasks/:id` — partial update, at least one field required
- `DELETE /tasks/:id`

Task shape:

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string | null",
  "status": "todo | in_progress | done",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

Errors come back as `{ "error": { "message": "..." } }`. Validation errors include a `details` field.

## Quick example

```bash
# create
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Ship it","status":"in_progress"}'

# list with filters
curl "http://localhost:3000/tasks?status=in_progress&search=ship&page=1&pageSize=10"
```

## Tests

```bash
npm run test:problem5
```

Integration tests use an in-memory SQLite database so no setup is needed.
