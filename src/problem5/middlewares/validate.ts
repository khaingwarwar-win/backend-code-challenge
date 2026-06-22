import type { RequestHandler } from "express";
import type { ZodType } from "zod";

export function validate<T>(
  schema: ZodType<T>,
  source: "body" | "query" | "params"
): RequestHandler {
  return (req, res, next) => {
    try {
      res.locals[source] = schema.parse(req[source]);
      next();
    } catch (err) {
      next(err);
    }
  };
}
