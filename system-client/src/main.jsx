import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import App from './App.jsx'
import Providers from './Providers.jsx'
import './index.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Providers>
        <App />
      </Providers>
      <Toaster />
    </Router>
  </StrictMode>
)
