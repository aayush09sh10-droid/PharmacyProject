import React from "react";
import { useNavigate } from "react-router-dom";
import FormContainer from "../../Components/Login/FormContainer";
import PageHeader from "../../Components/Login/PageHeader";
import DemoBox from "../../Components/Login/DemoBox";
import InputField from "../../Components/Login/InputField";
import SubmitButton from "../../Components/Login/SubmitButton";
import AdminIcon from "../../Assets/Admin.png";

export default function AdminLogin() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 py-10">
      <FormContainer>
        
        {/* Back Button */}
        <div 
          className="flex items-center gap-2 text-gray-500 mb-4 cursor-pointer hover:text-gray-700"
          onClick={handleBackClick}
        >
          ← Change Role
        </div>

        <PageHeader
          icon={AdminIcon}
          title="Admin Login"
          subtitle="Manage the platform"
        />

        <DemoBox
          email="admin@demo.com"
          password="admin123"
        />

        <InputField
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          icon="📧"
        />

        <InputField
          label="Password"
          type="password"
          placeholder="••••••••"
        />

        <SubmitButton text="Sign In" />
      </FormContainer>
    </div>
  );
}
