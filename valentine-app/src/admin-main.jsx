import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AdminDashboard from './admin/AdminDashboard.jsx'

createRoot(document.getElementById('admin-root')).render(
  <StrictMode>
    <AdminDashboard />
  </StrictMode>,
)
