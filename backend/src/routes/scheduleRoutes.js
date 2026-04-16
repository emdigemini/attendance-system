import express from "express";
import { newSchedule, getStudentSchedule, getTeacherSchedule, updateSchedule, deleteSchedule } from "../controller/schedule/scheduleController.js";

const router = express.Router();

router.post("/new-schedule/:id", newSchedule);
router.put("/edit-schedule/:id", updateSchedule);
router.delete("/delete-schedule/:id", deleteSchedule);
router.get("/student-schedule", getStudentSchedule);
router.get("/teacher-schedule/:id", getTeacherSchedule);

export default router