import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { TaskService } from "../services/taskService.js";
import {
  createTaskSchema,
  listTasksSchema,
  taskParamsSchema,
  updateTaskSchema
} from "../validation.js";

export function createTaskRouter(tasks: TaskService): Router {
  const router = Router();

  router.post("/tasks", validate(createTaskSchema, "body"), (_req, res) => {
    res.status(201).json({ data: tasks.create(res.locals.body) });
  });

  router.get("/tasks", validate(listTasksSchema, "query"), (_req, res) => {
    res.json({ data: tasks.list(res.locals.query) });
  });

  router.get("/tasks/:id", validate(taskParamsSchema, "params"), (_req, res) => {
    res.json({ data: tasks.getById(res.locals.params.id) });
  });

  router.patch(
    "/tasks/:id",
    validate(taskParamsSchema, "params"),
    validate(updateTaskSchema, "body"),
    (_req, res) => {
      res.json({ data: tasks.update(res.locals.params.id, res.locals.body) });
    }
  );

  router.delete("/tasks/:id", validate(taskParamsSchema, "params"), (_req, res) => {
    tasks.delete(res.locals.params.id);
    res.status(204).send();
  });

  return router;
}
