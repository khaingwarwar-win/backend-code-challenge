import { z } from "zod";
import { taskStatuses } from "./types.js";

const title = z.string().trim().min(1).max(200);
const description = z.string().trim().max(2_000).nullable();
const status = z.enum(taskStatuses);

export const createTaskSchema = z.object({
  title,
  description: description.optional(),
  status: status.optional()
}).strict();

export const updateTaskSchema = z.object({
  title: title.optional(),
  description: description.optional(),
  status: status.optional()
}).strict().refine((value) => Object.keys(value).length > 0, {
  message: "At least one field must be provided"
});

export const listTasksSchema = z.object({
  status: status.optional(),
  search: z.string().trim().max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10)
});

export const taskParamsSchema = z.object({
  id: z.string().uuid()
});
