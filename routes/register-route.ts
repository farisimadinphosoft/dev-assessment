import { Router } from "express";
import asyncHandler from "express-async-handler";
import { registerStudentsController } from "../controllers/register-controller";

const registerRoutes = Router();

registerRoutes.post("/register", asyncHandler(registerStudentsController));

export default registerRoutes;
