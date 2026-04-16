import "dotenv/config";
import cookieParser from "cookie-parser";
import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import process from "process";
/* routes */
import accountRoutes from "./routes/accountRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import admin from "./routes/adminRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import clearCookie from "./routes/clearCookie.js";
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js"

const app = express();
const PORT = process.env.PORT || 5002;

process.setMaxListeners(23);
// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:5174", "http://localhost:5173", "http://192.168.1.5:5173"],
  credentials: true 
}))

// routes 
app.use("/api/accounts", accountRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/admins", admin);
app.use("/api/subjects", subjectRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/user", uploadRoutes);
app.use("/api", clearCookie);

( async () => {
  try {
    await connectDB();
    app.listen(PORT, '0.0.0.0', () => {
      console.log("Server started on PORT:", PORT);
    });
  } catch (err) {
    console.log("Server failed to start", err);
    process.exit(1);
  }
})();