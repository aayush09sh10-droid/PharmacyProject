import React from "react";
import { useNavigate } from "react-router-dom";
import Users from "../../assets/Users.png";
import Admin from "../../assets/Admin.png";
import Vendor from "../../assets/Vendor.png";
import Customer from "../../assets/Customer.png";
import RoleCard from "./RoleCard.jsx";
import PharmaFooter from "../Layout/PharmaFooter.jsx";
import BackButton from "../Layout/BackButton.jsx";
import "./LoginOuter.css";

const LoginOuter = ({ mode = "login" }) => {
  const navigate = useNavigate();
  const isRegisterMode = mode === "register";

  return (
    <div className="min-h-screen bg-[#F7FAFB]">
      <div className="LoginOuter px-4 pb-16 pt-10 text-center">
        <div className="w-full max-w-6xl px-4 text-left">
          <BackButton
            label="Back"
            onClick={() => navigate(isRegisterMode ? "/" : "/")}
          />
        </div>
        <div className="Logo mt-6">
          <img className="Logo_Img" src={Users} alt="PharmaCare Logo" />
        </div>
        <div className="Page_Header">
          <h1 className="header text-5xl font-bold">Welcome to PharmaCare</h1>
          <p className="mt-3 text-lg text-gray-600">
            {isRegisterMode
              ? "Choose which role you want to register with"
              : "Choose your role to get started with our healthcare platform"}
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 px-8 md:grid-cols-3">
          <RoleCard
            image={Customer}
            title="I am a Customer"
            description="Order medicines from verified pharmacies near you\nBrowse medicines\nCompare prices\nTrack orders"
            btnText={isRegisterMode ? "Register as Customer" : "Continue as Customer"}
            btnColor="bg-linear-to-r from-blue-500 via-blue-700 to-blue-500"
            onClick={() => navigate(isRegisterMode ? "/customer-register" : "/customer-login")}
          />
          <RoleCard
            image={Vendor}
            title="I am a Pharmacy Vendor"
            description="List your pharmacy on our platform\nManage inventory\nReceive orders\nConnect with customers"
            btnText={isRegisterMode ? "Register as Vendor" : "Login as Vendor"}
            btnColor="bg-linear-to-r from-green-500 via-green-600 to-green-400"
            onClick={() => navigate(isRegisterMode ? "/vendor-register" : "/vendor-login")}
          />
          <RoleCard
            image={Admin}
            title="I am an Admin"
            description="Manage users and pharmacies\nMonitor platform activity\nView analytics\nSystem configuration"
            btnText={isRegisterMode ? "Register as Admin" : "Login as Admin"}
            btnColor="bg-linear-to-r from-purple-500 via-purple-600 to-purple-400"
            onClick={() => navigate(isRegisterMode ? "/admin-register" : "/admin-login")}
          />
        </div>
      </div>
      <PharmaFooter />
    </div>
  );
};

export default LoginOuter;
