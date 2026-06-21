import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createApp } from "./app.js";

let testContext: ReturnType<typeof createApp>;

beforeEach(() => {
  testContext = createApp();
});

afterEach(() => {
  testContext.database.close();
});

describe("Task API", () => {
  it("reports service health", async () => {
    const response = await request(testContext.app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("creates, reads, updates, and deletes a task", async () => {
    const createResponse = await request(testContext.app)
      .post("/tasks")
      .send({ title: "Build API", description: "Use SQLite" });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.data).toMatchObject({
      title: "Build API",
      description: "Use SQLite",
      status: "todo"
    });

    const taskId = createResponse.body.data.id as string;

    const getResponse = await request(testContext.app).get(`/tasks/${taskId}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.data.id).toBe(taskId);

    const updateResponse = await request(testContext.app)
      .patch(`/tasks/${taskId}`)
      .send({ status: "done" });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data.status).toBe("done");

    const deleteResponse = await request(testContext.app).delete(
      `/tasks/${taskId}`
    );
    expect(deleteResponse.status).toBe(204);

    const missingResponse = await request(testContext.app).get(
      `/tasks/${taskId}`
    );
    expect(missingResponse.status).toBe(404);
  });

  it("filters and paginates tasks", async () => {
    await request(testContext.app)
      .post("/tasks")
      .send({ title: "Write tests", status: "todo" });
    await request(testContext.app)
      .post("/tasks")
      .send({ title: "Deploy API", status: "done" });

    const response = await request(testContext.app).get(
      "/tasks?status=done&search=deploy&page=1&pageSize=5"
    );

    expect(response.status).toBe(200);
    expect(response.body.data.items).toHaveLength(1);
    expect(response.body.data.items[0].title).toBe("Deploy API");
    expect(response.body.data).toMatchObject({
      total: 1,
      page: 1,
      pageSize: 5,
      totalPages: 1
    });
  });

  it("can clear a task description", async () => {
    const created = await request(testContext.app)
      .post("/tasks")
      .send({ title: "Has description", description: "some text" });
    const taskId = created.body.data.id as string;

    const cleared = await request(testContext.app)
      .patch(`/tasks/${taskId}`)
      .send({ description: null });
    expect(cleared.status).toBe(200);
    expect(cleared.body.data.description).toBeNull();
  });

  it("rejects invalid input", async () => {
    const createResponse = await request(testContext.app)
      .post("/tasks")
      .send({ title: "", status: "unknown" });
    expect(createResponse.status).toBe(400);

    const listResponse = await request(testContext.app).get(
      "/tasks?page=0&pageSize=101"
    );
    expect(listResponse.status).toBe(400);
  });
});
