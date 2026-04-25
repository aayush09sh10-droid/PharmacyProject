import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PharmaHeader from "../Layout/PharmaHeader.jsx";
import PharmaFooter from "../Layout/PharmaFooter.jsx";
import BackButton from "../Layout/BackButton.jsx";
import RoleProfileEditor from "./RoleProfileEditor.jsx";
import {
  changeCurrentUserPassword,
  clearAuthSession,
  fetchCurrentUserProfile,
  getStoredUser,
  saveStoredUser,
  updateCurrentUserProfile,
} from "../../services/auth.service.js";
import { getCartCount } from "../../services/cart.service.js";

export default function CustomerProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [cartCount, setCartCount] = useState(() => getCartCount());
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    userName: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [error, setError] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  useEffect(() => {
    const currentUser = getStoredUser();
    if (!currentUser || currentUser.role !== "User") {
      navigate("/signin", { replace: true });
      return;
    }

    const loadProfile = async () => {
      try {
        const data = await fetchCurrentUserProfile();
        setProfile(data);
        setProfileForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          userName: data.userName || "",
        });
      } catch (requestError) {
        if (requestError.status === 401) {
          clearAuthSession();
          navigate("/signin", { replace: true });
          return;
        }

        setError(requestError.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  useEffect(() => {
    const syncCart = () => setCartCount(getCartCount());
    window.addEventListener("cart-updated", syncCart);
    return () => window.removeEventListener("cart-updated", syncCart);
  }, []);

  const handleProfileFieldChange = (key, value) => {
    setProfileForm((current) => ({ ...current, [key]: value }));
  };

  const handlePasswordFieldChange = (key, value) => {
    setPasswordForm((current) => ({ ...current, [key]: value }));
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setError("");
    setProfileMessage("");
    setPasswordMessage("");
    setSavingProfile(true);

    try {
      const updated = await updateCurrentUserProfile(profileForm);
      setProfile(updated);
      saveStoredUser(updated);
      setProfileMessage("Profile updated successfully.");
      window.dispatchEvent(new Event("storage"));
    } catch (requestError) {
      setError(requestError.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setError("");
    setPasswordMessage("");
    setProfileMessage("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    setSavingPassword(true);

    try {
      await changeCurrentUserPassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordMessage("Password updated successfully.");
    } catch (requestError) {
      setError(requestError.message || "Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5fcfb] text-slate-900">
      <PharmaHeader activePage="profile" cartCount={cartCount} showCustomerMenu />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <BackButton label="Back to Home" onClick={() => navigate("/")} />

        <div className="mt-6">
          {loading ? (
            <div className="rounded-[24px] bg-white p-8 text-lg text-slate-500 shadow-[0_18px_55px_rgba(15,23,42,0.1)]">
              Loading profile...
            </div>
          ) : (
            <RoleProfileEditor
              title="Customer Profile"
              subtitle="Review your account details, keep your information current, and update your password when needed."
              badgeLabel="Customer Account"
              badgeTone="emerald"
              profile={profile}
              profileFields={[
                { key: "name", label: "Full Name" },
                { key: "email", label: "Email Address", type: "email" },
                { key: "phone", label: "Phone Number" },
                { key: "userName", label: "Username" },
              ]}
              profileForm={profileForm}
              onProfileFieldChange={handleProfileFieldChange}
              onSaveProfile={handleSaveProfile}
              savingProfile={savingProfile}
              passwordForm={passwordForm}
              onPasswordFieldChange={handlePasswordFieldChange}
              onChangePassword={handleChangePassword}
              savingPassword={savingPassword}
              profileMessage={profileMessage}
              passwordMessage={passwordMessage}
              error={error}
              detailItems={[
                { label: "Customer Name", value: profile?.name },
                { label: "Email", value: profile?.email },
                { label: "Phone", value: profile?.phone },
                { label: "Joined", value: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-IN") : "" },
              ]}
            />
          )}
        </div>
      </main>

      <PharmaFooter />
    </div>
  );
}
