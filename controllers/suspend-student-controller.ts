import { NextFunction, Request, Response } from "express";
import { SuspendRequest } from "../types/suspend-request";
import { HttpStatusCode } from "axios";
import { suspendStudentService } from "../services/teacher-student-service";

export const suspendStudentController = async (
  req: Request<{}, {}, SuspendRequest>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { student } = req.body;

    if (!student) {
      res.status(HttpStatusCode.BadRequest).json({
        message: "Invalid input. Please provide a student email."
      });
      return;
    }

    await suspendStudentService(student);

    res.status(HttpStatusCode.NoContent).send();
  } catch (error) {
    next(error);
  }
};