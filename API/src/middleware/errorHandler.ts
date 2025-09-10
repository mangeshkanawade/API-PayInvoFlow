import { NextFunction, Request, Response } from "express";
import { ApiError } from "../dtos/apiError";

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: err.message,
      success: false,
      message: err.message,
    });
  }

  res.status(500).json({
    error: err.message,
    success: false,
    message: "Something went wrong",
  });
};
