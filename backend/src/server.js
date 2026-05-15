import "dotenv/config";
import cookieParser from "cookie-parser";
import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import process from "process";
import path from "path";
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
import rateLimiter from "./middleware/rateLimiter.js";
import authentication from "./middleware/authentication.js";

const app = express();
const PORT = process.env.PORT || 5002;
const __dirname = path.resolve();
const allowedOrigins = process.env.MY_LOCAL_HOST 
  ? process.env.MY_LOCAL_HOST.split(",") : [];

app.use(express.urlencoded({ extended: true }));

// middleware
app.use(express.json());
app.use(cookieParser());
if(process.env.NODE_ENV !== "production"){
  app.use(cors({
    origin: ["http://localhost:5174","http://localhost:5173","http://localhost:5175"
    ],
    credentials: true 
  }))
}
app.use(rateLimiter);

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

if (process.env.NODE_ENV === "production") {

    const renderRoot = __dirname.includes('src') 
        ? __dirname.split('src')[0] + 'src' 
        : __dirname;

    const adminPath = path.join(renderRoot, "system-admin", "dist");
    const clientPath = path.join(renderRoot, "system-client", "dist");

    console.log("--- RENDER PATH DEBUG ---");
    console.log("Current Dir:", __dirname);
    console.log("Detected Root:", renderRoot);
    console.log("Final Admin Path:", adminPath);
    console.log("Final Client Path:", clientPath);
    console.log("-------------------------");

    app.use("/admin", express.static(adminPath));
    app.use("/", express.static(clientPath));

    app.get(/^\/admin/, (req, res) => {
        res.sendFile(path.join(adminPath, "index.html"));
    });

    app.get(/.*/, (req, res) => {
        res.sendFile(path.join(clientPath, "index.html"));
    });
}

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