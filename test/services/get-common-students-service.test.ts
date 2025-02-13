import Teacher from "../../models/teacher";
import TeacherStudent from "../../models/teacher-student";
import { NotFoundError } from "../../errors";
import { getCommonStudentsService } from "../../services/teacher-student-service";


jest.mock("../../models/teacher");
jest.mock("../../models/student");
jest.mock("../../models/teacher-student");
jest.mock("../../config/db-connection", () => ({
  sequelize: {
    transaction: jest.fn(() => ({
      commit: jest.fn(),
      rollback: jest.fn(),
    })),
  },
}));

describe("getCommonStudentsService", () => {
  const teacherEmails: string[] = ["teacher1@gmail.com", "teacher2@gmail.com"];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return common students for given teachers", async () => {
    (Teacher.findAll as jest.Mock).mockResolvedValue([
      { id: "teacher1-id", email: "teacher1@gmail.com" },
      { id: "teacher2-id", email: "teacher2@gmail.com" },
    ]);

    (TeacherStudent.findAll as jest.Mock)
      .mockImplementationOnce(() =>
        Promise.resolve([
          { student: { email: "student1@gmail.com" } },
          { student: { email: "student2@gmail.com" } },
        ])
      )
      .mockImplementationOnce(() =>
        Promise.resolve([
          { student: { email: "student2@gmail.com" } },
          { student: { email: "student3@gmail.com" } },
        ])
      );

    const result = await getCommonStudentsService(teacherEmails);
    expect(result).toEqual(["student2@gmail.com"]); // Only common student
  });

  it("should throw an error if no teacher emails are provided", async () => {
    await expect(getCommonStudentsService([])).rejects.toThrow(
      new Error("At least one teacher email is required")
    );
  });

  it("should throw an error if one or more teachers are not found", async () => {
    (Teacher.findAll as jest.Mock).mockResolvedValue([
      { id: "teacher1-id", email: "teacher1@gmail.com" }, // Found
    ]);

    await expect(getCommonStudentsService(teacherEmails)).rejects.toThrow(
      new NotFoundError("The following teacher(s) were not found: teacher2@gmail.com")
    );
  });

  it("should return an empty array if no common students exist", async () => {
    (Teacher.findAll as jest.Mock).mockResolvedValue([
      { id: "teacher1-id", email: "teacher1@gmail.com" },
      { id: "teacher2-id", email: "teacher2@gmail.com" },
    ]);

    (TeacherStudent.findAll as jest.Mock)
      .mockImplementationOnce(() =>
        Promise.resolve([{ student: { email: "student1@gmail.com" } }])
      )
      .mockImplementationOnce(() =>
        Promise.resolve([{ student: { email: "student2@gmail.com" } }])
      );

    const result = await getCommonStudentsService(teacherEmails);
    expect(result).toEqual([]); // No common students
  });
});
