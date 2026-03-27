import React from "react";
import { useNavigate } from "react-router-dom";
import FormContainer from "./FormContainer";
import PageHeader from "./PageHeader";
import DemoBox from "./DemoBox";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import CustomerIcon from "../../Assets/Customer.png";

export default function CustomerLogin() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-10">
      <FormContainer>
        
        {/* Back Button */}
        <div 
          className="flex items-center gap-2 text-gray-500 mb-4 cursor-pointer hover:text-gray-700"
          onClick={handleBackClick}
        >
          ← Change Role
        </div>

        <PageHeader
          icon={CustomerIcon}
          title="Customer Login"
          subtitle="Order medicines online"
        />

        <DemoBox
          email="customer@demo.com"
          password="customer123"
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
