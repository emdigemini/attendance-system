import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./components/dashboard/Dashboard";
import Classrooms from "./components/classrooms/Classrooms";
import Subjects from "./components/subjects/Subjects"
import { ClassSchedule } from "./components/schedule/Schedule"
import Attendance from "./components/attendance/Attendance";
import Profile from "./components/profile/Profile"
import { useContext } from "react";
import authContext from "./context/authContext";
import ProtectedLayout from "./pages/ProtectedLayout";
import ProtectedRoute from "./pages/ProtectedRoute";

const App = () => {
  const { authenticated, isServerLoaded } = useContext(authContext);

  return (
    <>
    {!isServerLoaded &&
      <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-xs">
        <div className="flex flex-col items-center rounded-2xl bg-[#262626] px-10 py-8 shadow-2xl">
          
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#555] border-t-[#D9D9D9]" />

          <h2 className="mt-5 text-lg font-semibold text-white">
            Connecting to server...
          </h2>

          <p className="mt-1 text-sm text-[#999]">
            Please wait a moment.
          </p>

        </div>
      </div>
    }
      <Routes>
        <Route path="/" element={
          authenticated 
            ? <Navigate to="/dashboard" replace /> 
            : <LoginPage replace />
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