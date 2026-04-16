import express from "express";
import { checkAttendance, newAttendance, getAttRate, getAttLeader } from "../controller/attendance/attendanceController.js";

const router = express.Router();

router.post("/new-attendance/:id", newAttendance);
router.post("/check-attendance", checkAttendance);
router.post("/attendance-rate", getAttRate);
router.get("/attendance-leaderboard", getAttLeader);

export default router