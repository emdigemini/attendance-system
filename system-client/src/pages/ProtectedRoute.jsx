import { useContext } from "react"
import { Navigate } from "react-router-dom"
import authContext from "../context/authContext"

const ProtectedRoute = ({ children }) => {
  const { authenticated, authorization, loading } = useContext(authContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if(!authenticated) 
    return <Navigate to="/" replace />;

  // if (!authorization) {
  //   return <AccessDenied />
  // }

  return children;
}

const AccessDenied = () => {
  return (
    <div className="flex items-center justify-center min-h-50 p-4">
      <div className="bg-white border-l-4 border-red-600 shadow-[0_0_4px_rgba(0,0,0,0.25)] rounded-r-lg p-6 max-w-md w-full">
        <div className="flex items-center">
          <div className="shrink-0">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Access Denied</h3>
            <p className="text-sm text-gray-600 mt-1">
              Please contact the Registrar or System Administrator for access credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProtectedRoute