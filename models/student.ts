import { Table, Column, Model, DataType } from "sequelize-typescript";
import { v4 } from "uuid";

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
}
