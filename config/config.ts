import dotenv from "dotenv";
import { SequelizeOptions } from "sequelize-typescript";

dotenv.config();

const DB_HOST: string = process.env.DB_HOST || "127.0.0.1";
const DB_PORT: number = Number(process.env.DB_PORT) || 3306;
const DB_USERNAME: string = process.env.DB_USERNAME || "root";
const DB_PASSWORD: string = process.env.DB_PASSWORD || "";
const DB_NAME: string = process.env.DB_NAME || "your_database_name";

const config: Record<string, SequelizeOptions> = {
  development: {
    dialect: "mysql",
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
  },
  test: {
    dialect: "mysql",
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: `${DB_NAME}_test`,
  },
  production: {
    dialect: "mysql",
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
  },
};

export default config;
