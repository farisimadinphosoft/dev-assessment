import Teacher from "../../models/teacher";
import Student from "../../models/student";
import TeacherStudent from "../../models/teacher-student";
import { NotFoundError } from "../../errors";
import { retrieveForNotificationsService } from "../../services/teacher-student-service";

// Mock dependencies
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

describe("retrieveForNotificationsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should throw an error if teacherEmail or notification is missing", async () => {
    await expect(retrieveForNotificationsService("", "New message"))
      .rejects.toThrow("Invalid input");

    await expect(retrieveForNotificationsService("teacher@email.com", ""))
      .rejects.toThrow("Invalid input");
  });

  test("should throw NotFoundError if teacher does not exist", async () => {
    (Teacher.findOne as jest.Mock).mockResolvedValue(null);

    await expect(retrieveForNotificationsService("teacher@email.com", "Hello"))
      .rejects.toThrow(new NotFoundError("Teacher with email teacher@email.com not found."));

    expect(Teacher.findOne).toHaveBeenCalledWith({ where: { email: "teacher@email.com" } });
  });

  test("should extract mentioned student emails correctly", async () => {
    (Teacher.findOne as jest.Mock).mockResolvedValue({ id: "teacher-1" });
    (TeacherStudent.findAll as jest.Mock).mockResolvedValue([]);
    (Student.findAll as jest.Mock).mockResolvedValue([
      { email: "student1@email.com" },
      { email: "student2@email.com" }
    ]);

    const response = await retrieveForNotificationsService(
      "teacher@email.com",
      "Hello @student1@email.com @student2@email.com"
    );

    expect(response.recipients).toEqual(expect.arrayContaining(["student1@email.com", "student2@email.com"]));
  });

  test("should retrieve students registered under the teacher", async () => {
    (Teacher.findOne as jest.Mock).mockResolvedValue({ id: "teacher-1" });
    (TeacherStudent.findAll as jest.Mock).mockResolvedValue([
      { student: { email: "registered1@email.com" } },
      { student: { email: "registered2@email.com" } }
    ]);
    (Student.findAll as jest.Mock).mockResolvedValue([]);

    const response = await retrieveForNotificationsService("teacher@email.com", "Hello class!");

    expect(response.recipients).toEqual(expect.arrayContaining(["registered1@email.com", "registered2@email.com"]));
  });

  test("should return a unique list of student emails without duplicates", async () => {
    (Teacher.findOne as jest.Mock).mockResolvedValue({ id: "teacher-1" });
    (TeacherStudent.findAll as jest.Mock).mockResolvedValue([
      { student: { email: "registered@email.com" } }
    ]);
    (Student.findAll as jest.Mock).mockResolvedValue([
      { email: "mentioned@email.com" },
      { email: "registered@email.com" } // Duplicate email
    ]);

    const response = await retrieveForNotificationsService(
      "teacher@email.com",
      "Reminder @mentioned@email.com @registered@email.com"
    );

    expect(response.recipients).toEqual(["registered@email.com", "mentioned@email.com"]);
  });
});
