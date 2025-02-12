import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import registerRoutes from "../routes/register-route";
import { initDb } from "../config/db-connection";
import { HttpStatusCode } from "axios";
import { NotFoundError } from "../errors";

dotenv.config();
initDb();

const errorHandler: express.ErrorRequestHandler = (err, req, res, next): void => {
  if (err instanceof NotFoundError) {
    res.status(HttpStatusCode.NotFound).json({ message: err.message });
    return;
  }

  res.status(HttpStatusCode.BadRequest).json({
    message: err.message || "An unexpected error occurred",
  });
};

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api", registerRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
