import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "axios";

import { registerStudentsController } from "../../controllers/register-controller";
import { registerStudentsService } from "../../services/teacher-student-service";

jest.mock("../../services/teacher-student-service");

describe("registerStudentsController", () => {
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
    req.body = { students: ['student1@gmail.com', 'student2@gmail.com'] };

    await registerStudentsController(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.BadRequest);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid input. Please provide a teacher email.",
    });
  });

  it("should return 400 if no array of student emails is provided", async () => {
    req.body = { teacher: "teacher1@gmail.com" };

    await registerStudentsController(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.BadRequest);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid input. Please provide an array of student emails.",
    });
  });

  it("should call registerStudentsController with the correct teacher and students", async () => {
    req.body = { teacher: "teacher1@gmail.com", students: ['student1@gmail.com', 'student2@gmail.com'] };

    await registerStudentsController(req as Request, res as Response, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.NoContent);
  });

  it("should call next(error) if registerStudentsService throws an error", async () => {
    req.body = { teacher: "teacher@gmail.com", students: ["student1@gmail.com"] };
    const error = new Error("Something went wrong");
    (registerStudentsService as jest.Mock).mockRejectedValue(error);

    await registerStudentsController(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});