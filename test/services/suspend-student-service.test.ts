import Student from "../../models/student";
import { sequelize } from "../../config/db-connection";
import { NotFoundError } from "../../errors";
import { StudentStatus } from "../../types";
import { suspendStudentService } from "../../services/teacher-student-service";

// Mock dependencies
jest.mock("../../models/student");
jest.mock("../../config/db-connection", () => ({
  sequelize: {
    transaction: jest.fn().mockReturnValue({
      commit: jest.fn(),
      rollback: jest.fn(),
    }),
  },
}));

describe("suspendStudentService", () => {
  const mockTransaction = {
    commit: jest.fn(),
    rollback: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (sequelize.transaction as jest.Mock).mockReturnValue(mockTransaction);
  });

  test("should throw an error if studentEmail is missing", async () => {
    await expect(suspendStudentService("")).rejects.toThrow("Invalid input");
  });

  test("should throw NotFoundError if student does not exist", async () => {
    (Student.findOne as jest.Mock).mockResolvedValue(null);

    await expect(suspendStudentService("student@email.com")).rejects.toThrow(
      new NotFoundError("Student with email student@email.com not found.")
    );

    expect(Student.findOne).toHaveBeenCalledWith({
      where: { email: "student@email.com" },
      transaction: mockTransaction,
    });

    expect(mockTransaction.rollback).toHaveBeenCalled();
  });

  test("should throw an error if student is already suspended", async () => {
    (Student.findOne as jest.Mock).mockResolvedValue({
      email: "student@email.com",
      status: StudentStatus.SUSPENDED,
    });

    await expect(suspendStudentService("student@email.com")).rejects.toThrow(
      "Student was already suspended"
    );

    expect(mockTransaction.rollback).toHaveBeenCalled();
  });

  test("should update student status and commit transaction", async () => {
    const mockStudent = {
      email: "student@email.com",
      status: StudentStatus.ACTIVE,
      update: jest.fn(),
    };

    (Student.findOne as jest.Mock).mockResolvedValue(mockStudent);

    await suspendStudentService("student@email.com");

    expect(mockStudent.update).toHaveBeenCalledWith(
      { status: StudentStatus.SUSPENDED, updatedAt: expect.any(Date) },
      { transaction: mockTransaction }
    );

    expect(mockTransaction.commit).toHaveBeenCalled();
  });

  test("should rollback transaction if update fails", async () => {
    const mockStudent = {
      email: "student@email.com",
      status: StudentStatus.ACTIVE,
      update: jest.fn().mockRejectedValue(new Error("DB update failed")),
    };

    (Student.findOne as jest.Mock).mockResolvedValue(mockStudent);

    await expect(suspendStudentService("student@email.com")).rejects.toThrow(
      "DB update failed"
    );

    expect(mockTransaction.rollback).toHaveBeenCalled();
  });
});
