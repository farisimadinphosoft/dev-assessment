import Teacher from "../../models/teacher";
import Student from "../../models/student";
import TeacherStudent from "../../models/teacher-student";
import { NotFoundError } from "../../errors";
import { registerStudentsService } from "../../services/teacher-student-service";

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

describe("registerStudentsService", () => {
  const teacherEmail: string = "teacherken@gmail.com";
  const studentEmails: string[] = ["studentagnes@gmail.com", "studentmiche@gmail.com"];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if input is invalid", async () => {
    await expect(registerStudentsService("", studentEmails)).rejects.toThrow(
      new Error("Invalid input")
    );

    await expect(registerStudentsService(teacherEmail, null as unknown as string[])).rejects.toThrow(
      new Error("Invalid input")
    );

    await expect(registerStudentsService(teacherEmail, "invalid" as unknown as string[])).rejects.toThrow(
      new Error("Invalid input")
    );

    await expect(registerStudentsService(null as unknown as string, studentEmails)).rejects.toThrow(
      new Error("Invalid input")
    );
  });

  it("should register students to a teacher", async () => {
    (Teacher.findOne as jest.Mock).mockResolvedValue({ id: "teacher-id" });
    (Student.findOne as jest.Mock)
      .mockImplementationOnce(() => Promise.resolve({ id: "student1-id" }))
      .mockImplementationOnce(() => Promise.resolve({ id: "student2-id" }));

    (TeacherStudent.findOne as jest.Mock).mockResolvedValue(null);
    (TeacherStudent.create as jest.Mock).mockResolvedValue(null);

    await expect(registerStudentsService(teacherEmail, studentEmails)).resolves.toBeUndefined();

    expect(Teacher.findOne).toHaveBeenCalledWith({
      where: { email: teacherEmail },
      transaction: expect.any(Object),
    });
    expect(Student.findOne).toHaveBeenCalledTimes(2);
    expect(TeacherStudent.create).toHaveBeenCalledTimes(2);
  });

  it("should throw an error if teacher is not found", async () => {
    (Teacher.findOne as jest.Mock).mockResolvedValue(null);

    await expect(registerStudentsService(teacherEmail, studentEmails)).rejects.toThrow(
      new NotFoundError(`Teacher with email ${teacherEmail} not found.`)
    );
  });

  it("should throw an error if a student is not found", async () => {
    (Teacher.findOne as jest.Mock).mockResolvedValue({ id: "teacher-id" });
    (Student.findOne as jest.Mock)
      .mockImplementationOnce(() => Promise.resolve({ id: "student1-id" }))
      .mockImplementationOnce(() => Promise.resolve(null));

    await expect(registerStudentsService(teacherEmail, studentEmails)).rejects.toThrow(
      new NotFoundError(`Student with email studentmiche@gmail.com not found.`)
    );
  });

  it("should not create duplicate relationships", async () => {
    (Teacher.findOne as jest.Mock).mockResolvedValue({ id: "teacher-id" });
    (Student.findOne as jest.Mock)
      .mockImplementationOnce(() => Promise.resolve({ id: "student1-id" }))
      .mockImplementationOnce(() => Promise.resolve({ id: "student2-id" }));

    (TeacherStudent.findOne as jest.Mock).mockResolvedValue({ id: "existing-relation-id" });

    await expect(registerStudentsService(teacherEmail, studentEmails)).resolves.toBeUndefined();

    expect(TeacherStudent.create).not.toHaveBeenCalled();
  });
});
