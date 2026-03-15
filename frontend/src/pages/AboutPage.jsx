import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate as framerAnimate } from 'framer-motion';
import { ArrowRight, Sparkles, BookOpen, Users, Lightbulb, CheckCircle2, Globe, Cpu, Shield } from 'lucide-react';

// --- ANIMATED COUNTER COMPONENT ---
const AnimatedCounter = ({ from, to }) => {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = framerAnimate(count, to, { 
      duration: 2.5, 
      ease: "easeOut", 
      delay: 0.3 
    });
    return controls.stop;
  }, [count, to]);

  return <motion.span>{rounded}</motion.span>;
};

// --- UPGRADED: PREMIUM STAT CARD WITH GLOWING HOVER BORDER ---
const StatCard = ({ title, value, subtext, subtextColor, delay, hoverGradient, glowColor }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    className="group relative p-[2px] rounded-[2rem] bg-slate-100 hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_20px_40px_-10px_rgba(10,114,148,0.15)] cursor-default"
  >
    {/* Flowing Animated Gradient Border */}
    <div className={`absolute inset-0 bg-gradient-to-r ${hoverGradient} bg-[length:200%_auto] animate-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]`} />
    
    {/* Inner White Card */}
    <div className="flex flex-col justify-center relative bg-white p-6 sm:p-7 rounded-[calc(2rem-2px)] h-full z-10 overflow-hidden transition-all duration-500">
      
      {/* Internal Hover Spotlight */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-bl ${glowColor} to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-all duration-700 group-hover:translate-x-2 group-hover:translate-y-2`} />

      <h4 className="relative z-10 text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.15em] mb-4 group-hover:text-slate-600 transition-colors duration-300">
        {title}
      </h4>
      <div className="relative z-10 text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter mb-4 flex items-baseline group-hover:scale-[1.03] origin-left transition-transform duration-500">
        <AnimatedCounter from={0} to={value} />
        <span className="text-[#0A7294] ml-1">+</span>
      </div>
      <div className={`relative z-10 text-[13px] font-semibold flex items-center gap-1.5 px-3 py-2 bg-slate-50/80 rounded-xl border border-slate-100 w-fit ${subtextColor} group-hover:bg-white group-hover:border-slate-200 transition-all duration-300`}>
        {subtext}
      </div>
    </div>
  </motion.div>
);

// --- UPGRADED: FEATURE LIST ITEM WITH HOVER PHYSICS ---
const FeatureItem = ({ icon: Icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ x: 8, backgroundColor: "#f8fafc" }}
    className="flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 border border-transparent hover:border-slate-100 hover:shadow-sm cursor-default"
  >
    <div className="mt-1 bg-gradient-to-br from-[#e0f2fe] to-[#bae6fd] p-2.5 rounded-full text-[#0A7294] shadow-inner transition-transform duration-300 hover:scale-110">
      <Icon size={18} strokeWidth={2.5} />
    </div>
    <div>
      <h4 className="text-lg font-bold text-slate-900">{title}</h4>
      <p className="text-[15px] text-slate-500 font-medium leading-relaxed mt-1">
        {desc}
      </p>
    </div>
  </motion.div>
);

// --- ANTI-LAG GPU ACCELERATED EVENT CARD ---
const EventCard = ({ imgUrl, title, tag }) => (
  <div 
    style={{ contain: 'paint layout', transform: 'translateZ(0)', WebkitBackfaceVisibility: 'hidden' }}
    className="group relative w-[280px] sm:w-[340px] shrink-0 flex flex-col rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_-10px_rgba(10,114,148,0.15)] hover:-translate-y-2 cursor-pointer mx-3"
  >
    {/* Image Section */}
    <div className="relative w-full h-[180px] overflow-hidden bg-slate-100">
      <img 
        src={imgUrl} 
        alt={title} 
        loading="lazy" 
        decoding="async" 
        style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent opacity-70 pointer-events-none" />
      
      <div className="absolute top-4 left-4 z-10">
        <span className="px-3 py-1.5 rounded-[0.4rem] bg-black/70 text-white text-[11px] font-semibold tracking-wide border border-white/20 transition-colors duration-300 group-hover:bg-[#0A7294]/90">
          {tag}
        </span>
      </div>
    </div>
    
    {/* Text Section */}
    <div className="p-5 flex-grow bg-white flex items-center">
      <h3 className="text-slate-800 font-semibold text-[16px] sm:text-[17px] leading-snug line-clamp-2 group-hover:text-[#0A7294] transition-colors">
        {title}
      </h3>
    </div>
  </div>
);

const AboutPage = () => {
  const [eventsData, setEventsData] = useState({ topRow: [], bottomRow: [] });

  useEffect(() => {
    window.scrollTo(0, 0);

    fetch('/events.json')
      .then((response) => response.json())
      .then((data) => {
        setEventsData(data);
      })
      .catch((error) => console.error("Error loading events data:", error));
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#FAFAFA] font-sans overflow-hidden selection:bg-[#22B3AD]/30 selection:text-[#0A7294]">
      
      {/* --- AMBIENT BACKGROUND GLOWS --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-bl from-[#22B3AD]/[0.06] to-transparent blur-[100px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-[#0A7294]/[0.05] to-transparent blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-[1400px] px-6 pt-32 pb-20 lg:pt-40">
        
        {/* ==========================================
            HERO CONTENT & ILLUSTRATION
            ========================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mb-24 lg:mb-32">
          
          {/* LEFT COLUMN: TEXT & FEATURES */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-center text-center lg:items-start lg:text-left">
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.5 }}
              className="inline-flex cursor-default items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#e0f2fe] to-[#ccfbf1] border border-[#bae6fd]/50 mb-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0A7294]" />
              <span className="text-[11px] font-black text-[#0A7294] tracking-[0.2em] uppercase mt-[1px]">
                About Us
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black text-slate-900 tracking-tight leading-[1.1] mb-6"
            >
              Building the API <br className="hidden lg:block" />
              Community in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A7294] to-[#22B3AD]">India</span>
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="space-y-5 text-[1.05rem] sm:text-[17px] text-slate-600 font-medium leading-relaxed max-w-2xl lg:max-w-none mb-8"
            >
              <p>
                We at The API Community are passionate about API education, collaboration, and innovation. Our goal is to bring together developers, students, and professionals to learn, build, and grow in the API ecosystem.
              </p>
              <p>
                Through workshops, hackathons, and hands-on coding sessions, we provide a platform for enhancing API skills, networking with industry experts, and staying updated with the latest trends in API development.
              </p>
            </motion.div>

            <div className="flex flex-col gap-3 max-w-xl text-left w-full">
              <FeatureItem icon={BookOpen} title="Knowledge Sharing" desc="Learn from industry experts and share your expertise with others." delay={0.3} />
              <FeatureItem icon={Users} title="Collaborative Building" desc="Build real-world projects alongside top developers." delay={0.4} />
              <FeatureItem icon={Lightbulb} title="Innovation Hub" desc="Stay ahead of the curve with cutting-edge API trends." delay={0.5} />
            </div>

          </div>

          {/* RIGHT COLUMN: CHARACTER SVG ILLUSTRATION */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.9, delay: 0.2, type: "spring", bounce: 0.3 }}
            className="lg:col-span-6 xl:col-span-7 flex justify-center lg:justify-end relative mt-10 lg:mt-0"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] rounded-full bg-[#f1f5f9] border border-white shadow-[inset_0_0_50px_rgba(0,0,0,0.02)] -z-10" />
            <motion.img 
              src="/character.svg" 
              alt="API Builder Illustration" 
              animate={{ y: [-12, 12, -12] }} 
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="w-full max-w-[400px] sm:max-w-[550px] lg:max-w-[700px] object-contain drop-shadow-[0_30px_40px_rgba(10,114,148,0.2)]"
            />
          </motion.div>

        </div>

        {/* ==========================================
            UPGRADED HORIZONTAL STAT CARDS
            ========================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-20">
          <StatCard 
            title="Community" value={2000} 
            subtext={<><Users size={14} className="text-[#0284C7]" /> Active Members</>} subtextColor="text-slate-500" delay={0.2} 
            hoverGradient="from-[#0284C7] via-[#22B3AD] to-[#0284C7]" glowColor="from-[#0284C7]"
          />
          <StatCard 
            title="Active Regions" value={120} 
            subtext={<><Globe size={14} className="text-[#A855F7]" /> Edge-optimized</>} subtextColor="text-slate-500" delay={0.3} 
            hoverGradient="from-[#A855F7] via-[#ec4899] to-[#A855F7]" glowColor="from-[#A855F7]"
          />
          <StatCard 
            title="System Uptime" value={99} 
            subtext={<><Shield size={14} className="text-[#10B981]" /> Self-healing tech</>} subtextColor="text-slate-500" delay={0.4} 
            hoverGradient="from-[#10B981] via-[#3b82f6] to-[#10B981]" glowColor="from-[#10B981]"
          />
          <StatCard 
            title="Builders Online" value={10} 
            subtext={<><Cpu size={14} className="text-[#F97316]" /> Pairing & scaling</>} subtextColor="text-slate-500" delay={0.5} 
            hoverGradient="from-[#F97316] via-[#facc15] to-[#F97316]" glowColor="from-[#F97316]"
          />
        </div>

        {/* ==========================================
            BOTTOM STEPPER PROGRESS LINE
            ========================================== */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative w-full py-8 max-w-5xl mx-auto hidden md:block mb-10"
        >
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-slate-200 rounded-full" />
          <div className="relative flex justify-between">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3 bg-[#FAFAFA] pr-6 relative z-10 cursor-default">
              <div className="h-3.5 w-3.5 rounded-full bg-[#10B981] shadow-[0_0_0_4px_rgba(16,185,129,0.2)]" />
              <span className="text-[13px] font-bold text-slate-600 transition-colors hover:text-[#10B981]">Join the community</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3 bg-[#FAFAFA] px-6 relative z-10 cursor-default">
              <div className="h-3.5 w-3.5 rounded-full bg-[#0A7294] shadow-[0_0_0_4px_rgba(10,114,148,0.2)]" />
              <span className="text-[13px] font-bold text-slate-600 transition-colors hover:text-[#0A7294]">Learn & Build</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3 bg-[#FAFAFA] pl-6 relative z-10 cursor-default">
              <div className="h-3.5 w-3.5 rounded-full bg-[#FF9A3D] shadow-[0_0_0_4px_rgba(255,154,61,0.2)]" />
              <span className="text-[13px] font-bold text-slate-600 transition-colors hover:text-[#FF9A3D]">Share your expertise</span>
            </motion.div>
          </div>
        </motion.div>

      </main>

      {/* ==========================================
          DYNAMIC 2-WAY INFINITE SCROLLING EVENT IMAGES
          ========================================== */}
      <section className="relative w-full py-24 bg-white border-t border-slate-100 overflow-hidden flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 px-6 relative z-30"
        >
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Memories from our <br className="sm:hidden" /> recent events.
          </h2>
          <p className="mt-4 text-lg text-slate-500 font-medium">Join us at our next meetup in your city.</p>
        </motion.div>

        {/* --- PERFORMANCE FOG EDGES --- */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 z-20 pointer-events-none bg-gradient-to-r from-white to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 z-20 pointer-events-none bg-gradient-to-l from-white to-transparent" />

        {/* Only render tracks if data has loaded */}
        {eventsData.topRow && eventsData.topRow.length > 0 && (
          <div className="flex flex-col gap-6 w-full mt-4">
            
            {/* Top Row - Scrolling Left */}
            <motion.div 
              className="flex w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ ease: "linear", duration: 35, repeat: Infinity }}
              style={{ willChange: "transform", transform: "translate3d(0, 0, 0)", WebkitBackfaceVisibility: "hidden" }}
            >
              <div className="flex pr-0">
                {eventsData.topRow.map((event) => <EventCard key={`t1-${event.id}`} {...event} />)}
              </div>
              <div className="flex pr-0">
                {eventsData.topRow.map((event) => <EventCard key={`t2-${event.id}`} {...event} />)}
              </div>
            </motion.div>

            {/* Bottom Row - Scrolling Right */}
            <motion.div 
              className="flex w-max"
              animate={{ x: ["-50%", "0%"] }}
              transition={{ ease: "linear", duration: 35, repeat: Infinity }}
              style={{ willChange: "transform", transform: "translate3d(0, 0, 0)", WebkitBackfaceVisibility: "hidden" }}
            >
              <div className="flex pr-0">
                {eventsData.bottomRow.map((event) => <EventCard key={`b1-${event.id}`} {...event} />)}
              </div>
              <div className="flex pr-0">
                {eventsData.bottomRow.map((event) => <EventCard key={`b2-${event.id}`} {...event} />)}
              </div>
            </motion.div>

          </div>
        )}
      </section>

    </div>
  );
};

export default AboutPage;