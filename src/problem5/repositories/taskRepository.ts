import { randomUUID } from "node:crypto";
import type Database from "better-sqlite3";
import type {
  CreateTaskInput,
  Task,
  TaskFilters,
  TaskStatus,
  UpdateTaskInput
} from "../types.js";
import { NotFoundError } from "../utils/errors.js";

interface TaskRow {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

function mapTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export class TaskRepository {
  constructor(private readonly db: Database.Database) {}

  create(input: CreateTaskInput): Task {
    const now = new Date().toISOString();
    const task: Task = {
      id: randomUUID(),
      title: input.title,
      description: input.description ?? null,
      status: input.status ?? "todo",
      createdAt: now,
      updatedAt: now
    };

    this.db
      .prepare(
        `INSERT INTO tasks (id, title, description, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(task.id, task.title, task.description, task.status, task.createdAt, task.updatedAt);

    return task;
  }

  list(filters: TaskFilters): { items: Task[]; total: number; page: number; pageSize: number; totalPages: number } {
    const conditions: string[] = [];
    const params: Array<string | number> = [];

    if (filters.status) {
      conditions.push("status = ?");
      params.push(filters.status);
    }

    if (filters.search) {
      // COALESCE so LIKE works on rows where description is NULL
      conditions.push("(LOWER(title) LIKE ? OR LOWER(COALESCE(description, '')) LIKE ?)");
      const pattern = `%${filters.search.toLowerCase()}%`;
      params.push(pattern, pattern);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const offset = (filters.page - 1) * filters.pageSize;

    const rows = this.db
      .prepare(
        `SELECT id, title, description, status, created_at, updated_at
         FROM tasks ${where}
         ORDER BY created_at DESC, id ASC
         LIMIT ? OFFSET ?`
      )
      .all(...params, filters.pageSize, offset) as unknown as TaskRow[];

    const { total } = this.db
      .prepare(`SELECT COUNT(*) AS total FROM tasks ${where}`)
      .get(...params) as unknown as { total: number };

    return {
      items: rows.map(mapTask),
      total,
      page: filters.page,
      pageSize: filters.pageSize,
      totalPages: Math.ceil(total / filters.pageSize)
    };
  }

  getById(id: string): Task {
    const row = this.db
      .prepare(
        `SELECT id, title, description, status, created_at, updated_at
         FROM tasks WHERE id = ?`
      )
      .get(id) as unknown as TaskRow | undefined;

    if (!row) throw new NotFoundError();
    return mapTask(row);
  }

  update(id: string, input: UpdateTaskInput): Task {
    const existing = this.db
      .prepare(
        `SELECT id, title, description, status, created_at, updated_at
         FROM tasks WHERE id = ?`
      )
      .get(id) as unknown as TaskRow | undefined;

    if (!existing) throw new NotFoundError();

    const updated: Task = {
      ...mapTask(existing),
      title: input.title ?? existing.title,
      description: input.description === undefined ? existing.description : input.description,
      status: input.status ?? existing.status,
      updatedAt: new Date().toISOString()
    };

    this.db
      .prepare(
        `UPDATE tasks SET title = ?, description = ?, status = ?, updated_at = ?
         WHERE id = ?`
      )
      .run(updated.title, updated.description, updated.status, updated.updatedAt, id);

    return updated;
  }

  delete(id: string): void {
    const result = this.db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
    if (result.changes === 0) throw new NotFoundError();
  }
}
