// frontend/src/components/Navbar.jsx
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, Zap } from 'lucide-react';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Events', to: '/events' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 z-[100] w-full border-b border-white/20 bg-white/70 backdrop-blur-xl transition-all duration-300"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* --- LOGO SECTION --- */}
        <Link to="/" className="group flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <motion.img
              whileHover={{ rotate: 12, scale: 1.1 }}
              src="/logo.png"
              alt="API Logo"
              className="h-10 w-10 object-contain sm:h-12 sm:w-12 transition-transform duration-300"
            />
            {/* Attractive glow matched to your UI Orbs */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-[#0A7294] to-[#22B3AD] blur-xl rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-lg font-black tracking-tight text-slate-900 group-hover:text-[#0A7294] transition-colors duration-300">
              The API <span className="text-[#22B3AD]">Community</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF9A3D] opacity-80 group-hover:opacity-100 transition-opacity">Innovation Hub</span>
          </div>
        </Link>

        {/* --- DESKTOP NAVIGATION --- */}
        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative px-5 py-2 text-[13px] font-bold uppercase tracking-wider transition-all duration-300 rounded-full group ${
                  isActive ? 'text-[#0A7294]' : 'text-slate-600 hover:text-[#0A7294]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-[#0A7294]/5 border border-[#0A7294]/10 shadow-inner"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  {/* High-tech animated underline hover */}
                  <motion.div 
                    className="absolute bottom-1 left-1/2 h-[2px] w-0 bg-gradient-to-r from-[#0A7294] to-[#22B3AD] -translate-x-1/2 rounded-full"
                    whileHover={{ width: '60%' }}
                    transition={{ duration: 0.3 }}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* --- RIGHT ACTION AREA --- */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="group relative hidden overflow-hidden sm:flex items-center gap-2 rounded-full bg-[#0A0A0A] px-7 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg transition-all hover:scale-[1.03] active:scale-95"
          >
            {/* Premium Shimmer Background */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_2s_infinite]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A7294] to-[#22B3AD] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <Zap className="relative z-10 h-3.5 w-3.5 text-[#FF9A3D] fill-[#FF9A3D]" />
            <span className="relative z-10">Join Community</span>
            <ChevronRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          {/* Mobile Menu Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition-all duration-300 md:hidden ${
                isOpen ? 'bg-[#0A7294] border-[#0A7294] text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
            }`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </motion.button>
        </div>

        {/* --- MOBILE OVERLAY MENU --- */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-x-4 top-[84px] z-40 flex flex-col rounded-[2.5rem] bg-white/95 p-8 border border-slate-100 shadow-2xl backdrop-blur-2xl md:hidden"
            >
              <div className="flex flex-col gap-6 text-center">
                {navItems.map((item, idx) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <NavLink
                      to={item.to}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) => 
                        `text-2xl font-black uppercase tracking-tighter transition-all duration-300 ${
                          isActive ? 'text-[#0A7294] scale-105' : 'text-slate-400'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </motion.div>
                ))}
                
                <div className="mt-4 flex flex-col gap-4 border-t border-slate-100 pt-8">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex w-full items-center justify-center gap-3 rounded-[1.5rem] bg-gradient-to-r from-[#0A7294] to-[#22B3AD] py-5 text-lg font-black uppercase tracking-widest text-white shadow-xl shadow-[#0A7294]/20"
                  >
                    Join now <ChevronRight />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Navbar;