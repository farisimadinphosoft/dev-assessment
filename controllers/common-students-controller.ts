import { Request, Response } from "express";
import { getCommonStudentsService } from "../services/teacher-student-service";
import { HttpStatusCode } from "axios";
import { NotFoundError } from "../errors";

export const getCommonStudentsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const teacherEmails = Array.isArray(req.query.teacher)
      ? req.query.teacher.filter((t): t is string => typeof t === "string")
      : typeof req.query.teacher === "string"
        ? [req.query.teacher]
        : [];

    if (teacherEmails.length === 0) {
      res.status(HttpStatusCode.BadRequest).send({ message: "At least one teacher is required" });
      return;
    }

    const commonStudents = await getCommonStudentsService(teacherEmails);

    res.status(HttpStatusCode.Ok).json({ students: commonStudents });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(HttpStatusCode.NotFound).send({ message: error.message });
    } else {
      console.error(error);
      res.status(HttpStatusCode.InternalServerError).send({ message: "Internal server error" });
    }
  }
};
