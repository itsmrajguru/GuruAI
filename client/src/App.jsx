import { Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/signupPage'
import VerifySignupOtpPage from './pages/VerifySignupOtpPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import NotFoundPage from './pages/NotFoundPage'
import DashboardPage from './pages/dashboardPage'

function App() {
  return (
    <div className="app">
        <Routes>
          <Route path="/" element={<LoginPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/signup" element={<SignupPage/>}/>
          <Route path="/verify-signup-otp" element={<VerifySignupOtpPage/>}/>
          <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
          <Route path="/reset-password" element={<ResetPasswordPage/>}/>
          <Route path="/dashboard" element={<DashboardPage/>}/>
          <Route path="*" element={<NotFoundPage/>}/>
        </Routes>
    </div>
  )
}

export default App
