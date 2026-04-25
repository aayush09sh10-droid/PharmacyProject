import React from "react";
import { KeyRound, ShieldCheck } from "lucide-react";

function renderFieldValue(value) {
  if (value === null || value === undefined || value === "") {
    return "Not provided";
  }

  return String(value);
}

export default function RoleProfileEditor({
  title,
  subtitle,
  badgeLabel,
  badgeTone = "emerald",
  profile,
  profileFields,
  profileForm,
  onProfileFieldChange,
  onSaveProfile,
  savingProfile,
  passwordForm,
  onPasswordFieldChange,
  onChangePassword,
  savingPassword,
  profileMessage,
  passwordMessage,
  error,
  detailItems = [],
}) {
  const badgeStyles = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    violet: "border-violet-200 bg-violet-50 text-violet-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.4fr]">
      <section className="rounded-[28px] bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.1)] sm:p-8">
        <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${badgeStyles[badgeTone] || badgeStyles.emerald}`}>
          <ShieldCheck size={16} />
          <span>{badgeLabel}</span>
        </div>

        <h1 className="mt-5 text-2xl font-semibold text-slate-900 sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">{subtitle}</p>

        <div className="mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-r from-emerald-500 to-teal-500 text-2xl font-bold text-white shadow-lg shadow-emerald-100">
          {(profile?.name || profile?.ownerName || profile?.pharmacyName || "P").charAt(0).toUpperCase()}
        </div>

        <div className="mt-6 space-y-4">
          {detailItems.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{item.label}</p>
              <p className="mt-2 break-words text-sm font-medium text-slate-900 sm:text-base">
                {renderFieldValue(item.value)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="space-y-6">
        <section className="rounded-[28px] bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.1)] sm:p-8">
          <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">Profile Details</h2>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Update your visible account information here.
          </p>

          <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={onSaveProfile}>
            {profileFields.map((field) => (
              <label
                key={field.key}
                className={field.fullWidth ? "sm:col-span-2" : ""}
              >
                <span className="mb-2 block text-sm font-medium text-slate-700">{field.label}</span>
                <input
                  type={field.type || "text"}
                  value={profileForm[field.key] ?? ""}
                  onChange={(event) => onProfileFieldChange(field.key, event.target.value)}
                  placeholder={field.placeholder || field.label}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </label>
            ))}

            {profileMessage ? (
              <div className="sm:col-span-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {profileMessage}
              </div>
            ) : null}

            {error ? (
              <div className="sm:col-span-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="w-full rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-100 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {savingProfile ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-[28px] bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.1)] sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              <KeyRound size={18} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">Change Password</h2>
              <p className="mt-1 text-sm text-slate-500 sm:text-base">Use your current password to set a new one.</p>
            </div>
          </div>

          <form className="mt-6 grid gap-4" onSubmit={onChangePassword}>
            <label>
              <span className="mb-2 block text-sm font-medium text-slate-700">Current Password</span>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(event) => onPasswordFieldChange("currentPassword", event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </label>
            <label>
              <span className="mb-2 block text-sm font-medium text-slate-700">New Password</span>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(event) => onPasswordFieldChange("newPassword", event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </label>
            <label>
              <span className="mb-2 block text-sm font-medium text-slate-700">Confirm New Password</span>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(event) => onPasswordFieldChange("confirmPassword", event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            {passwordMessage ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {passwordMessage}
              </div>
            ) : null}

            <div>
              <button
                type="submit"
                disabled={savingPassword}
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {savingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
