import { Column, DataType, Model, Table } from "sequelize-typescript";
import { v4 } from "uuid";

@Table({ tableName: "teachers", timestamps: true })
export default class Teacher extends Model<Teacher> {
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