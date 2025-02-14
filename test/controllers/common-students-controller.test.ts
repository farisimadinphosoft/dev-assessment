import { Request, Response } from "express";
import { HttpStatusCode } from "axios";

import { getCommonStudentsController } from "../../controllers/common-students-controller";
import { getCommonStudentsService } from "../../services/teacher-student-service";
import { NotFoundError } from "../../errors";

jest.mock("../../services/teacher-student-service");

describe("getCommonStudentsController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      query: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };

    jest.clearAllMocks();
  });

  it("should return 400 if no teacher email is provided", async () => {
    req.query = { teacher: undefined };

    await getCommonStudentsController(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.BadRequest);
    expect(res.send).toHaveBeenCalledWith({ message: "At least one teacher is required" });
  });

  it("should call getCommonStudentsService with the correct teacher emails", async () => {
    req.query = { teacher: ["teacher1@email.com", "teacher2@email.com"] };

    (getCommonStudentsService as jest.Mock).mockResolvedValue(["student1@email.com"]);

    await getCommonStudentsController(req as Request, res as Response);

    expect(getCommonStudentsService).toHaveBeenCalledWith(["teacher1@email.com", "teacher2@email.com"]);
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.Ok);
    expect(res.json).toHaveBeenCalledWith({ students: ["student1@email.com"] });
  });

  it("should return 404 if a teacher is not found", async () => {
    req.query = { teacher: "teacher1@email.com" };
    (getCommonStudentsService as jest.Mock).mockRejectedValue(new NotFoundError("Teacher not found"));

    await getCommonStudentsController(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.NotFound);
    expect(res.send).toHaveBeenCalledWith({ message: "Teacher not found" });
  });

  it("should return 500 for unexpected error", async () => {
    req.query = { teacher: "teacher1@email.com" };
    (getCommonStudentsService as jest.Mock).mockRejectedValue(new Error("Unexpected error"));

    await getCommonStudentsController(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.InternalServerError);
    expect(res.send).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});