# Backend Code Challenge

TypeScript backend take-home assignment.

## Implemented problems

- [`src/problem4`](src/problem4): three TypeScript implementations of `sum_to_n`, with complexity notes and tests.
- [`src/problem5`](src/problem5): Express + TypeScript CRUD API backed by SQLite, with validation, filtering, repository-based persistence, and integration tests.

## Requirements

- Node.js 20.19 or newer
- npm

## Setup and verification

```bash
npm install
npm run build
npm run test:problem4
npm run test:problem5
```

## Run Problem 5

```bash
npm start
```

The server listens on `http://localhost:3000` by default. Set `PORT` or `DATABASE_FILE` to override the defaults.
