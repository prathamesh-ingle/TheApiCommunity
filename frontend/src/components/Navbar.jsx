import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Info, Calendar, Mic, Users, ArrowRight } from 'lucide-react';

const navItems = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'About', to: '/about', icon: Info },
  { label: 'Events', to: '/events', icon: Calendar },
  { label: 'Speakers', to: '/speakers', icon: Mic },
  { label: 'Team', to: '/team', icon: Users },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // --- SMART SCROLL LOGIC ---
  const scrollToForm = () => {
    setIsOpen(false); // Close mobile menu if open
    
    if (location.pathname !== '/') {
      // 1. Navigate to the homepage
      navigate('/');
      
      // 2. Smart polling: check every 100ms if the form has loaded into the DOM
      let checkCount = 0;
      const checkInterval = setInterval(() => {
        const form = document.getElementById("join-form");
        if (form) {
          form.scrollIntoView({ behavior: "smooth", block: "start" });
          clearInterval(checkInterval); // Stop checking once found
        }
        checkCount++;
        // Safety switch: stop checking after 20 attempts (2 seconds)
        if (checkCount > 20) clearInterval(checkInterval); 
      }, 100);

    } else {
      // If already on homepage, just scroll immediately
      setTimeout(() => {
        const form = document.getElementById("join-form");
        if (form) form.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  };

  return (
    <>
      {/* --- FIXED STATIC NAVBAR --- */}
      <header className="fixed top-0 inset-x-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 h-16 lg:h-20 flex items-center justify-between">
          
          {/* --- LOGO SECTION --- */}
          <Link to="/" className="group flex items-center gap-3 relative z-50">
            <div className="relative flex items-center justify-center">
              <img
                src="/logo.png"
                alt="API Logo"
                className="h-8 w-8 sm:h-10 sm:w-10 object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-[#0A7294] to-[#22B3AD] blur-xl rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-[15px] sm:text-[17px] font-black tracking-tight text-slate-800 group-hover:text-[#0A7294] transition-colors duration-300">
                The API <span className="text-[#22B3AD]">Community</span>
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] text-[#FF9A3D]">
                Innovation Hub
              </span>
            </div>
          </Link>

          {/* --- DESKTOP NAVIGATION (Soft Magic Underline) --- */}
          <nav className="hidden lg:flex items-center gap-8 h-full">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="relative flex items-center h-full text-[12px] font-bold uppercase tracking-widest text-slate-500 hover:text-[#0A7294] transition-colors duration-300 group"
              >
                {({ isActive }) => (
                  <>
                    <span className={isActive ? 'text-[#0A7294]' : ''}>
                      {item.label}
                    </span>
                    
                    {/* Active State Bottom Border */}
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-border"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#0A7294] to-[#22B3AD] rounded-t-full"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    
                    {/* Hover State Underline (Only shows if NOT active) */}
                    {!isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-200 rounded-t-full opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* --- RIGHT ACTION AREA --- */}
          <div className="flex items-center gap-4 relative z-50">
            {/* Join Button (Desktop) */}
            <button 
              onClick={scrollToForm}
              className="hidden lg:flex items-center justify-center relative overflow-hidden group bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold text-[12px] uppercase tracking-wider transition-all duration-300 shadow-[0_4px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_15px_rgba(10,114,148,0.2)] hover:-translate-y-0.5 cursor-pointer"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#0A7294] to-[#22B3AD] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">Join Community</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className={`lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 cursor-pointer ${
                isOpen ? 'bg-slate-100' : 'bg-slate-50/50 hover:bg-slate-100'
              }`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              <div className="flex flex-col items-center justify-center w-4 h-3.5 gap-[3.5px] relative">
                <motion.span 
                  animate={isOpen ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }} 
                  className="w-full h-[2px] bg-slate-800 rounded-full block origin-center transition-all duration-300"
                />
                <motion.span 
                  animate={isOpen ? { opacity: 0, x: 10 } : { opacity: 1, x: 0 }} 
                  className="w-[70%] h-[2px] bg-slate-800 rounded-full block transition-all duration-300"
                />
                <motion.span 
                  animate={isOpen ? { rotate: -45, y: -5.5 } : { rotate: 0, y: 0 }} 
                  className="w-full h-[2px] bg-slate-800 rounded-full block origin-center transition-all duration-300"
                />
              </div>
            </button>
          </div>
          
        </div>
      </header>

      {/* --- MOBILE FLOATING DROPDOWN MENU --- */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Invisible Backdrop to close menu when clicking outside */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[80] bg-slate-900/20 backdrop-blur-sm lg:hidden"
            />

            {/* Floating Glass Dropdown Card */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed top-[72px] left-4 right-4 z-[90] bg-white/95 backdrop-blur-xl rounded-[1.5rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 p-3 flex flex-col gap-1 lg:hidden"
            >
              {/* Navigation Links */}
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-slate-50/80 text-[#0A7294]' 
                        : 'bg-transparent text-slate-600 active:bg-slate-50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon 
                        size={18} 
                        strokeWidth={isActive ? 2.5 : 2} 
                        className={isActive ? 'text-[#22B3AD]' : 'text-slate-400'}
                      />
                      <span className={`text-[15px] font-bold ${isActive ? 'text-[#0A7294]' : 'text-slate-700'}`}>
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}

              {/* Mobile Join Button inside the dropdown */}
              <div className="mt-2 pt-2 border-t border-slate-100">
                <button 
                  onClick={scrollToForm}
                  className="w-full relative overflow-hidden group bg-slate-900 text-white py-3.5 px-4 rounded-xl font-bold text-[13px] uppercase tracking-wider flex items-center justify-center shadow-sm"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#0A7294] to-[#22B3AD] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center gap-2">
                    Join Community <ArrowRight size={16} />
                  </span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;