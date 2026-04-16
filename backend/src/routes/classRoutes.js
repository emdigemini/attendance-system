import express from "express";
import { newClass, getClass, getRecentClass, deleteClass, joinClass, getStudentsFromClass, removeClassroom, getMyClass } from "../controller/classes/classController.js";

const router = express.Router();

router.post("/class-management", newClass);
router.get("/class-management", getClass);
router.get("/class-management/recent", getRecentClass);
router.delete("/class-management/:id", deleteClass);
router.post("/my-classroom/:id", joinClass);
router.get("/my-classroom/:id", getMyClass);
router.get("/class-students/:id", getStudentsFromClass);
router.patch("/my-classroom/:id/remove-student", removeClassroom);

export default router
