import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "axios";

import { retrieveForNotificationsService } from "../../services/teacher-student-service";
import { retrieveForNotificationsController } from "../../controllers/retrieve-for-notifications-controller";

jest.mock("../../services/teacher-student-service");

describe("retrieveForNotificationsController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      body: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  it("should return 400 if no teacher email is provided", async () => {
    req.body = { notification: "Test notification @student1@gmail.com @student2@gmail.com @student3@gmail.com" };

    await retrieveForNotificationsController(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.BadRequest);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid input. Please provide a teacher email.",
    });
  });

  it("should return 400 if no notification message is provided", async () => {
    req.body = { teacher: "teacher1@gmail.com" };

    await retrieveForNotificationsController(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.BadRequest);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid input. Please provide a notification message.",
    });
  });

  it("should call retrieveForNotificationsController with the correct teacher and students", async () => {
    req.body = { teacher: "teacher1@gmail.com", notification: "Test notification @student1@gmail.com @student2@gmail.com @student3@gmail.com" };

    await retrieveForNotificationsController(req as Request, res as Response, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.Ok);
  });

  it("should call next(error) if retrieveForNotificationsService throws an error", async () => {
    req.body = { teacher: "teacher1@gmail.com", notification: "Test notification @student1@gmail.com @student2@gmail.com @student3@gmail.com" };
    const error = new Error("Something went wrong");
    (retrieveForNotificationsService as jest.Mock).mockRejectedValue(error);

    await retrieveForNotificationsController(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});