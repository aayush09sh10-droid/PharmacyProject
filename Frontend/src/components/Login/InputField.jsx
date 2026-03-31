import { useState } from "react";

export default function InputField({ label, type = "text", placeholder, icon, value, onChange, name, autoComplete }) {

  const [show, setShow] = useState(false);

  const actualType = type === "password" && show ? "text" : type;

  return (
    <div className="mb-5 w-full text-left">
      <label className="block mb-2 text-gray-700 font-medium">{label}</label>

      <div className="flex items-center bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 shadow-sm focus-within:border-green-500 transition">
        
        <span className="text-gray-400 text-xl mr-3">{icon}</span>

        <input
          type={actualType}
          name={name}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="bg-transparent outline-none w-full text-gray-700"
        />

        {type === "password" && (
          <span
            className="text-gray-400 text-xl cursor-pointer"
            onClick={() => setShow(!show)}
          >
            {show ? "👁️" : "👁️‍🗨️"}
          </span>
        )}
      </div>
    </div>
  );
}