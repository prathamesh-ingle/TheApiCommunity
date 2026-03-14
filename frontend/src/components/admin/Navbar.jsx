//frontend/src/components/admin/Navbar.jsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu, Search, User2, Calendar, Users, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { logoutAdmin, getAdminDashboard, getAllApplicants } from "../../api/adminApi"; // Ensure these are exported from adminApi

const Navbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  
  // --- PROFILE DROPDOWN STATE ---
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // --- SEARCH STATE ---
  const searchRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchData, setSearchData] = useState({ events: [], applicants: [] });
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // --- CLICK OUTSIDE LOGIC ---
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearchResults(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

 const handleLogout = async () => {
  try {
    // 1. Send a request to the backend so IT can delete the HttpOnly cookie
    await fetch("http://localhost:5001/api/admin/logout", {
      method: "POST",
      credentials: "include", // 🚨 MAGIC KEY: Tells the browser to send the cookie so the backend can destroy it
    });

    // 2. Clear your frontend session data
    sessionStorage.removeItem("adminUser");
    
    // 3. Notify the user and redirect
    toast.success("Logged out successfully");
    window.location.href = "/";

  } catch (error) {
    console.error("Logout failed:", error);
    toast.error("Something went wrong during logout.");
  }
};

  // --- SEARCH LOGIC ---
  const handleSearchFocus = async () => {
    setShowSearchResults(true);
    if (!isDataLoaded && !isLoadingSearch) {
      setIsLoadingSearch(true);
      try {
        const [eventsRes, appsRes] = await Promise.all([getAdminDashboard(), getAllApplicants()]);
        setSearchData({
          events: eventsRes.data?.events || [],
          applicants: appsRes.data?.data || []
        });
        setIsDataLoaded(true);
      } catch (error) {
        console.error("Failed to load search data");
      } finally {
        setIsLoadingSearch(false);
      }
    }
  };

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    
    const matchedEvents = searchData.events
      .filter(e => e.title.toLowerCase().includes(q) || e.short_Description?.toLowerCase().includes(q))
      .map(e => ({ id: e._id, title: e.title, subtitle: `Event • ${new Date(e.date).toLocaleDateString()}`, route: '/admin/events', icon: Calendar }));
      
    const matchedApps = searchData.applicants
      .filter(a => a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q))
      .map(a => ({ id: a._id, title: a.name, subtitle: `Applicant • ${a.email}`, route: '/admin/applicants', icon: Users }));

    return [...matchedEvents, ...matchedApps].slice(0, 5); // Limit to top 5 results
  }, [searchQuery, searchData]);

  const handleSearchResultClick = (route) => {
    navigate(route);
    setShowSearchResults(false);
    setSearchQuery("");
  };

  return (
    // FIX: Changed z-40 to z-[100] to prevent the dropdown clipping bug
    <header className="h-16 lg:h-20 bg-white/90 lg:bg-transparent backdrop-blur lg:backdrop-blur-none border-b border-slate-200/80 lg:border-none flex items-center sticky top-0 z-[100] transition-all">
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
        <div className="hidden lg:block relative max-w-md w-full group" ref={searchRef}>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-[#0A7294] transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleSearchFocus}
            placeholder="Search events, applicants, speakers..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-[12px] text-xs font-medium text-slate-800 focus:border-[#22B3AD] focus:ring-4 focus:ring-[#22B3AD]/10 transition-all outline-none shadow-sm placeholder:text-slate-400"
          />

          {/* Search Results Dropdown */}
          {showSearchResults && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden z-[110] animate-in fade-in zoom-in-95 duration-200">
              {isLoadingSearch ? (
                <div className="p-4 text-center text-xs font-medium text-slate-500">Loading database...</div>
              ) : filteredResults.length > 0 ? (
                <div className="py-2">
                  <div className="px-4 py-2 border-b border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Search Results
                  </div>
                  {filteredResults.map((res, idx) => {
                    const Icon = res.icon;
                    return (
                      <button 
                        key={`${res.id}-${idx}`}
                        onClick={() => handleSearchResultClick(res.route)}
                        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition-colors border-l-2 border-transparent hover:border-[#0A7294] text-left group/result"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-8 h-8 rounded-lg bg-[#F0F9FF] text-[#0A7294] flex items-center justify-center shrink-0">
                            <Icon size={14} />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[13px] font-bold text-slate-800 truncate">{res.title}</span>
                            <span className="text-[11px] font-medium text-slate-500 truncate">{res.subtitle}</span>
                          </div>
                        </div>
                        <ArrowRight size={14} className="text-slate-300 opacity-0 group-hover/result:opacity-100 group-hover/result:-translate-x-1 transition-all shrink-0 ml-2" />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-xs font-bold text-slate-600">No results found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-4 relative ml-auto" ref={dropdownRef}>
          
          {/* Profile Button */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="h-10 w-10 sm:h-9 sm:w-9 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] flex items-center justify-center text-xs font-bold text-[#0A7294] shadow-sm hover:scale-105 active:scale-95 transition-all"
          >
            SB
          </button>

          {/* Dropdown panel */}
          {open && (
            <div className="absolute right-0 top-14 w-56 rounded-2xl border border-slate-100 bg-white shadow-xl py-2 text-xs text-slate-700 z-[110] origin-top-right animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 pb-3 pt-2 border-b border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Signed in as</p>
                <p className="mt-1 text-sm font-bold text-slate-900 truncate">Sanket Bochare</p>
                <p className="text-[11px] font-medium text-slate-500 truncate">Super Admin</p>
              </div>
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