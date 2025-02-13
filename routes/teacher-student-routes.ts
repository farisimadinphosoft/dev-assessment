import { Router } from "express";
import asyncHandler from "express-async-handler";
import { registerStudentsController } from "../controllers/register-controller";
import { getCommonStudentsController } from "../controllers/common-students-controller";
import { suspendStudentController } from "../controllers/suspend-student-controller";
import { retrieveForNotificationsController } from "../controllers/retrieve-for-notifications-controller";

const TeacherStudentRoutes = Router();

TeacherStudentRoutes.post("/register", asyncHandler(registerStudentsController));
TeacherStudentRoutes.get("/commonstudents", asyncHandler(getCommonStudentsController));
TeacherStudentRoutes.post("/suspend", asyncHandler(suspendStudentController));
TeacherStudentRoutes.post("/retrievefornotifications", asyncHandler(retrieveForNotificationsController));

export default TeacherStudentRoutes;
