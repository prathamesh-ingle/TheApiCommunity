import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate as framerAnimate } from 'framer-motion';
import gsap from 'gsap';
import SplitType from 'split-type'; 
import { useGSAP } from '@gsap/react';
import { Database, Smartphone, Cloud, Server, Shield, Globe, Code2, Terminal, ArrowRight, Activity, Zap, Cpu, User, Mail, Phone, Sparkles } from 'lucide-react';
import ThreeBackground from '../components/ThreeBackground'; 
import toast, { Toaster } from 'react-hot-toast'; // --- NEW: Added for form notifications

// --- AOS IMPORTS ---
import AOS from 'aos';
import 'aos/dist/aos.css';

// --- ANIMATED COUNTER ---
const AnimatedCounter = ({ from, to }) => {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = framerAnimate(count, to, { duration: 2.5, ease: "easeOut", delay: 0.8 });
    return controls.stop;
  }, [count, to]);

  return <motion.span>{rounded}</motion.span>;
};

// --- FRAMER MOTION VARS ---
const containerVars = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } } };
const itemVars = { hidden: { opacity: 0, y: 25, filter: "blur(4px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: 'spring', stiffness: 50, damping: 14 } } };
const floatAnim = (delay = 0) => ({ y: [0, -12, 0], transition: { duration: 5 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut', delay } });

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";
// Drop waves animation
const dropWaveAnim = (delay = 0) => ({ 
  scale: [0.8, 2.5, 4], 
  opacity: [0.5, 0.15, 0], 
  borderWidth: ["2px", "1px", "0px"], 
  transition: { duration: 4.5, delay, repeat: Infinity, ease: "easeOut" } 
});

const HomePage = () => {
  const bgRef = useRef(null);
  const headingRef = useRef(null);
  const splitRef = useRef(null);
  const [eventsData, setEventsData] = useState({ topRow: [], bottomRow: [] });

  // --- NEW: FORM STATE & HANDLERS ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    intrest: ""
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const tId = toast.loading("Submitting application...");

    try {
      const response = await fetch(`${API_BASE_URL}/user/application-form`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok || response.status === 201) {
        toast.success("Application submitted successfully!", { id: tId });
        setFormData({ name: "", phone: "", email: "", intrest: "" }); // Reset
      } else {
        toast.error(data.message || "Failed to submit. Email might exist.", { id: tId });
      }
    } catch (error) {
      toast.error("Server error. Please try again.", { id: tId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- INITIALIZE AOS & FETCH EVENTS ---
  useEffect(() => {
    AOS.init({
      duration: 700, 
      once: false, 
      mirror: true, 
      easing: 'ease-out-cubic', 
      offset: 50,    
    });
    window.scrollTo(0, 0);

    fetch('/events.json')
      .then((response) => response.json())
      .then((data) => setEventsData(data))
      .catch((error) => console.error("Error loading events data:", error));
  }, []);

  // --- GSAP AMBIENT BACKGROUND & HOVER ANIMATIONS ---
  useGSAP(() => {
    // 1. Grid Background Animation
    gsap.to(".gsap-grid", { 
      backgroundPosition: "40px 40px", 
      duration: 20, 
      repeat: -1, 
      ease: "none" 
    });
    
    // 2. Floating Orbs
    gsap.to(".gsap-orb-1", { x: "6vw", y: "8vh", scale: 1.15, rotation: 15, duration: 14, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".gsap-orb-2", { x: "-8vw", y: "-12vh", scale: 1.25, rotation: -15, duration: 17, repeat: -1, yoyo: true, ease: "sine.inOut" });

    // 3. Interactive Glass Nodes
    const nodes = document.querySelectorAll('.gsap-hover-node');
    nodes.forEach(node => {
      const hoverTl = gsap.timeline({ paused: true });
      hoverTl.to(node, {
        scale: 1.25, 
        boxShadow: "0 30px 60px -12px rgba(10,114,148,0.3), inset 0 1px 0 rgba(255,255,255,1)",
        zIndex: 50,
        duration: 0.4,
        ease: "back.out(1.5)"
      });
      node.addEventListener("mouseenter", () => hoverTl.play());
      node.addEventListener("mouseleave", () => hoverTl.reverse());
    });

    // 4. Split Text Hero Reveal
    if (headingRef.current) {
      if (splitRef.current) splitRef.current.revert();
      
      splitRef.current = new SplitType(headingRef.current, { types: "chars,words,lines" });
      
      gsap.from(splitRef.current.chars, {
        opacity: 0,
        rotationX: -90,
        y: 50,
        z: -200,
        transformOrigin: "50% 50% -100px",
        duration: 1.2,
        stagger: 0.02,
        ease: "back.out(1.2)",
        delay: 0.2
      });

      headingRef.current.addEventListener("mouseenter", () => {
        gsap.to(splitRef.current.chars, {
          y: -15,
          rotationZ: "random(-10, 10)",
          color: "#0A7294",
          stagger: { amount: 0.4, from: "center" },
          duration: 0.5,
          ease: "back.out(2)"
        });
      });

      headingRef.current.addEventListener("mouseleave", () => {
        gsap.to(splitRef.current.chars, {
          y: 0,
          rotationZ: 0,
          color: "inherit", 
          stagger: { amount: 0.3, from: "edges" },
          duration: 0.6,
          ease: "power3.out"
        });
      });
    }

    return () => {
      if (splitRef.current) splitRef.current.revert();
    };

  }, { scope: bgRef });

  // --- SCROLL TO FORM FUNCTION ---
  const scrollToForm = () => {
    const formElement = document.getElementById("join-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const baseGlass = "gsap-hover-node bg-white/60 backdrop-blur-xl border border-white/80 transition-colors duration-300 hover:bg-white/90";

  return (
    <div className="relative w-full bg-[#FCFCFD] font-sans overflow-x-hidden" ref={bgRef}>
      {/* --- NEW: Toaster Component for UI Feedback --- */}
      <Toaster position="top-center" />
      
      {/* ========================================== */}
      {/* 1. HERO SECTION                            */}
      {/* ========================================== */}
      <div className="relative flex min-h-[calc(100vh-80px)] items-center pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.025] mix-blend-overlay" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
        <ThreeBackground />

        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="gsap-grid absolute inset-0 bg-[linear-gradient(to_right,#0A729415_1px,transparent_1px),linear-gradient(to_bottom,#0A729415_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_100%,transparent_100%)]" style={{ backgroundPosition: '0px 0px' }} />
          <div className="gsap-orb-1 absolute top-[-5%] left-[-5%] h-[650px] w-[650px] rounded-full bg-gradient-to-br from-[#0A7294]/[0.08] to-transparent blur-[120px]" />
          <div className="gsap-orb-2 absolute bottom-[-5%] right-[-5%] h-[750px] w-[750px] rounded-full bg-gradient-to-tl from-[#22B3AD]/[0.09] to-transparent blur-[130px]" />
          <div className="absolute top-[30%] left-[40%] h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-[#FF9A3D]/[0.05] to-transparent blur-[120px]" />
        </div>

        <main className="relative z-20 mx-auto grid w-full max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:py-0 pb-12 sm:pb-0">
          
          <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-8 text-center lg:text-left z-20">
            <motion.div variants={itemVars} whileHover={{ scale: 1.05, y: -2 }} className="inline-flex cursor-pointer items-center gap-2 px-5 py-2 rounded-full bg-white/80 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] border border-white mx-auto lg:mx-0 transition-shadow hover:shadow-[0_8px_25px_rgba(255,154,61,0.2),inset_0_1px_0_rgba(255,255,255,1)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF9A3D] opacity-60"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF9A3D]"></span>
              </span>
              <span className="text-[10px] font-bold text-[#FF9A3D] tracking-widest uppercase">Global API Network</span>
            </motion.div>

            <h1 ref={headingRef} className="text-[3.5rem] font-extrabold leading-[1.02] tracking-[-0.04em] text-[#0A0A0A] sm:text-6xl lg:text-[5.5rem] drop-shadow-sm cursor-pointer perspective-[500px]">
              Join Our<br />
              <span className="italic font-serif font-normal text-[#0A7294] pr-4 pb-2 block">Community.</span>
            </h1>

            <motion.p variants={itemVars} className="mx-auto max-w-md text-lg font-medium leading-relaxed text-[#52525B] lg:mx-0">
              A space for developers to collaborate, explore, and shape the future of APIs. Connect your systems, connect with peers.
            </motion.p>

            <motion.div variants={itemVars} className="flex flex-col items-center gap-5 pt-4 sm:flex-row sm:justify-center lg:justify-start">
              <button onClick={scrollToForm} className="blob-btn group flex w-full sm:w-auto items-center justify-center gap-2 px-9 py-4 text-[15px] font-bold text-slate-900">
                <Terminal className="h-4 w-4 relative z-10 transition-colors duration-300 group-hover:text-white" />
                <span className="relative z-10">Join Community</span>
                <span className="blob-btn__inner">
                  <span className="blob-btn__blobs">
                    <span className="blob-btn__blob"></span>
                    <span className="blob-btn__blob"></span>
                    <span className="blob-btn__blob"></span>
                    <span className="blob-btn__blob"></span>
                  </span>
                </span>
              </button>
              
              <button className="btn-ripple flex w-full sm:w-auto items-center justify-center gap-2 rounded-full px-9 py-4 text-[15px] font-bold text-slate-700">
                Explore Events
                <ArrowRight className="w-4 h-4 text-[#22B3AD]" />
              </button>
            </motion.div>

            <motion.div variants={itemVars} className="flex flex-wrap items-center justify-center lg:justify-start gap-12 pt-8">
              <div>
                <p className="text-[10px] font-bold text-[#A1A1AA] mb-2 tracking-wider uppercase">Trusted by 10,000+ Devs</p>
                <div className="flex -space-x-3 justify-center lg:justify-start">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.img whileHover={{ y: -5, scale: 1.15, zIndex: 10 }} key={i} src={`https://i.pravatar.cc/100?img=${i+40}`} alt="developer" className="w-10 h-10 cursor-pointer rounded-full border-2 border-white object-cover shadow-sm transition-transform duration-300" />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#A1A1AA] mb-2 tracking-wider uppercase">Network Traffic</p>
                <div className="flex items-center gap-2 justify-center lg:justify-start group cursor-default bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white shadow-sm">
                  <div className="p-1 bg-[#FF9A3D]/10 rounded-lg">
                    <Code2 className="w-4 h-4 text-[#FF9A3D] group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                  <span className="font-bold text-[#0A0A0A] text-lg tracking-tight">
                    <AnimatedCounter from={1} to={15} />M+ <span className="text-sm font-medium text-gray-500">Calls/Day</span>
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <div className="relative flex h-[360px] w-full items-center justify-center sm:h-[420px] lg:h-[550px] z-20">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <motion.div className="absolute h-40 w-40 rounded-full border-[#0A7294]/40" animate={dropWaveAnim(0)} />
              <motion.div className="absolute h-40 w-40 rounded-full border-[#22B3AD]/30" animate={dropWaveAnim(1.1)} />
              <motion.div className="absolute h-40 w-40 rounded-full border-[#FF9A3D]/20" animate={dropWaveAnim(2.2)} />
            </div>

            <motion.div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-80" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ duration: 1.5 }}>
              <motion.div className="absolute h-[240px] w-[240px] rounded-full border border-slate-300/60 border-dashed" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}>
                <div className="absolute top-0 left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0A7294]/90 shadow-[0_0_10px_#0A7294]"></div>
              </motion.div>
              <motion.div className="absolute h-[340px] w-[340px] rounded-full border border-slate-200" animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}>
                 <div className="absolute top-1/2 right-0 h-3 w-3 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#22B3AD]/90 shadow-[0_0_10px_#22B3AD]"></div>
              </motion.div>
              <motion.div className="absolute h-[460px] w-[460px] hidden sm:block rounded-full border border-slate-200/60 border-dashed" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}>
                 <div className="absolute bottom-1/4 right-[10%] h-2.5 w-2.5 translate-x-1/2 translate-y-1/2 rounded-full bg-[#FF9A3D]/90 shadow-[0_0_10px_#FF9A3D]"></div>
              </motion.div>
            </motion.div>

            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1, type: 'spring', bounce: 0.5 }} className="absolute z-30 flex h-36 w-36 cursor-pointer items-center justify-center rounded-full bg-white shadow-[0_20px_50px_rgba(10,114,148,0.15)] border-[3px] border-white relative transition-transform hover:scale-105 group">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-[-12px] rounded-full border-[1.5px] border-transparent border-t-[#0A7294]/50" />
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute inset-[-20px] rounded-full border-[1px] border-dashed border-[#22B3AD]/40" />
              <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 bg-gradient-to-tr from-[#0A7294] to-[#22B3AD] rounded-full filter blur-xl group-hover:from-[#FF9A3D] transition-colors duration-500" />
              <img src="/logo.png" alt="API Logo" className="h-16 w-16 object-contain relative z-10 drop-shadow-sm group-hover:scale-110 transition-transform duration-500" />
            </motion.div>

            <div className="absolute inset-0 z-40">
              <motion.div animate={{ ...floatAnim(0), rotate: [0, 4, -4, 0] }} className={`absolute cursor-pointer left-[20%] top-[15%] flex items-center justify-center p-2 rounded-[1.2rem] shadow-[0_8px_20px_rgba(10,114,148,0.15)] ${baseGlass}`}>
                <div className="bg-gradient-to-br from-[#0A7294] to-[#065069] p-3 rounded-xl shadow-inner"><motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}><Smartphone className="h-5 w-5 text-white" /></motion.div></div>
              </motion.div>
              <motion.div animate={{ ...floatAnim(1), rotate: [0, -5, 3, 0] }} className={`absolute cursor-pointer right-[16%] top-[20%] flex items-center justify-center p-2 rounded-[1.2rem] shadow-[0_8px_20px_rgba(34,179,173,0.15)] ${baseGlass}`}>
                <div className="bg-gradient-to-br from-[#22B3AD] to-[#168580] p-3 rounded-xl shadow-inner"><motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2.2, repeat: Infinity, delay: 0.5 }}><Database className="h-5 w-5 text-white" /></motion.div></div>
              </motion.div>
              <motion.div animate={{ ...floatAnim(0.5), rotate: [0, 4, -4, 0] }} className={`absolute cursor-pointer bottom-[25%] left-[12%] flex items-center justify-center p-2 rounded-[1.2rem] shadow-[0_8px_20px_rgba(168,85,247,0.15)] ${baseGlass}`}>
                 <div className="bg-gradient-to-br from-[#a855f7] to-[#7e22ce] p-3 rounded-xl shadow-inner"><motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}><Cloud className="h-5 w-5 text-white" /></motion.div></div>
              </motion.div>
              <motion.div animate={{ ...floatAnim(1.5), rotate: [0, -4, 4, 0] }} className={`absolute cursor-pointer bottom-[18%] right-[20%] flex items-center justify-center p-2 rounded-[1.2rem] shadow-[0_8px_20px_rgba(255,154,61,0.15)] ${baseGlass}`}>
                 <div className="bg-gradient-to-br from-[#FF9A3D] to-[#cc711e] p-3 rounded-xl shadow-inner"><motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}><Server className="h-5 w-5 text-white" /></motion.div></div>
              </motion.div>
              <motion.div animate={{ ...floatAnim(0.8), rotate: [0, 6, -6, 0] }} className={`absolute cursor-pointer right-[10%] top-[45%] flex items-center justify-center p-1.5 rounded-full shadow-[0_8px_20px_rgba(16,185,129,0.15)] ${baseGlass}`}>
                 <div className="bg-gradient-to-br from-[#10b981] to-[#047857] p-2.5 rounded-full shadow-inner"><motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2.3, repeat: Infinity, delay: 0.8 }}><Shield className="h-4 w-4 text-white" /></motion.div></div>
              </motion.div>
              <motion.div animate={{ ...floatAnim(1.2), rotate: [0, -5, 5, 0] }} className={`absolute cursor-pointer bottom-[45%] left-[8%] flex items-center justify-center p-1.5 rounded-full shadow-[0_8px_20px_rgba(71,85,105,0.15)] ${baseGlass}`}>
                 <div className="bg-gradient-to-br from-[#64748b] to-[#334155] p-2.5 rounded-full shadow-inner"><motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2.6, repeat: Infinity, delay: 1.2 }}><Globe className="h-4 w-4 text-white" /></motion.div></div>
              </motion.div>
            </div>
          </div>
        </main>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none z-10 translate-y-[1px]">
          <svg className="relative block w-full h-[8vh] min-h-[60px] max-h-[120px]" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none">
            <defs><path id="wave-path" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"></path></defs>
            <g className="animate-wave1"><use xlinkHref="#wave-path" x="50" y="3" fill="rgba(10, 114, 148, 0.025)"></use></g>
            <g className="animate-wave2"><use xlinkHref="#wave-path" x="50" y="0" fill="rgba(34, 179, 173, 0.04)"></use></g>
            <g className="animate-wave3"><use xlinkHref="#wave-path" x="50" y="9" fill="#ffffff"></use></g>
          </svg>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" className="absolute w-0 h-0">
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10"></feGaussianBlur>
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 21 -7" result="goo"></feColorMatrix>
              <feBlend in2="goo" in="SourceGraphic" result="mix"></feBlend>
            </filter>
          </defs>
        </svg>
      </div>

      {/* ========================================== */}
      {/* 2. LIVE COMMUNITY STATS SECTION (AOS)        */}
      {/* ========================================== */}
      <section className="w-full bg-white relative z-20 pt-10 pb-24 font-sans -mt-[2px]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
            <div className="max-w-2xl" data-aos="fade-down">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-2 w-2 rounded-full bg-[#16B3AA]"></span>
                <span className="text-[11px] font-bold text-[#16B3AA] tracking-[0.15em] uppercase">Live Community Stats</span>
              </div>
              <h2 className="text-4xl sm:text-[3.25rem] font-black text-[#0A0A0A] tracking-[-0.03em] leading-[1.1] mb-5">
                Real-time API momentum, <br className="hidden sm:block" />visualized.
              </h2>
              <p className="text-[1.1rem] text-[#52525B] max-w-[500px] leading-relaxed font-medium">
                Watch the network grow with every call, deploy, and merge. Designed for builders who love beautiful telemetry.
              </p>
            </div>
            
            <div className="relative pb-3 w-fit" data-aos="fade-down" data-aos-delay="100">
              <span className="text-[13px] font-medium text-[#71717A] mb-1 block">Updates every few seconds</span>
              <div className="absolute bottom-0 left-0 h-[2px] w-full bg-[#F4F4F5] overflow-hidden">
                <motion.div className="h-full bg-[#0A7294]" style={{ width: "100%" }} animate={{ x: ["-100%", "0%", "100%"] }} transition={{ duration: 3, ease: "linear", repeat: Infinity }} />
              </div>
            </div>
          </div>

          <hr className="border-[#F4F4F5] mb-16" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div data-aos="fade-up" data-aos-delay="0" className="group relative p-[2px] rounded-[2rem] hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
              <div className="absolute inset-0 bg-gradient-to-r from-[#0284C7] to-[#22B3AD] rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex flex-col relative bg-white p-7 sm:p-8 rounded-[calc(2rem-2px)] h-full z-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0F9FF] mb-6"><Activity strokeWidth={2} className="h-6 w-6 text-[#0284C7]" /></div>
                <div className="text-[11px] font-bold text-[#A1A1AA] tracking-[0.15em] uppercase mb-2">Daily API Calls</div>
                <div className="text-[3.25rem] font-black text-[#0A0A0A] tracking-[-0.04em] leading-none mb-5">15M<span className="text-[#0284C7]">+</span></div>
                <div className="flex items-center mt-auto text-[13px] font-medium text-[#71717A] bg-gray-50/80 px-3 py-2 rounded-xl border border-gray-100 w-fit">
                  <Zap className="h-4 w-4 text-[#10B981] mr-1.5" fill="currentColor" /><span className="text-[#10B981] font-bold mr-1.5">+18%</span> vs last week
                </div>
              </div>
            </div>

            <div data-aos="fade-up" data-aos-delay="100" className="group relative p-[2px] rounded-[2rem] hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
              <div className="absolute inset-0 bg-gradient-to-r from-[#A855F7] to-[#ec4899] rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex flex-col relative bg-white p-7 sm:p-8 rounded-[calc(2rem-2px)] h-full z-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FAF5FF] mb-6"><Globe strokeWidth={2} className="h-6 w-6 text-[#A855F7]" /></div>
                <div className="text-[11px] font-bold text-[#A1A1AA] tracking-[0.15em] uppercase mb-2">Active Regions</div>
                <div className="text-[3.25rem] font-black text-[#0A0A0A] tracking-[-0.04em] leading-none mb-5">120<span className="text-[#A855F7]">+</span></div>
                <div className="mt-auto text-[13px] font-medium text-[#71717A] bg-gray-50/80 px-3 py-2 rounded-xl border border-gray-100 w-fit">Edge-optimized delivery</div>
              </div>
            </div>

            <div data-aos="fade-up" data-aos-delay="200" className="group relative p-[2px] rounded-[2rem] hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
              <div className="absolute inset-0 bg-gradient-to-r from-[#10B981] to-[#3b82f6] rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex flex-col relative bg-white p-7 sm:p-8 rounded-[calc(2rem-2px)] h-full z-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ECFDF5] mb-6"><Shield strokeWidth={2} className="h-6 w-6 text-[#10B981]" /></div>
                <div className="text-[11px] font-bold text-[#A1A1AA] tracking-[0.15em] uppercase mb-2">System Uptime</div>
                <div className="text-[3.25rem] font-black text-[#0A0A0A] tracking-[-0.04em] leading-none mb-5 flex items-baseline">99.99<span className="text-3xl text-[#10B981] ml-1">%</span></div>
                <div className="mt-auto text-[13px] font-medium text-[#71717A] bg-gray-50/80 px-3 py-2 rounded-xl border border-gray-100 w-fit">Self-healing infrastructure</div>
              </div>
            </div>

            <div data-aos="fade-up" data-aos-delay="300" className="group relative p-[2px] rounded-[2rem] hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
              <div className="absolute inset-0 bg-gradient-to-r from-[#F97316] to-[#facc15] rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex flex-col relative bg-white p-7 sm:p-8 rounded-[calc(2rem-2px)] h-full z-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF7ED] mb-6"><Cpu strokeWidth={2} className="h-6 w-6 text-[#F97316]" /></div>
                <div className="text-[11px] font-bold text-[#A1A1AA] tracking-[0.15em] uppercase mb-2">Builders Online</div>
                <div className="text-[3.25rem] font-black text-[#0A0A0A] tracking-[-0.04em] leading-none mb-5">10k<span className="text-[#F97316]">+</span></div>
                <div className="mt-auto text-[13px] font-medium text-[#71717A] bg-gray-50/80 px-3 py-2 rounded-xl border border-gray-100 w-fit">Pairing, shipping, scaling</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 3. PREMIUM "STAY CONNECTED" FORM SECTION   */}
      {/* ========================================== */}
      <section id="join-form" className="w-full bg-[#FAFAFA] relative z-20 py-20 lg:py-32 font-sans border-t border-gray-100 overflow-hidden">
        
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#0A7294]/[0.06] to-transparent blur-[80px]"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#22B3AD]/[0.06] to-transparent blur-[100px]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        </div>

        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
            
            <div data-aos="fade-right" className="lg:col-span-5 flex flex-col justify-center text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-8 mx-auto lg:mx-0 w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF9A3D] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF9A3D]"></span>
                </span>
                <span className="text-[11px] font-bold text-[#52525B] tracking-[0.2em] uppercase">Join The Network</span>
              </div>
              <h2 className="text-4xl sm:text-[3.25rem] font-black text-[#0A0A0A] tracking-[-0.03em] leading-[1.1] mb-6">
                Let's build the <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A7294] to-[#22B3AD]">future together.</span>
              </h2>
              <p className="text-[1.1rem] text-[#52525B] leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
                Whether you're a seasoned architect or just starting out, there's a place for you here. Tell us how you'd like to get involved.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <img key={i} src={`https://i.pravatar.cc/150?img=${i + 10}`} alt="Member" className="w-12 h-12 rounded-full border-[3px] border-[#FAFAFA] object-cover shadow-sm" />
                  ))}
                  <div className="w-12 h-12 rounded-full border-[3px] border-[#FAFAFA] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 shadow-sm z-10">
                    +2k
                  </div>
                </div>
                <div className="text-sm font-medium text-[#71717A]">
                  Join <span className="font-bold text-[#0A0A0A]">2,000+</span> creators
                </div>
              </div>
            </div>

            {/* --- CONNECTED FORM --- */}
            <div data-aos="fade-left" data-aos-delay="100" className="lg:col-span-7 lg:pl-10 relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#0A7294] via-[#22B3AD] to-[#FF9A3D] rounded-[2.5rem] blur-xl opacity-20 animate-pulse"></div>
              
              <div className="relative bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white/60 backdrop-blur-xl">
                
                {/* --- NEW: ADDED onSubmit to form --- */}
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="relative group">
                      <label className="block text-[12px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2 ml-1">Your Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400 group-focus-within:text-[#0A7294] transition-colors" />
                        </div>
                        <input 
                          type="text" 
                          name="name" // Added name
                          value={formData.name} // Bound to state
                          onChange={handleInputChange} // Added handler
                          required // Added required
                          placeholder="John Doe" 
                          className="w-full pl-12 pr-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:border-[#22B3AD] focus:ring-4 focus:ring-[#22B3AD]/10 outline-none transition-all text-[#0A0A0A] placeholder-gray-400 font-medium text-[15px]"
                        />
                      </div>
                    </div>
                    
                    <div className="relative group">
                      <label className="block text-[12px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2 ml-1">Phone Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-[#0A7294] transition-colors" />
                        </div>
                        <input 
                          type="tel" 
                          name="phone" // Added name
                          value={formData.phone} // Bound to state
                          onChange={handleInputChange} // Added handler
                          required // Added required
                          placeholder="+91 1234567890" 
                          className="w-full pl-12 pr-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:border-[#22B3AD] focus:ring-4 focus:ring-[#22B3AD]/10 outline-none transition-all text-[#0A0A0A] placeholder-gray-400 font-medium text-[15px]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="relative group">
                    <label className="block text-[12px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2 ml-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#0A7294] transition-colors" />
                      </div>
                      <input 
                        type="email" 
                        name="email" // Added name
                        value={formData.email} // Bound to state
                        onChange={handleInputChange} // Added handler
                        required // Added required
                        placeholder="john@example.com" 
                        className="w-full pl-12 pr-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:border-[#22B3AD] focus:ring-4 focus:ring-[#22B3AD]/10 outline-none transition-all text-[#0A0A0A] placeholder-gray-400 font-medium text-[15px]"
                      />
                    </div>
                  </div>

                  <div className="relative group">
                    <label className="block text-[12px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2 ml-1">Your Interest</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <Sparkles className="h-5 w-5 text-gray-400 group-focus-within:text-[#0A7294] transition-colors" />
                      </div>
                      <select 
                        name="intrest" // Added name
                        value={formData.intrest} // Bound to state
                        onChange={handleInputChange} // Added handler
                        required // Added required
                        className="w-full pl-12 pr-10 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:border-[#22B3AD] focus:ring-4 focus:ring-[#22B3AD]/10 outline-none transition-all text-[#0A0A0A] font-medium text-[15px] appearance-none cursor-pointer relative z-0"
                      >
                        <option value="" disabled>Select an option...</option>
                        {/* --- NEW: Values matched EXACTLY to your backend enum --- */}
                        <option value="volunteer">Volunteer</option>
                        <option value="Management">Management</option>
                        <option value="Social Creation">Social Creation</option>
                        <option value="Design">Design</option>
                      </select>
                      <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none z-10">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* --- NEW: Changed to type="submit" and added disabled state --- */}
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full mt-4 relative overflow-hidden group flex items-center justify-center gap-2 bg-[#0A0A0A] text-white font-bold py-4.5 px-8 rounded-2xl transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(10,114,148,0.8)] hover:-translate-y-1 disabled:opacity-70 disabled:hover:-translate-y-0"
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#0A7294] to-[#22B3AD] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 text-[16px] py-4">
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </span>
                    {!isSubmitting && <ArrowRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1.5" />}
                  </button>
                  
                  <p className="text-center text-xs font-medium text-gray-400 mt-4">
                    Your data is secure. We never share your information.
                  </p>

                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
      
    </div>
  );
};

export default HomePage;