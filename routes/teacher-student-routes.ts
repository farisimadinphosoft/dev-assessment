import { Router } from "express";
import asyncHandler from "express-async-handler";
import { registerStudentsController } from "../controllers/register-controller";
import { getCommonStudentsController } from "../controllers/common-students-controller";

const TeacherStudentRoutes = Router();

TeacherStudentRoutes.post("/register", asyncHandler(registerStudentsController));
TeacherStudentRoutes.get("/commonstudents", asyncHandler(getCommonStudentsController))

export default TeacherStudentRoutes;
