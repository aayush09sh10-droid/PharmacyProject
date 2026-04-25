import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginOuter from './components/Auth/LoginOuter.jsx'
import VendorLogin from './components/Login/VendorLogin.jsx'
import CustomerLogin from './components/Login/CustomerLogin.jsx'
import AdminLogin from './components/Login/AdminLogin.jsx'
import CustomerRegister from './components/Login/CustomerRegister.jsx'
import VendorRegister from './components/Login/VendorRegister.jsx'
import AdminRegister from './components/Login/AdminRegister.jsx'
import AdminPage from './components/AdminPage.jsx'
import LandingPage from './components/Home/LandingPage.jsx'
import AboutPage from './components/Home/AboutPage.jsx'
import CartPage from './components/Shop/CartPage.jsx'
import CustomerOrdersPage from './components/Shop/CustomerOrdersPage.jsx'
import VendorPortal from './components/VendorPortal.jsx'
import AIAssistantPage from './components/User/AIAssistant/AIAssistantPage.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/ai-assistant" element={<AIAssistantPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/my-orders" element={<CustomerOrdersPage />} />
        <Route path="/signin" element={<LoginOuter mode="login" />} />
        <Route path="/register" element={<LoginOuter mode="register" />} />
        <Route path="/vendor-login" element={<VendorLogin />} />
        <Route path="/vendor-dashboard/*" element={<VendorPortal />} />
        <Route path="/customer-login" element={<CustomerLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/customer-register" element={<CustomerRegister />} />
        <Route path="/vendor-register" element={<VendorRegister />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route path="/admin-dashboard/*" element={<AdminPage />} />
      </Routes>
    </Router>
  )
}

export default App
