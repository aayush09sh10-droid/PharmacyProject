import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormContainer from "./FormContainer";
import PageHeader from "./PageHeader";
import DemoBox from "./DemoBox";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import VendorIcon from "../../assets/Vendor.png";
import PharmaFooter from "../Layout/PharmaFooter.jsx";
import BackButton from "../Layout/BackButton.jsx";

export default function VendorLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("Vendor login UI is ready. Backend connection will be added soon.");
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-green-100">
      <div className="py-10">
        <FormContainer>
          <div className="mb-4">
            <BackButton label="Back" onClick={() => navigate("/signin")} />
          </div>

          <PageHeader
            icon={VendorIcon}
            title="Vendor Login"
            subtitle="Manage your pharmacy"
          />

          <DemoBox email="vendor@demo.com" password="vendor123" />

          <form onSubmit={handleSubmit}>
            <InputField
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@example.com"
              icon="Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            <InputField
              label="Password"
              type="password"
              name="password"
              placeholder="Enter password"
              icon="Lock"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <SubmitButton text="Sign In" />
          </form>

          {message && <p className="mt-3 text-center text-sm text-green-600">{message}</p>}

          <p className="mt-4 text-center text-gray-600">
            Want to list your pharmacy?{" "}
            <span
              className="cursor-pointer font-medium text-green-600 hover:underline"
              onClick={() => navigate("/vendor-register")}
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
