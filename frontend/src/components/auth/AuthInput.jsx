import React from "react";
import { Eye, EyeOff } from "lucide-react";

const AuthInput = ({ icon: Icon, label, type, name, value, onChange, showPasswordToggle, showPassword, onTogglePassword }) => {
  return (
    <div className="relative group">
      {/* Icon */}
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-300" />
      </div>
      
      {/* Input Field */}
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder=" " 
        className="peer w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-11 py-4 text-sm text-slate-900 outline-none transition-all duration-300 hover:border-indigo-100 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
        required
      />
      
      {/* Floating Label */}
      <label
        htmlFor={name}
        className="absolute left-11 top-4 text-sm text-slate-400 transition-all duration-300 pointer-events-none 
        peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 
        peer-focus:-translate-y-6 peer-focus:-translate-x-2 peer-focus:scale-85 peer-focus:text-indigo-600 peer-focus:font-bold
        -translate-y-6 -translate-x-2 scale-85 font-bold"
      >
        {label}
      </label>

      {/* Password Toggle Button */}
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      )}
    </div>
  );
};

export default AuthInput;