import cors from "cors";
import express, {
  type ErrorRequestHandler,
  type RequestHandler
} from "express";
import helmet from "helmet";
import { ZodError, type ZodType } from "zod";
import { createDatabase } from "./database.js";
import { AppError } from "./errors.js";
import { TaskRepository } from "./taskRepository.js";
import {
  createTaskSchema,
  listTasksSchema,
  taskParamsSchema,
  updateTaskSchema
} from "./validation.js";

interface CreateAppOptions {
  databaseFile?: string;
}

// Parses and validates a request source, stores the result in res.locals, and calls next.
function validate<T>(schema: ZodType<T>, source: "body" | "query" | "params"): RequestHandler {
  return (req, res, next) => {
    try {
      res.locals[source] = schema.parse(req[source]);
      next();
    } catch (err) {
      next(err);
    }
  };
}

export function createApp(options: CreateAppOptions = {}) {
  const db = createDatabase(options.databaseFile ?? ":memory:");
  const tasks = new TaskRepository(db);
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "32kb" }));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/tasks", validate(createTaskSchema, "body"), (_req, res) => {
    res.status(201).json({ data: tasks.create(res.locals.body) });
  });

  app.get("/tasks", validate(listTasksSchema, "query"), (_req, res) => {
    res.json({ data: tasks.list(res.locals.query) });
  });

  app.get("/tasks/:id", validate(taskParamsSchema, "params"), (_req, res) => {
    res.json({ data: tasks.getById(res.locals.params.id) });
  });

  app.patch(
    "/tasks/:id",
    validate(taskParamsSchema, "params"),
    validate(updateTaskSchema, "body"),
    (_req, res) => {
      res.json({ data: tasks.update(res.locals.params.id, res.locals.body) });
    }
  );

  app.delete("/tasks/:id", validate(taskParamsSchema, "params"), (_req, res) => {
    tasks.delete(res.locals.params.id);
    res.status(204).send();
  });

  app.use((_req, res) => {
    res.status(404).json({ error: { message: "Route not found" } });
  });

  const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err instanceof ZodError) {
      res.status(400).json({ error: { message: "Validation failed", details: err.flatten() } });
      return;
    }
    if (err instanceof SyntaxError && "body" in err) {
      res.status(400).json({ error: { message: "Invalid JSON body" } });
      return;
    }
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ error: { message: err.message } });
      return;
    }
    console.error(err);
    res.status(500).json({ error: { message: "Internal server error" } });
  };

  app.use(errorHandler);

  return { app, database: db };
}
