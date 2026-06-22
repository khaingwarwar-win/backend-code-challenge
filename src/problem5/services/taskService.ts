import { TaskRepository } from "../repositories/taskRepository.js";
import type {
  CreateTaskInput,
  Task,
  TaskFilters,
  UpdateTaskInput
} from "../types.js";

export class TaskService {
  constructor(private readonly tasks: TaskRepository) {}

  create(input: CreateTaskInput): Task {
    return this.tasks.create(input);
  }

  list(filters: TaskFilters): {
    items: Task[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  } {
    return this.tasks.list(filters);
  }

  getById(id: string): Task {
    return this.tasks.getById(id);
  }

  update(id: string, input: UpdateTaskInput): Task {
    return this.tasks.update(id, input);
  }

  delete(id: string): void {
    this.tasks.delete(id);
  }
}
