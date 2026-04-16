import { useContext } from "react"
import adminContext from "../context/admin/adminContext"
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { authenticated, loading } = useContext(adminContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }
  if(!authenticated)
    return <Navigate to="/" replace />;

  return children;
}

export default ProtectedRoute