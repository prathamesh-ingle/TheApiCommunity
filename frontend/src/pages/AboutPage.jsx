import { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate as framerAnimate } from 'framer-motion';
import { ArrowRight, Sparkles, BookOpen, Users, Lightbulb, CheckCircle2 } from 'lucide-react';

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

// --- PAYNIDHI-STYLE STAT CARD ---
const StatCard = ({ title, value, subtext, subtextColor, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="flex flex-col justify-center rounded-3xl bg-white p-6 sm:p-7 border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.08)]"
  >
    <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.15em] mb-3">
      {title}
    </h4>
    <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter mb-2 flex items-baseline">
      <AnimatedCounter from={0} to={value} />
      <span className="text-[#0A7294]">+</span>
    </div>
    <div className={`text-[13px] font-medium flex items-center gap-1.5 ${subtextColor}`}>
      {subtext}
    </div>
  </motion.div>
);

// --- FEATURE LIST ITEM ---
const FeatureItem = ({ icon: Icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="flex items-start gap-4"
  >
    <div className="mt-1 bg-[#e0f2fe] p-2 rounded-full text-[#0A7294]">
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

const AboutPage = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#FAFAFA] font-sans overflow-hidden selection:bg-[#22B3AD]/30 selection:text-[#0A7294]">
      
      {/* --- AMBIENT BACKGROUND GLOWS (Clean & Subtle) --- */}
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
            
            {/* Pill Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#e0f2fe] to-[#ccfbf1] border border-[#bae6fd]/50 mb-8"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0A7294]" />
              <span className="text-[11px] font-black text-[#0A7294] tracking-[0.2em] uppercase mt-[1px]">
                About Us
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black text-slate-900 tracking-tight leading-[1.1] mb-6"
            >
              Building the API <br className="hidden lg:block" />
              Community in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A7294] to-[#22B3AD]">India</span>
            </motion.h1>

            {/* Paragraphs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="space-y-5 text-[1.05rem] sm:text-[17px] text-slate-600 font-medium leading-relaxed max-w-2xl lg:max-w-none mb-10"
            >
              <p>
                We at The API Community are passionate about API education, collaboration, and innovation. Our goal is to bring together developers, students, and professionals to learn, build, and grow in the API ecosystem.
              </p>
              <p>
                Through workshops, hackathons, and hands-on coding sessions, we provide a platform for enhancing API skills, networking with industry experts, and staying updated with the latest trends in API development.
              </p>
            </motion.div>

            {/* Feature List */}
            <div className="flex flex-col gap-6 max-w-xl mb-10 text-left">
              <FeatureItem 
                icon={BookOpen}
                title="Knowledge Sharing" 
                desc="Learn from industry experts and share your expertise with others." 
                delay={0.3} 
              />
              <FeatureItem 
                icon={Users}
                title="Collaborative Building" 
                desc="Learn from industry experts and share your expertise with others." 
                delay={0.4} 
              />
              <FeatureItem 
                icon={Lightbulb}
                title="Innovation Hub" 
                desc="Learn from industry experts and share your expertise with others." 
                delay={0.5} 
              />
            </div>

          </div>

          {/* RIGHT COLUMN: CHARACTER SVG ILLUSTRATION */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.9, delay: 0.2, type: "spring", bounce: 0.3 }}
            className="lg:col-span-6 xl:col-span-7 flex justify-center lg:justify-end relative mt-10 lg:mt-0"
          >
            {/* Faint circle behind the illustration to ground it */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] rounded-full bg-[#f1f5f9] border border-white shadow-[inset_0_0_50px_rgba(0,0,0,0.02)] -z-10" />
            
            <motion.img 
              src="/character.svg" 
              alt="API Builder Illustration" 
              animate={{ y: [-12, 12, -12] }} // Smooth floating animation
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="w-full max-w-[400px] sm:max-w-[550px] lg:max-w-[700px] object-contain drop-shadow-[0_25px_35px_rgba(10,114,148,0.15)]"
            />
          </motion.div>

        </div>

        {/* ==========================================
            HORIZONTAL STAT CARDS (PayNidhi Style)
            ========================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-20">
          <StatCard 
            title="Community" 
            value={2000} 
            subtext={<><CheckCircle2 size={14} className="text-[#22B3AD]" /> Active Members</>}
            subtextColor="text-slate-500"
            delay={0.2}
          />
          <StatCard 
            title="Events" 
            value={45} 
            subtext={<><span className="text-[#0A7294] font-bold">Global</span> meetups</>}
            subtextColor="text-slate-500"
            delay={0.3}
          />
          <StatCard 
            title="Workshops" 
            value={20} 
            subtext={<><span className="text-[#FF9A3D] font-bold">Hands-on</span> sessions</>}
            subtextColor="text-slate-500"
            delay={0.4}
          />
          <StatCard 
            title="Partners" 
            value={5} 
            subtext={<><CheckCircle2 size={14} className="text-[#10B981]" /> Official sponsors</>}
            subtextColor="text-slate-500"
            delay={0.5}
          />
        </div>

        {/* ==========================================
            BOTTOM STEPPER PROGRESS LINE
            ========================================== */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="relative w-full py-8 max-w-5xl mx-auto hidden md:block"
        >
          {/* The thin grey background line */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-slate-200 rounded-full" />
          
          {/* The flex container holding the steps */}
          <div className="relative flex justify-between">
            
            {/* Step 1 */}
            <div className="flex items-center gap-3 bg-[#FAFAFA] pr-6 relative z-10">
              <div className="h-3.5 w-3.5 rounded-full bg-[#10B981] shadow-[0_0_0_4px_rgba(16,185,129,0.2)]" />
              <span className="text-[13px] font-semibold text-slate-500">Join the community</span>
            </div>

            {/* Step 2 */}
            <div className="flex items-center gap-3 bg-[#FAFAFA] px-6 relative z-10">
              <div className="h-3.5 w-3.5 rounded-full bg-[#0A7294]" />
              <span className="text-[13px] font-semibold text-slate-500">Learn & Build</span>
            </div>

            {/* Step 3 */}
            <div className="flex items-center gap-3 bg-[#FAFAFA] pl-6 relative z-10">
              <div className="h-3.5 w-3.5 rounded-full bg-slate-300" />
              <span className="text-[13px] font-semibold text-slate-500">Share your expertise</span>
            </div>

          </div>
        </motion.div>

      </main>
    </div>
  );
};

export default AboutPage;