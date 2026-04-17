import { Routes, Route } from "react-router-dom"
import { Navigate } from "react-router-dom"
import { useContext } from "react"
import ProtectedLayout from "./pages/ProtectedLayout"
import ProtectedRoute from "./components/ProtectedRoute"
import LoginPage from "./pages/LoginPage"
import Dashboard from "./components/dashboard/Dashboard"
import UserManagement from "./components/userManagement/UserManagement"
import ClassManagement from "./components/classManagement/ClassManagement"
import accountContext from "./context/userManagement/AccountContext"
import CreateAccount from "./components/userManagement/CreateAccount"
import CreateClass from "./components/classManagement/CreateClass"
import classContext from "./context/classManagement/ClassContext"
import adminContext from "./context/admin/adminContext"

const App = () => {
  const { authenticated } = useContext(adminContext);
  const { toggleCreate } = useContext(accountContext);
  const { newClass } = useContext(classContext);

  return (
    <>
      {toggleCreate && <CreateAccount />}
      {newClass && <CreateClass />}
      <Routes>
        <Route
          path="/"
          element={
            authenticated
              ? <Navigate to="/dashboard" replace />
              : <LoginPage />
          }
        />
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/user-management" element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/class-management" element={
            <ProtectedRoute>
              <ClassManagement />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </>
  )
}

export default App