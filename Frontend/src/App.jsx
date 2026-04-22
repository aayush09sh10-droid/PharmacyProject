import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginOuter from './components/loginOuter.jsx'
import VendorLogin from './components/Login/VendorLogin.jsx'
import CustomerLogin from './components/Login/CustomerLogin.jsx'
import AdminLogin from './components/Login/AdminLogin.jsx'
import Register from './components/Login/Register.jsx'
import AdminPage from './components/AdminPage.jsx'
import LandingPage from './components/LandingPage.jsx'
import AboutPage from './components/AboutPage.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/signin" element={<LoginOuter />} />
        <Route path="/vendor-login" element={<VendorLogin />} />
        <Route path="/customer-login" element={<CustomerLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard/*" element={<AdminPage />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App
