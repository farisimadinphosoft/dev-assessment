import { Table, Column, ForeignKey, Model, PrimaryKey, Default, CreatedAt, BelongsTo } from "sequelize-typescript";
import { DataType } from "sequelize-typescript";
import Teacher from "./teacher";
import Student from "./student";
import { v4 } from "uuid";

@Table({
  tableName: "teacher_students",
  timestamps: false,
})
class TeacherStudent extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: v4
  })
  id!: string;

  @ForeignKey(() => Teacher)
  @Column(DataType.UUID)
  teacherId!: string;

  @ForeignKey(() => Student)
  @Column(DataType.UUID)
  studentId!: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: any;

  @CreatedAt
  @Column(DataType.DATE)
  updatedAt?: any;

  @BelongsTo(() => Student)
  student!: Student;
}

export default TeacherStudent;
