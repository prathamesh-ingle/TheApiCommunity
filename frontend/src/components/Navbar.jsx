// frontend/src/components/Navbar.jsx
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, Zap } from 'lucide-react';

const navItems = [
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
      className="fixed top-0 z-[100] w-full border-b border-white/20 bg-white/70 backdrop-blur-xl transition-colors duration-300"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* --- LOGO SECTION --- */}
        <Link to="/" className="group flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <motion.img
              whileHover={{ rotate: 12, scale: 1.1 }}
              src="/logo.png"
              alt="API Logo"
              className="h-10 w-10 object-contain sm:h-12 sm:w-12"
            />
            {/* Soft glow behind logo */}
            <div className="absolute inset-0 -z-10 bg-[#0A7294]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-lg font-bold tracking-tight text-slate-900">
              The API <span className="text-[#22B3AD]">Community</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF9A3D]">Innovation Hub</span>
          </div>
        </Link>

        {/* --- DESKTOP NAVIGATION --- */}
        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative px-5 py-2 text-sm font-semibold transition-all duration-300 rounded-full hover:text-[#0A7294] ${
                  isActive ? 'text-[#0A7294]' : 'text-slate-600'
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
                  {/* Subtle underline hover effect */}
                  <motion.div 
                    className="absolute bottom-1 left-1/2 h-[2px] w-0 bg-[#0A7294] -translate-x-1/2 rounded-full"
                    whileHover={{ width: '40%' }}
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
            className="group relative hidden overflow-hidden sm:flex items-center gap-2 rounded-full bg-[#1A1A1A] px-7 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95"
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
            
            <Zap className="h-4 w-4 text-[#FF9A3D] fill-[#FF9A3D]" />
            <span className="relative z-10">Join Community</span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          {/* Mobile Menu Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5 text-slate-900" /> : <Menu className="h-5 w-5 text-slate-600" />}
          </motion.button>
        </div>

        {/* --- MOBILE OVERLAY MENU --- */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="fixed inset-0 top-[76px] z-40 flex h-[calc(100vh-76px)] w-full flex-col bg-white/95 p-8 backdrop-blur-2xl md:hidden"
            >
              <div className="flex flex-col gap-6 text-center">
                {navItems.map((item, idx) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <NavLink
                      to={item.to}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) => 
                        `text-3xl font-extrabold tracking-tighter transition-colors ${
                          isActive ? 'text-[#0A7294]' : 'text-slate-900'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </motion.div>
                ))}
                
                <div className="mt-8 flex flex-col gap-4">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex w-full items-center justify-center gap-3 rounded-full bg-[#0A7294] py-5 text-xl font-bold text-white shadow-xl shadow-[#0A7294]/20"
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