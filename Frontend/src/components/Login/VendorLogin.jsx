import React from "react";
import { useNavigate } from "react-router-dom";
import FormContainer from "./FormContainer";
import PageHeader from "./PageHeader";
import DemoBox from "./DemoBox";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import VendorIcon from "../../assets/vendor.png";

export default function VendorLogin() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/signin");
  };
  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-green-100 py-10">

      <FormContainer>
        
        {/* Back Button */}
        <div 
          className="flex items-center gap-2 text-gray-500 mb-4 cursor-pointer hover:text-gray-700"
          onClick={handleBackClick}
        >
          ← Change Role
        </div>

        <PageHeader
          icon={VendorIcon}
          title="Vendor Login"
          subtitle="Manage your pharmacy"
        />

        <DemoBox
          email="vendor@demo.com"
          password="vendor123"
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
          // icon="🔒"
        />

        <SubmitButton text="Sign In" />

        <p className="text-center mt-4 text-gray-600">
          Want to list your pharmacy?{" "}
          <span
            className="text-green-600 font-medium cursor-pointer hover:underline"
            onClick={() => navigate('/register')}
          >
            Register as Vendor
          </span>
        </p>
      </FormContainer>
    </div>
  );
}
