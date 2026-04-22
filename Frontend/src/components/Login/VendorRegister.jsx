import React from "react";
import VendorIcon from "../../assets/Vendor.png";
import RoleRegisterPage from "./RoleRegisterPage.jsx";

export default function VendorRegister() {
  return (
    <RoleRegisterPage
      accentClass="from-green-50 to-green-100"
      icon={VendorIcon}
      title="Create Vendor Account"
      subtitle="Register your pharmacy on PharmaCare"
      role="Vendor"
      loginPath="/vendor-login"
      loginLabel="Login as Vendor"
      submitLabel="Register as Vendor"
      successRedirectPath="/vendor-login"
      successMessage="Vendor registration successful! Redirecting to login..."
      uiOnly
      uiOnlyMessage="Vendor registration UI is ready. Backend connection will be added soon."
    />
  );
}
