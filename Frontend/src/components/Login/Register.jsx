import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth.service.js";
import FormContainer from "./FormContainer";
import PageHeader from "./PageHeader";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import UsersIcon from "../../assets/Users.png";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

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
      navigate("/admin-login");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 py-10">
      <FormContainer>
        <div
          className="flex items-center gap-2 text-gray-500 mb-4 cursor-pointer hover:text-gray-700"
          onClick={() => navigate(-1)}
        >
          ← Back to login
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
            placeholder="John Doe"
            icon="👤"
            autoComplete="name"
          />

          <InputField
            label="Email Address"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            icon="📧"
            autoComplete="email"
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            icon="🔒"
            autoComplete="new-password"
          />

          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            icon="🔒"
            autoComplete="new-password"
          />

          <SubmitButton text={loading ? "Registering..." : "Register"} />
        </form>

        {error && <p className="text-center mt-3 text-sm text-red-600">{error}</p>}

        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <span
            className="text-green-600 font-medium cursor-pointer hover:underline"
            onClick={() => navigate("/admin-login")}
          >
            Login here
          </span>
        </p>
      </FormContainer>
    </div>
  );
}
