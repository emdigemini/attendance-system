import express from "express";
import { newSubject, deleteSubject, updateSubject, getMySubject, getAllSubject, getClassForSubject, getSubjectForAttendance, getStudentsForAttendance } from "../controller/subjects/subjectController.js";

const router = express.Router();

router.post("/add-subject/:id", newSubject);
router.delete("/delete-subject/:id", deleteSubject);
router.put("/edit-subject/:id", updateSubject);
router.get("/all-subject/:id/my-subject", getMySubject);
router.get("/all-subject", getAllSubject);
router.post("/generate-class/:id", getClassForSubject);
router.get("/all-subject/:id/attendance", getSubjectForAttendance);
router.get("/attendance/:id", getStudentsForAttendance);

export default router