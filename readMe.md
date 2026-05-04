# 🎓 ESCR: Enterprise Attendance & Academic Management System
**A Full-Stack MERN Solution for East Systems Colleges of Rizal**

---

## 💡 The Challenge & Solution
*   **The Problem:** Manual attendance tracking at **East Systems Colleges of Rizal** was historically prone to human error, time-consuming for faculty, and lacked real-time visibility for the administration.
*   **The Solution:** A centralized, full-stack MERN platform that digitizes the entire academic workflow, providing instant data synchronization and secure access across all institutional levels.

---

## 📌 Project Overview
This system is a comprehensive digital solution designed to modernize academic workflows. It replaces traditional manual logging with a secure, role-based platform that handles real-time attendance tracking, automated scheduling, and centralized records for students and teachers.

---

## 🛠️ Technical Architecture

### **Core Stack**
*   **Frontend:** React 19 (Vite) utilizing **Tailwind CSS v4** for high-performance, utility-first styling.
*   **Backend:** Node.js & Express v5 following a strict **MVC (Model-View-Controller)** pattern for scalability.
*   **Database:** MongoDB with Mongoose, implementing complex schemas for Students, Teachers, and Attendance records.
*   **Authentication:** JWT-based stateless authentication with secure HTTP-only cookies.

### **Key Features**
*   **Role-Based Access Control (RBAC):** Secure routing for Admin, Teacher, and Student portals using a custom `ProtectedRoute` logic.
*   **Dynamic Attendance Engine:** A real-time system featuring an Attendance Leaderboard and session-based checking.
*   **Cloud Media Integration:** Seamless profile management and document uploads integrated with **Cloudinary**.
*   **Automated Scheduling:** A complex CRUD module for managing subjects, classrooms, and recurring academic schedules.

---

## 📂 System Design (Architecture)

### **Backend Modularization**
The backend is designed for maintainability by isolating business logic from routing:
*   **Controllers:** Granular handling of accounts, attendance, and academic logic.
*   **Models:** Optimized MongoDB schemas including `Account.js`, `Attendance.js`, and `Schedule.js`.
*   **Middleware:** Custom authentication and file-upload processing via Multer and Cloudinary.

### **Frontend State Management**
Utilizes a **Multi-Context Provider Pattern** to prevent prop-drilling and ensure clean data flow:
*   **AuthContext:** Manages global user sessions and permissions.
*   **AttendanceContext:** Handles real-time attendance updates and data fetching.
*   **Schedule/SubjectProviders:** Isolated states for academic resource management.

---

## 📈 Future Roadmap
*   **QR Code Integration**: Implementing unique QR generation for touchless student check-ins.
*   **Push Notifications**: Mobile alerts for attendance discrepancies.
*   **Reporting Analytics**: PDF export functionality for monthly academic reports.