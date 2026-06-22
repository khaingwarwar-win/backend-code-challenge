import cors from "cors";
import express from "express";
import helmet from "helmet";
import { createDatabase } from "./config/database.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import { TaskRepository } from "./repositories/taskRepository.js";
import { createHealthRouter } from "./routes/healthRoutes.js";
import { createTaskRouter } from "./routes/taskRoutes.js";
import { TaskService } from "./services/taskService.js";

interface CreateAppOptions {
  databaseFile?: string;
}

export function createApp(options: CreateAppOptions = {}) {
  const db = createDatabase(options.databaseFile ?? ":memory:");
  const taskRepository = new TaskRepository(db);
  const taskService = new TaskService(taskRepository);
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "32kb" }));

  app.use(createHealthRouter());
  app.use(createTaskRouter(taskService));
  app.use(notFound);
  app.use(errorHandler);

  return { app, database: db };
}
