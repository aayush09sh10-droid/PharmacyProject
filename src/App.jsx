import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginOuter from './Components/loginOuter.jsx'
import VendorLogin from './Components/Login/VendorLogin.jsx'
import CustomerLogin from './Components/Login/CustomerLogin.jsx'
import AdminLogin from './Components/Login/AdminLogin.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginOuter />} />
        <Route path="/vendor-login" element={<VendorLogin />} />
        <Route path="/customer-login" element={<CustomerLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
    </Router>
  )
}

export default App
