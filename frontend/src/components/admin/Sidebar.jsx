import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Calendar, CalendarPlus, Users,
  ShieldCheck, X, Settings, Terminal
} from "lucide-react";

// Updated Navigation Options
const MENU_ITEMS = [
  { key: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { key: "/admin/events", icon: Calendar, label: "Manage Events" },
  { key: "/admin/add-event", icon: CalendarPlus, label: "Add Event" },
];

const Sidebar = ({ isMobileOpen, onCloseMobile, onHoverChange }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeKey = location.pathname;

  const handleNavClick = (path) => {
    navigate(path);
    onCloseMobile?.();
  };

  return (
    <>
      {/* --- DESKTOP SIDEBAR (Hover to Expand) --- */}
      <aside 
        onMouseEnter={() => onHoverChange?.(true)}   
        onMouseLeave={() => onHoverChange?.(false)}  
        className="hidden lg:flex lg:flex-col lg:w-20 hover:lg:w-64 bg-white border-r border-slate-200/80 fixed inset-y-0 left-0 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 ease-in-out group/sidebar overflow-hidden whitespace-nowrap"
      >
        {/* Identity Block */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center h-[72px]">
          <div className="relative flex items-center gap-3 w-full rounded-2xl bg-white border border-slate-200/60 p-1 shadow-[0_2px_12px_-4px_rgba(10,114,148,0.15)] hover:border-[#BAE6FD] transition-all duration-300 overflow-hidden">
            
            <div className="relative flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-xl shadow-sm">
                          <img src="/logo.png" alt="API Logo" className="w-full h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-500 relative z-10" />
            </div>

            <div className="min-w-0 flex-1 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 delay-75">
              <p className="text-[11px] font-bold tracking-[0.04em] text-slate-900 truncate">
                API Admin
              </p>
              <div className="flex items-center mt-1">
                <div className="inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[9px] font-bold border bg-[#F0F9FF] text-[#0A7294] border-[#BAE6FD]/60 uppercase tracking-widest">
                  <ShieldCheck size={10} className="text-[#22B3AD]" />
                  Command Center
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 pt-4 pb-2 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 delay-75">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.16em]">
            Navigation
          </p>
        </div>

        <nav className="flex-1 px-3 pb-4 space-y-1.5 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeKey === item.key;

            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`relative w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[11px] font-bold border transition-all duration-200 group/btn overflow-hidden ${
                  isActive
                    ? "bg-gradient-to-r from-[#F0F9FF] via-white to-[#F0F9FF] text-[#0A7294] border-[#BAE6FD] shadow-sm"
                    : "bg-transparent text-slate-600 border-transparent hover:bg-slate-50 hover:border-slate-100"
                }`}
              >
                {isActive && (
                  <span className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-gradient-to-b from-[#0A7294] to-[#22B3AD]" />
                )}
                
                <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[10px] transition-all duration-200 ${
                  isActive ? "bg-[#E0F2FE] text-[#0A7294] scale-105" : "bg-slate-100 text-slate-500 group-hover/btn:bg-[#F0F9FF] group-hover/btn:text-[#0A7294]"
                }`}>
                  <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                </span>
                
                <span className="flex-1 text-left truncate opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 delay-75">
                  {item.label}
                </span>

                {!isActive && (
                  <div className="ml-auto flex items-center gap-1 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 pr-1">
                    <span className="opacity-0 translate-x-1 text-[#0A7294] group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-200 text-[10px] font-bold">
                      →
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* --- BOTTOM ACTION: SETTINGS --- */}
        <div className="px-3 pb-3 pt-2 border-t border-slate-100 bg-white">
          <button 
            onClick={() => handleNavClick('/admin/settings')}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-[11px] font-bold transition-all duration-200 border overflow-hidden ${
              activeKey === "/admin/settings"
                ? "bg-slate-900 text-white border-slate-800 shadow-md"
                : "bg-white text-slate-600 border-transparent hover:bg-slate-50 hover:text-[#0A7294] hover:border-slate-200"
            }`}
          >
            <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl transition-colors ${
              activeKey === "/admin/settings" ? "bg-slate-800" : "bg-slate-100 group-hover:bg-[#F0F9FF]"
            }`}>
              <Settings size={16} />
            </span>
            <div className="flex flex-col items-start flex-1 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 delay-75 whitespace-nowrap">
              <span>Settings</span>
            </div>
          </button>
        </div>
      </aside>

      {/* --- MOBILE DRAWER (Slide from left) --- */}
      <div className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCloseMobile} />
        <div className={`absolute inset-y-0 left-0 w-[82%] max-w-xs bg-white shadow-2xl border-r border-slate-200 flex flex-col transform transition-transform duration-300 ease-out ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
          
          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#0A7294] to-[#22B3AD] flex items-center justify-center text-white shadow-sm">
                <Terminal size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">API Admin</p>
                <div className="mt-0.5">
                  <span className="inline-flex items-center gap-1 px-1.5 py-[2px] rounded-md bg-[#F0F9FF] text-[#0A7294] text-[9px] font-bold border border-[#BAE6FD]/50">
                    <ShieldCheck size={8} className="text-[#22B3AD]" /> Verified
                  </span>
                </div>
              </div>
            </div>
            <button onClick={onCloseMobile} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="px-4 pt-4 pb-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Navigation</p>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeKey === item.key;

              return (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.key)}
                  className={`w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-bold border transition-all duration-150 ${
                    isActive ? "bg-gradient-to-r from-[#F0F9FF] via-white to-[#F0F9FF] text-[#0A7294] border-[#BAE6FD] shadow-sm" : "bg-transparent text-slate-600 border-transparent hover:bg-slate-50"
                  }`}
                >
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 ${isActive ? "bg-[#E0F2FE] text-[#0A7294] scale-105" : "bg-slate-100 text-slate-500"}`}>
                    <Icon size={18} />
                  </span>
                  <span className="flex-1 text-left truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
          
          {/* --- MOBILE BOTTOM ACTION: SETTINGS --- */}
          <div className="p-4 border-t border-slate-100">
             <button 
               onClick={() => handleNavClick('/admin/settings')} 
               className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-colors ${
                 activeKey === '/admin/settings' 
                 ? "bg-slate-900 text-white shadow-md" 
                 : "bg-slate-50 text-slate-700 hover:bg-[#F0F9FF] hover:text-[#0A7294]"
               }`}
             >
               <Settings size={16} /> Settings
             </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE BOTTOM NAVIGATION BAR --- */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex justify-around items-center h-[68px] z-40 pb-safe transition-all">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeKey === item.key;

          return (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.key)}
              className="relative rounded-full flex flex-col items-center justify-center w-full h-full transition-all duration-300"
            >
              <div className={`relative flex items-center justify-center w-11 h-11 rounded-[14px] transition-all duration-500 ${isActive ? "bg-gradient-to-br from-[#0A7294] to-[#22B3AD] text-white shadow-lg shadow-[#0A7294]/30 -translate-y-[14px]" : "text-slate-400 bg-transparent hover:text-slate-600"}`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`absolute bottom-1.5 text-[9px] transition-all duration-500 ${isActive ? "font-bold text-[#0A7294] translate-y-0 opacity-100 tracking-wide" : "translate-y-2 opacity-0 font-medium"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default Sidebar;