const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "test_db",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
  },
  test: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "test_db",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "test_db",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
  },
};
