import React from "react";
import { useNavigate } from "react-router-dom";
import FormContainer from "./FormContainer";
import PageHeader from "./PageHeader";
import DemoBox from "./DemoBox";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import VendorIcon from "../../assets/vendor.png";
import PharmaFooter from "../PharmaFooter.jsx";

export default function VendorLogin() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-green-100">
      <div className="py-10">
        <FormContainer>
          <div
            className="mb-4 flex items-center gap-2 cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={handleBackClick}
          >
            â† Change Role
          </div>

          <PageHeader
            icon={VendorIcon}
            title="Vendor Login"
            subtitle="Manage your pharmacy"
          />

          <DemoBox email="vendor@demo.com" password="vendor123" />

          <InputField
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            icon="ðŸ“§"
          />

          <InputField
            label="Password"
            type="password"
            placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
          />

          <SubmitButton text="Sign In" />

          <p className="mt-4 text-center text-gray-600">
            Want to list your pharmacy?{" "}
            <span
              className="cursor-pointer font-medium text-green-600 hover:underline"
              onClick={() => navigate("/register")}
            >
              Register as Vendor
            </span>
          </p>
        </FormContainer>
      </div>

      <PharmaFooter />
    </div>
  );
}
