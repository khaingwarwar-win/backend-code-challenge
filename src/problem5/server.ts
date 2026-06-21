import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 3000);
const databaseFile = process.env.DATABASE_FILE ?? "tasks.db";
const { app, database } = createApp({ databaseFile });

const server = app.listen(port, () => {
  console.log(`Task API listening on http://localhost:${port}`);
});

function shutdown() {
  server.close(() => {
    database.close();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

