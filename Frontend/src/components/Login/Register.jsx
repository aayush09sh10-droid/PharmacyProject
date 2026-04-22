import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth.service.js";
import FormContainer from "./FormContainer";
import PageHeader from "./PageHeader";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import UsersIcon from "../../assets/Users.png";
import PharmaFooter from "../PharmaFooter.jsx";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill out all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        name,
        email,
        password,
        role: "Admin",
      });
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/admin-login"), 1800);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100">
      <div className="py-10">
        <FormContainer>
          <div
            className="mb-4 flex items-center gap-2 cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={() => navigate(-1)}
          >
            â† Back to login
          </div>

          <PageHeader
            icon={UsersIcon}
            title="Create Admin Account"
            subtitle="Register as an administrator"
          />

          <form onSubmit={handleSubmit}>
            <InputField
              label="Full Name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              icon="ðŸ‘¤"
              autoComplete="name"
            />

            <InputField
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              icon="ðŸ“§"
              autoComplete="email"
            />

            <InputField
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              icon="ðŸ”’"
              autoComplete="new-password"
            />

            <InputField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              icon="ðŸ”’"
              autoComplete="new-password"
            />

            <SubmitButton text={loading ? "Registering..." : "Register"} />
          </form>

          {error && <p className="mt-3 text-center text-sm text-red-600">{error}</p>}
          {success && <p className="mt-3 text-center text-sm text-green-600">{success}</p>}

          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <span
              className="cursor-pointer font-medium text-green-600 hover:underline"
              onClick={() => navigate("/admin-login")}
            >
              Login here
            </span>
          </p>
        </FormContainer>
      </div>

      <PharmaFooter />
    </div>
  );
}
