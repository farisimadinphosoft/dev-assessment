import { sequelize } from "../config/db-connection";
import { NotFoundError } from "../errors";
import Student from "../models/student";
import Teacher from "../models/teacher";
import TeacherStudent from "../models/teacher-student";

export const registerStudentsService = async (teacherEmail: string, studentEmails: string[]): Promise<void> => {
  if (!teacherEmail || !studentEmails || !Array.isArray(studentEmails)) {
    throw new Error("Invalid input");
  }

  const transaction = await sequelize.transaction();

  try {
    const teacher = await Teacher.findOne({
      where: {
        email: teacherEmail
      },
      transaction
    });

    if (!teacher) {
      throw new NotFoundError(`Teacher with email ${teacherEmail} not found.`);
    }

    const students = await Promise.all(
      studentEmails.map(async (eachEmail: string) => {
        const student = await Student.findOne({
          where: {
            email: eachEmail
          },
          transaction
        });

        if (!student) {
          throw new NotFoundError(`Student with email ${eachEmail} not found.`);
        }

        return student;
      })
    );

    await Promise.all(
      students.map(async (student: Student) => {
        const existingRelation = await TeacherStudent.findOne({
          where: {
            teacherId: teacher.id,
            studentId: student.id
          },
          transaction
        });

        if (!existingRelation) {
          await TeacherStudent.create(
            { teacherId: teacher.id, studentId: student.id },
            { transaction }
          );
        }
      })
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const getCommonStudentsService = async (teacherEmails: string[]): Promise<string[]> => {
  if (!teacherEmails || teacherEmails.length < 1) {
    throw new Error("At least one teacher email is required");
  }

  const teachers = await Teacher.findAll({
    where: {
      email: teacherEmails
    }
  });

  const foundEmails = teachers.map(teacher => teacher.email);
  const notFoundEmails = teacherEmails.filter(email => !foundEmails.includes(email));

  if (notFoundEmails.length > 0) {
    throw new NotFoundError(`The following teacher(s) were not found: ${notFoundEmails.join(', ')}`);
  }

  const studentLists = await Promise.all(
    teachers.map(async (teacher) => {
      const students = await TeacherStudent.findAll({
        where: { teacherId: teacher.id },
        include: [{ model: Student, attributes: ['email'] }]
      });

      return students.map((entry) => entry.student.email);
    })
  );

  const commonStudents = studentLists.reduce((acc, currList) => {
    return acc.filter((email) => currList.includes(email));
  });

  return commonStudents;
};

