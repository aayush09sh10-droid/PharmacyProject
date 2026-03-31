import React from 'react';
import { useNavigate } from 'react-router-dom';
import Users from "../assets/Users.png";
import Admin from "../assets/Admin.png";
import Vendor from "../assets/Vendor.png";
import Customer from "../assets/Customer.png";
import RoleCard from './RoleCard.jsx';
import './loginOuter.css';

const LoginOuter = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="LoginOuter text-center mt-16 bg-[#F7FAFB]">
        <div className='Logo'>
          <img className='Logo_Img' src={Users} alt="PharmaCare Logo" />
        </div>
        <div className='Page_Header'>
          <h1 className='text-5xl font-bold text-green-00 header'>Welcome to PharmaCare</h1>
          <p className='mt-3 text-gray-600 text-lg'>Choose your role to get started with our healthcare platform</p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 px-8'>
          <RoleCard
            image={Customer}
            title="I am a Customer"
            description="Order medicines from verified pharmacies near you\nBrowse medicines\nCompare prices\nTrack orders"
            btnText="Continue as Customer"
            btnColor="bg-linear-to-r from-blue-500 via-blue-700 to-blue-500"
            onClick={() => navigate('/customer-login')}
          />
          <RoleCard
            image={Vendor}
            title="I am a Pharmacy Vendor"
            description="List your pharmacy on our platform\nManage inventory\nReceive orders\nConnect with customers"
            btnText="Login as Vendor"
            btnColor="bg-linear-to-r from-green-500 via-green-600 to-green-400"
            onClick={() => navigate('/vendor-login')}
          />
          <RoleCard
            image={Admin}
            title="I am an Admin"
            description="Manage users and pharmacies\nMonitor platform activity\nView analytics\nSystem configuration"
            btnText="Login as Admin"
            btnColor="bg-linear-to-r from-purple-500 via-purple-600 to-purple-400"
            onClick={() => navigate('/admin-login')}
          />
        </div>
      </div>
    </>
  );
};

export default LoginOuter;
