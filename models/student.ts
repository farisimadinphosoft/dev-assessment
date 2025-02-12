import { Table, Column, Model, DataType, CreatedAt } from "sequelize-typescript";
import { v4 } from "uuid";
import { StudentStatus } from "../types/student-status";

@Table({ tableName: "students", timestamps: true })
export default class Student extends Model<Student> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: v4
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  })
  declare email: string;

  @CreatedAt
  @Column(DataType.DATE)
  updatedAt?: any;

  @Column({
    type: DataType.ENUM(StudentStatus.ACTIVE, StudentStatus.SUSPENDED),
    allowNull: false,
    defaultValue: StudentStatus.ACTIVE
  })
  declare status: string;
}
