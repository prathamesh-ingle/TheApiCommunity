import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, Bell, Menu, Search, User2 } from "lucide-react";
import toast from "react-hot-toast";

const Navbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    toast.success("Logged out successfully");
    window.location.href = "/";
  };

  return (
    <header className="h-16 lg:h-20 bg-white/90 lg:bg-transparent backdrop-blur lg:backdrop-blur-none border-b border-slate-200/80 lg:border-none flex items-center sticky top-0 z-40 transition-all">
      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left Side: Mobile Menu Toggler + Title (Hidden on Desktop) */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:bg-[#F0F9FF] hover:text-[#0A7294] active:scale-95 transition-all duration-200 shadow-sm"
          >
            <Menu size={18} />
          </button>
          <h1 className="text-[15px] font-black text-slate-800 tracking-tight">API Admin</h1>
        </div>

        {/* Center: Desktop Search */}
        <div className="hidden lg:block relative max-w-md w-full group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-[#0A7294] transition-colors" />
          <input
            type="text"
            placeholder="Search events, applicants, speakers..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-[12px] text-xs font-medium text-slate-800 focus:border-[#22B3AD] focus:ring-4 focus:ring-[#22B3AD]/10 transition-all outline-none shadow-sm placeholder:text-slate-400"
          />
        </div>

        {/* Right Side: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-4 relative ml-auto" ref={dropdownRef}>
          
          <button type="button" className="inline-flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-[#0A7294] active:scale-95 transition-all shadow-sm relative">
            <Bell size={18} className="sm:w-[16px] sm:h-[16px]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
          </button>

          {/* Profile Button */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="h-10 w-10 sm:h-9 sm:w-9 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] flex items-center justify-center text-xs font-bold text-[#0A7294] shadow-sm hover:scale-105 active:scale-95 transition-all"
          >
            SB
          </button>

          {/* Dropdown panel */}
          {open && (
            <div className="absolute right-0 top-14 w-56 rounded-2xl border border-slate-100 bg-white shadow-xl py-2 text-xs text-slate-700 z-50 origin-top-right animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 pb-3 pt-2 border-b border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Signed in as</p>
                <p className="mt-1 text-sm font-bold text-slate-900 truncate">Sanket Bochare</p>
                <p className="text-[11px] font-medium text-slate-500 truncate">Super Admin</p>
              </div>
              <button onClick={() => { setOpen(false); navigate("/admin/settings"); }} className="w-full flex items-center gap-3 px-4 py-3 font-semibold hover:bg-slate-50 hover:text-[#0A7294] transition-colors">
                <Settings size={16} className="text-slate-500" /> Account Settings
              </button>
              <div className="my-1 border-t border-slate-100" />
              <button onClick={() => { setOpen(false); handleLogout(); }} className="w-full flex items-center gap-3 px-4 py-3 font-semibold text-rose-600 hover:bg-rose-50 transition-colors">
                <LogOut size={16} /> Secure Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;