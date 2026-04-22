import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Facebook,
  HeartPulse,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";

const quickLinks = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Support" },
  { label: "AI Assistant" },
  { label: "Find Pharmacies", path: "/" },
];

const services = [
  "Price Comparison",
  "Prescription Refills",
  "Medication Information",
  "Pharmacy Locator",
  "Health Resources",
];

const policies = [
  "Privacy Policy",
  "Terms of Service",
  "Cookie Policy",
  "Accessibility",
];

const socialIcons = [Facebook, Twitter, Instagram, Linkedin];

export default function PharmaFooter() {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#111b2d] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr]">
          <div>
            <div
              className="flex w-fit cursor-pointer items-center gap-3"
              onClick={() => navigate("/")}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-900/30">
                <HeartPulse size={20} />
              </div>
              <h2 className="text-2xl font-semibold">PharmaCare</h2>
            </div>

            <p className="mt-6 max-w-sm text-sm leading-7 text-slate-300">
              Your trusted partner in finding affordable healthcare solutions.
              Compare prices and find medications near you.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {socialIcons.map((Icon, index) => (
                <button
                  key={index}
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-300 transition hover:border-slate-500 hover:text-white"
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="mt-5 flex flex-col gap-3 text-sm text-slate-300">
              {quickLinks.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.path ? () => navigate(item.path) : undefined}
                  className="w-fit text-left transition hover:text-white"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Services</h3>
            <div className="mt-5 flex flex-col gap-3 text-sm text-slate-300">
              {services.map((service) => (
                <p key={service}>{service}</p>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="mt-5 space-y-4 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <p>
                  123 Healthcare Ave
                  <br />
                  New York, NY 10001
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="shrink-0" />
                <p>+1 (555) 123-4567</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="shrink-0" />
                <p>support@pharmacare.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6">
          <div className="flex flex-col gap-4 text-sm text-slate-400 lg:flex-row lg:items-center lg:justify-between">
            <p>© 2026 PharmaCare. All rights reserved.</p>
            <div className="flex flex-wrap gap-5">
              {policies.map((item) => (
                <button key={item} type="button" className="transition hover:text-white">
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
