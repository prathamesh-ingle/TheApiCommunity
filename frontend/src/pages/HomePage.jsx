// frontend/src/pages/HomePage.jsx
import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate as framerAnimate } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Database, Smartphone, Cloud, Server, Shield, Globe, Code2, Terminal } from 'lucide-react';
import ThreeBackground from '../components/ThreeBackground'; // <-- Import the new 3D Background

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
const dropWaveAnim = (delay = 0) => ({ scale: [0.1, 1.8, 2.8], opacity: [1, 0.3, 0], borderWidth: ["6px", "1px", "0px"], transition: { duration: 4.5, delay, repeat: Infinity, ease: [0.16, 1, 0.3, 1] } });

const HomePage = () => {
  const bgRef = useRef(null);

  // --- GSAP AMBIENT BACKGROUND ANIMATIONS ---
  useGSAP(() => {
    gsap.to(".gsap-grid", { backgroundPosition: "40px 40px", duration: 5, repeat: -1, ease: "none" });
    gsap.to(".gsap-orb-1", { x: "6vw", y: "8vh", scale: 1.15, rotation: 15, duration: 14, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".gsap-orb-2", { x: "-8vw", y: "-12vh", scale: 1.25, rotation: -15, duration: 17, repeat: -1, yoyo: true, ease: "sine.inOut" });
  }, { scope: bgRef });

  const acrylicGlass = "bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)]";

  return (
    <div className="relative flex min-h-[calc(100vh-80px)] items-center overflow-hidden bg-[#FCFCFD] pt-24 pb-16 font-sans" ref={bgRef}>
      
      {/* --- 1. CINEMATIC NOISE GRAIN --- */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.025] mix-blend-overlay" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>

      {/* --- 2. THREE.JS 3D PARTICLE UNIVERSE --- */}
      <ThreeBackground />

      {/* --- 3. HIGH-END 2D BACKGROUND (Orbs & Grid) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="gsap-grid absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="gsap-orb-1 absolute top-[-5%] left-[-5%] h-[650px] w-[650px] rounded-full bg-gradient-to-br from-[#0A7294]/[0.06] to-transparent blur-[130px]" />
        <div className="gsap-orb-2 absolute bottom-[-5%] right-[-5%] h-[750px] w-[750px] rounded-full bg-gradient-to-tl from-[#22B3AD]/[0.07] to-transparent blur-[140px]" />
        <div className="absolute top-[30%] left-[40%] h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-[#FF9A3D]/[0.04] to-transparent blur-[120px]" />
      </div>

      {/* --- MAIN UI CONTENT --- */}
      <main className="relative z-20 mx-auto grid w-full max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:py-0">
        
        {/* LEFT COLUMN */}
        <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-8 text-center lg:text-left">
          
          <motion.div variants={itemVars} whileHover={{ scale: 1.05, y: -2 }} className="inline-flex cursor-pointer items-center gap-2 px-5 py-2 rounded-full bg-white/80 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] border border-white mx-auto lg:mx-0 transition-shadow hover:shadow-[0_8px_25px_rgba(255,154,61,0.2),inset_0_1px_0_rgba(255,255,255,1)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF9A3D] opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF9A3D]"></span>
            </span>
            <span className="text-[10px] font-bold text-[#FF9A3D] tracking-widest uppercase">Global API Network</span>
          </motion.div>

          <motion.h1 variants={itemVars} className="text-[3.5rem] font-extrabold leading-[1.02] tracking-[-0.04em] text-[#0A0A0A] sm:text-6xl lg:text-[5.5rem] drop-shadow-sm">
            Join Our
            <br />
            <span className="relative inline-block italic font-serif font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#0A7294] via-[#22B3AD] to-[#0A7294] bg-[length:200%_auto] animate-gradient tracking-normal pr-4 pb-2">
              Community.
            </span>
          </motion.h1>

          <motion.p variants={itemVars} className="mx-auto max-w-md text-lg font-medium leading-relaxed text-[#52525B] lg:mx-0">
            A space for developers to collaborate, explore, and shape the future of APIs. Connect your systems, connect with peers.
          </motion.p>

          <motion.div variants={itemVars} className="flex flex-col items-center gap-5 pt-4 sm:flex-row sm:justify-center lg:justify-start">
            <motion.button whileHover={{ scale: 1.02, boxShadow: '0 20px 40px -10px rgba(10,10,10,0.3)' }} whileTap={{ scale: 0.98 }} className="relative overflow-hidden flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#0A0A0A] px-8 py-4 text-[15px] font-medium text-white shadow-[0_8px_20px_rgba(10,10,10,0.15)] transition-all duration-300 group">
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer" />
              <Terminal className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
              <span className="relative z-10">Learn More</span>
            </motion.button>
            <motion.button whileHover={{ scale: 1.02, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)' }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto rounded-full bg-white px-8 py-4 text-[15px] font-medium text-[#0A0A0A] shadow-[0_8px_20px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] border border-gray-100 transition-all duration-300 hover:text-[#0A7294]">
              Explore Events
            </motion.button>
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

        {/* RIGHT COLUMN: Ultra-Premium Orbits & Acrylic Nodes */}
        <div className="relative flex h-[360px] w-full items-center justify-center sm:h-[420px] lg:h-[550px] z-20">
          
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.div className="absolute h-40 w-40 rounded-full border-[#0A7294]/30" animate={dropWaveAnim(0)} />
            <motion.div className="absolute h-40 w-40 rounded-full border-[#22B3AD]/20" animate={dropWaveAnim(1.1)} />
            <motion.div className="absolute h-40 w-40 rounded-full border-[#0A7294]/10" animate={dropWaveAnim(2.2)} />
          </div>

          <motion.div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-60" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ duration: 1.5 }}>
            <motion.div className="absolute h-[250px] w-[250px] rounded-full border-[1.5px] border-slate-300/80 border-dashed" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}>
              <div className="absolute top-0 left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0A7294] shadow-[0_0_15px_#0A7294]"></div>
            </motion.div>
            <motion.div className="absolute h-[380px] w-[380px] rounded-full border-[1px] border-slate-200" animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}>
               <div className="absolute top-1/2 right-0 h-3 w-3 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#22B3AD] shadow-[0_0_15px_#22B3AD]"></div>
            </motion.div>
            <motion.div className="absolute h-[520px] w-[520px] hidden sm:block rounded-full border-[1px] border-slate-200/60 border-dashed" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}>
               <div className="absolute bottom-1/4 right-[10%] h-2.5 w-2.5 translate-x-1/2 translate-y-1/2 rounded-full bg-[#FF9A3D] shadow-[0_0_15px_#FF9A3D]"></div>
            </motion.div>
          </motion.div>

          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1, type: 'spring', bounce: 0.5 }} whileHover={{ scale: 1.05 }} className="absolute z-30 flex h-32 w-32 cursor-pointer items-center justify-center rounded-full bg-white shadow-[0_20px_50px_rgba(10,114,148,0.15)] border-2 border-white relative transition-transform">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-[-10px] rounded-full border border-[#0A7294]/20 border-t-[#0A7294]/60" />
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute inset-[-18px] rounded-full border border-dashed border-[#22B3AD]/30" />
            <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 bg-gradient-to-tr from-[#0A7294] to-[#22B3AD] rounded-full filter blur-md" />
            <img src="/logo.png" alt="API Logo" className="h-16 w-16 object-contain relative z-10" />
          </motion.div>

          <div className="absolute inset-0 z-40">
            <motion.div animate={{ ...floatAnim(0), rotate: [0, 4, -4, 0] }} whileHover={{ scale: 1.15, zIndex: 50 }} className={`absolute cursor-pointer left-[12%] top-[10%] flex items-center justify-center p-2 rounded-2xl ${acrylicGlass} transition-transform`}>
              <div className="bg-[#e0f2fe]/80 p-2.5 rounded-xl"><Smartphone className="h-5 w-5 text-[#0A7294]" /></div>
            </motion.div>
            <motion.div animate={{ ...floatAnim(1), rotate: [0, -5, 3, 0] }} whileHover={{ scale: 1.15, zIndex: 50 }} className={`absolute cursor-pointer right-[8%] top-[16%] flex items-center justify-center p-2 rounded-2xl ${acrylicGlass} transition-transform`}>
              <div className="bg-[#ccfbf1]/80 p-2.5 rounded-xl"><Database className="h-5 w-5 text-[#22B3AD]" /></div>
            </motion.div>
            <motion.div animate={{ ...floatAnim(0.5), rotate: [0, 4, -4, 0] }} whileHover={{ scale: 1.15, zIndex: 50 }} className={`absolute cursor-pointer bottom-[22%] left-[4%] flex items-center justify-center p-2 rounded-2xl ${acrylicGlass} transition-transform`}>
               <div className="bg-[#f3e8ff]/80 p-2.5 rounded-xl"><Cloud className="h-5 w-5 text-[#a855f7]" /></div>
            </motion.div>
            <motion.div animate={{ ...floatAnim(1.5), rotate: [0, -4, 4, 0] }} whileHover={{ scale: 1.15, zIndex: 50 }} className={`absolute cursor-pointer bottom-[12%] right-[12%] flex items-center justify-center p-2 rounded-2xl ${acrylicGlass} transition-transform`}>
               <div className="bg-[#ffedd5]/80 p-2.5 rounded-xl"><Server className="h-5 w-5 text-[#f97316]" /></div>
            </motion.div>
            <motion.div animate={{ ...floatAnim(0.8), rotate: [0, 6, -6, 0] }} whileHover={{ scale: 1.15, zIndex: 50 }} className={`absolute cursor-pointer right-[2%] top-[45%] flex items-center justify-center p-1.5 rounded-full ${acrylicGlass} transition-transform`}>
               <div className="bg-[#d1fae5]/80 p-2 rounded-full"><Shield className="h-4 w-4 text-[#10b981]" /></div>
            </motion.div>
            <motion.div animate={{ ...floatAnim(1.2), rotate: [0, -5, 5, 0] }} whileHover={{ scale: 1.15, zIndex: 50 }} className={`absolute cursor-pointer bottom-[45%] left-[0%] flex items-center justify-center p-1.5 rounded-full ${acrylicGlass} transition-transform`}>
               <div className="bg-[#f1f5f9]/80 p-2 rounded-full"><Globe className="h-4 w-4 text-[#475569]" /></div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;