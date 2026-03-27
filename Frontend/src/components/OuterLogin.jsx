import React from 'react'
import Users from "../assets/Users.png"
import Admin from "../assets/Admin.png"
import Vendor from "../assets/Vendor.png"
import Customer from "../assets/Customer.png"
import OuterLoginCard from './OuterLoginCard.jsx'
import './OuterLogin.css'

const LoginOuter = () => {
  return (
    <div className="LoginOuter text-center mt-16 bg-[#F7FAFB]">
        <div className='Logo'>
            <img className='Logo_Img' src={Users} alt="PharmaCare Logo" />
        </div>
        <div className='Page_Header '>
            <h1 className='text-5xl font-bold text-green-00 header'>Welcome to PharmaCare</h1>
            <p className='mt-3 text-gray-600 text-lg'>Choose your role to get started with our healthcare platform</p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 px-8'>

            <OuterLoginCard
                image={Customer}
                title="I am a Customer"
                description={`Order medicines from verified pharmacies near you
                Browse medicines
                Compare prices
                Track orders`}
                btnText="Continue as Customer"
                btnColor="bg-gradient-to-r from-blue-500 via-blue-700 to-blue-500"
            />

            <OuterLoginCard
              image={Vendor}
              title="I am a Pharmacy Vendor"
              description=
              {`List your pharmacy on our platform
              Manage inventory
              Receive orders
              Connect with customers`}
              btnText="Login as Vendor"
              btnColor="bg-gradient-to-r from-green-500 via-green-600 to-green-400"
            />

            <OuterLoginCard
              image={Admin}
              title="I am an Admin"
              description={
                `Manage users and pharmacies
                Monitor platform activity
                Generate reports
                Ensure smooth operations`
              }
              btnText="Continue as Admin"
              btnColor="bg-gradient-to-r from-purple-500 via-purple-700 to-purple-500"
            />

        </div>
        
    </div>
  )
}

export default LoginOuter
