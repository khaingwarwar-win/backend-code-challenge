# Backend Code Challenge

TypeScript backend take-home assignment.

## Implemented problems

- [`src/problem4`](src/problem4): three TypeScript implementations of `sum_to_n`, with complexity notes and tests.
- [`src/problem5`](src/problem5): Express + TypeScript CRUD API backed by SQLite, with validation, filtering, repository-based persistence, and integration tests.
- [`src/problem6`](src/problem6): implementation-ready architecture specification for a secure live top-10 scoreboard, with architecture and execution-flow diagrams.

## Requirements

- Node.js 20.19 or newer
- npm

## Setup and verification

```bash
npm install
npm run build
npm test
```

## Run Problem 5

```bash
npm start
```

The server listens on `http://localhost:3000` by default. Set `PORT` or `DATABASE_FILE` to override the defaults.
