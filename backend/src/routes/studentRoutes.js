import express from "express";
import { updateStudentInfo, addSubjectForStudent, removeSubjectForStudent, getStudentSubject, getStudentInfo } from "../controller/accounts/studentController.js";

const router = express.Router();

router.put("/update-info/:id", updateStudentInfo);
router.get("/student-info/:id", getStudentInfo); 
router.get("/student-subject/:id", getStudentSubject);
router.put("/add-subject/:id", addSubjectForStudent);
router.patch("/remove-subject/:id", removeSubjectForStudent);

export default router