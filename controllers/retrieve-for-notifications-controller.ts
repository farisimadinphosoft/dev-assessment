import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "axios";
import { RetrieveForNotificationsRequest } from "../types";
import { retrieveForNotificationsService } from "../services/teacher-student-service";

export const retrieveForNotificationsController = async (
  req: Request<{}, {}, RetrieveForNotificationsRequest>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { teacher, notification } = req.body;

    if (!teacher) {
      res.status(HttpStatusCode.BadRequest).json({
        message: "Invalid input. Please provide a teacher email."
      });
      return;
    }

    if (!notification) {
      res.status(HttpStatusCode.BadRequest).json({
        message: "Invalid input. Please provide a notification message."
      });
      return;
    }

    const recipients = await retrieveForNotificationsService(teacher, notification);

    res.status(HttpStatusCode.Ok).send(recipients);
  } catch (error) {
    next(error);
  }
};