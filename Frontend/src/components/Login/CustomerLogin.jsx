import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/auth.service.js";
import FormContainer from "./FormContainer";
import PageHeader from "./PageHeader";
import DemoBox from "./DemoBox";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import CustomerIcon from "../../assets/Customer.png";

export default function CustomerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBackClick = () => {
    navigate("/signin");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      if (data.user.role !== "User") {
        throw new Error("Please login with a customer account.");
      }
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("accessToken", data.accessToken);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-blue-100 py-10">
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

        <form onSubmit={handleSubmit}>
          <InputField
            label="Email Address"
            type="email"
            name="email"
            placeholder="you@example.com"
            icon="📧"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <InputField
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            icon="🔒"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <SubmitButton text={loading ? "Signing in..." : "Sign In"} />
        </form>

        {error && (
          <p className="text-center mt-3 text-sm text-red-600">{error}</p>
        )}

        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <span
            className="text-blue-600 font-medium cursor-pointer hover:underline"
            onClick={() => navigate('/register')}
          >
            Register here
          </span>
        </p>
      </FormContainer>
    </div>
  );
}
