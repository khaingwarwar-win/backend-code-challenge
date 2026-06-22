import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/errors.js";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: { message: "Validation failed", details: err.flatten() }
    });
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
