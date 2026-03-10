// frontend/src/components/Footer.jsx
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-white">
      {/* subtle gradient blob */}
      <div className="pointer-events-none absolute -top-32 right-[-80px] h-72 w-72 rounded-full bg-[#0A7294]/8 blur-[90px]" />

      <div className="mx-auto max-w-7xl px-5 pt-14 pb-7 sm:px-6 lg:px-8">
        <div className="mb-10 grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link to="/" className="mb-5 flex items-center gap-3">
              <motion.img
                whileHover={{ rotate: 12, scale: 1.1 }}
                src="/logo.png"
                alt="API Logo"
                className="h-10 w-10 object-contain sm:h-12 sm:w-12"
              />
              <span className="text-lg font-bold tracking-tight text-slate-900">
                The API Community
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-slate-500">
              Empowering developers to build, scale, and innovate with modern API architecture, real‑world patterns, and a collaborative global network.
            </p>
          </div>

          <div className="space-y-4 text-sm text-slate-500 md:col-span-2 md:col-start-7">
            <h4 className="mb-2 text-sm font-semibold text-slate-900">
              Platform
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <Link to="/events" className="hover:text-[#0A7294]">
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link to="/speakers" className="hover:text-[#0A7294]">
                  Our Speakers
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-[#0A7294]">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4 text-sm text-slate-500 md:col-span-2">
            <h4 className="mb-2 text-sm font-semibold text-slate-900">
              Company
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <Link to="/about" className="hover:text-[#0A7294]">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-[#0A7294]">
                  Tech Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#0A7294]">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4 md:col-span-2">
            <h4 className="mb-2 text-sm font-semibold text-slate-900">
              Follow Us
            </h4>
            <div className="flex flex-wrap gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 shadow-sm transition-all hover:bg-[#0A7294] hover:text-white"
              >
                <Twitter size={17} />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 shadow-sm transition-all hover:bg-[#0A7294] hover:text-white"
              >
                <Linkedin size={17} />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 shadow-sm transition-all hover:bg-[#0A7294] hover:text-white"
              >
                <Github size={17} />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-5 text-xs font-medium text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} The API Community. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/privacy" className="hover:text-slate-700">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-slate-700">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
