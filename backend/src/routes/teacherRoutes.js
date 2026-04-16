import express from "express";
import { updateTeacherInfo } from "../controller/accounts/teacherController.js";

const router = express.Router();

router.put("/update-info/:id", updateTeacherInfo);

export default router