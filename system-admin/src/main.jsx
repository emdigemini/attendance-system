import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import AdminProvider from './context/admin/AdminProvider.jsx'
import AccountProvider from './context/userManagement/AccountProvider.jsx'
import ClassProvider from './context/classManagement/ClassProvider.jsx'
import { Toaster } from "react-hot-toast"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router basename='/admin'>
      <AdminProvider>
        <AccountProvider>
          <ClassProvider>
            <App />
            <Toaster />
          </ClassProvider>
        </AccountProvider>
      </AdminProvider>
    </Router>
  </StrictMode>,
)
