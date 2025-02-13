import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "axios";

import { suspendStudentService } from "../../services/teacher-student-service";
import { suspendStudentController } from "../../controllers/suspend-student-controller";

jest.mock("../../services/teacher-student-service");

describe("suspendStudentController", () => {
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

  it("should return 400 if no student email is provided", async () => {
    await suspendStudentController(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.BadRequest);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid input. Please provide a student email.",
    });
  });

  it("should call suspendStudentController with the correct teacher and students", async () => {
    req.body = { student: "student3@gmail.com" };

    await suspendStudentController(req as Request, res as Response, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.NoContent);
  });

  it("should call next(error) if suspendStudentService throws an error", async () => {
    req.body = { student: "student3@gmail.com" };
    const error = new Error("Something went wrong");
    (suspendStudentService as jest.Mock).mockRejectedValue(error);

    await suspendStudentController(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});