import dotenv from "dotenv";
import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import Teacher from "../models/teacher";
import Student from "../models/student";
import TeacherStudent from "../models/teacher-student";

dotenv.config();

const DB_HOST: string = process.env.DB_HOST || "127.0.0.1";
const DB_PORT: number = Number(process.env.DB_PORT) || 3000;
const DB_PASSWORD: string = process.env.DB_PASSWORD || "";
const DB_USERNAME: string = process.env.DB_USERNAME || "";
const DB_NAME: string = process.env.DB_NAME || "";

const dbConfig: SequelizeOptions = {
  dialect: "mysql",
  host: DB_HOST,
  port: DB_PORT,
  password: DB_PASSWORD,
  username: DB_USERNAME,
  database: DB_NAME,
  models: [Teacher, Student, TeacherStudent]
};

export const sequelize = new Sequelize(dbConfig);

export const initDb = async () => {
  try {
    await sequelize.authenticate().then(() => {
      console.log("Database connected successfully");
    });
  } catch (err) {
    console.error("Unable to connect to the employment database:", err);
    throw err;
  }
};