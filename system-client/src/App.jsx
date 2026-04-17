import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./components/dashboard/Dashboard";
import Classrooms from "./components/classrooms/Classrooms";
import Subjects from "./components/subjects/Subjects"
import { ClassSchedule } from "./components/schedule/Schedule"
import Attendance from "./components/attendance/Attendance";
import Profile from "./components/profile/Profile"
import { useContext, useEffect } from "react";
import authContext from "./context/authContext";
import ProtectedLayout from "./pages/ProtectedLayout";
import ProtectedRoute from "./pages/ProtectedRoute";


const App = () => {
  const { authenticated } = useContext(authContext);

  return (
    <>
      <Routes>
        <Route path="/" element={
          authenticated 
            ? <Navigate to="/dashboard" replace /> 
            : <LoginPage />
        } />
        <Route element={<ProtectedLayout/>}>
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/classrooms" element={
            <ProtectedRoute>
              <Classrooms />
            </ProtectedRoute>
          } />
          <Route path="/subjects" element={
            <ProtectedRoute>
              <Subjects />
            </ProtectedRoute>
          } />
          <Route path="/schedule" element={
            <ProtectedRoute>
              <ClassSchedule />
            </ProtectedRoute>
          } />
          <Route path="/attendance" element={
            <ProtectedRoute>
              <Attendance />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </>
  )
}

export default App