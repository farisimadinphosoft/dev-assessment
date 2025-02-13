import { Request, Response, NextFunction } from "express";
import { registerStudentsService } from "../services/teacher-student-service";
import { HttpStatusCode } from "axios";
import { RegisterRequestBody } from "../types";

export const registerStudentsController = async (
  req: Request<{}, {}, RegisterRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { teacher, students } = req.body;

    if (!teacher) {
      res.status(HttpStatusCode.BadRequest).json({
        message: "Invalid input. Please provide a teacher email.",
      });
      return;
    }

    if (!students || !Array.isArray(students) || !students.length) {
      res.status(HttpStatusCode.BadRequest).json({
        message: "Invalid input. Please provide an array of student emails.",
      });
      return;
    }

    await registerStudentsService(teacher, students);

    res.status(HttpStatusCode.NoContent).send();
  } catch (error) {
    next(error);
  }
};
