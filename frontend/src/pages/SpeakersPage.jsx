import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Linkedin, X, ArrowUpRight } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// --- SPEAKERS DATA ---
const speakersData = [
  {
    id: 1,
    name: "Akanksha Kapoor",
    role: "Customer Success Lead",
    imgUrl: "/Akanksha Kapoor.jpg",
    linkedin: "https://www.linkedin.com/in/akanksha-kapoor-545695119/",
    about: "Akanksha Kapoor is a customer success leader with an MBA and certifications from Google Cloud and AWS. At DigitalOcean, she leads a team of Customer Success Managers across APAC and EMEA, driving revenue retention and growth while helping businesses maximize cloud adoption. Skilled in strategic planning, program execution, and cross-functional collaboration, Akanksha has led impactful initiatives such as dashboard creation, customer stories, and quarterly business reviews. Passionate about customer-centric innovation, she also mentors new CSMs and has been recognized for her leadership and consultative approach."
  },
  {
    id: 2,
    name: "Arun Nair",
    role: "Senior Solutions Architect",
    imgUrl: "/Arun Nair.jpg",
    linkedin: "https://www.linkedin.com/in/arun-nair-6454585a/",
    about: "Arun Nair is an experienced Manager of Technical & Product Support with 13+ years in the industry, including 4+ years in leadership roles. He has led diverse teams of Leads, DBAs, and Technical Support Consultants, driving customer satisfaction, employee engagement, and operational excellence. With strong expertise in troubleshooting, process innovation, and cross-functional collaboration, Arun is passionate about empowering teams and achieving organizational goals."
  },
  {
    id: 3,
    name: "Asit Sonawane",
    role: "DevOps Engineer",
    imgUrl: "/Asit Sonawane.jpg",
    linkedin: "https://www.linkedin.com/in/asit-sonawane/",
    about: "Asit Sonawane is a Lead DevOps Engineer at AssetCues, where he specializes in building scalable cloud-native solutions with a focus on Azure. An entrepreneur at heart and a passionate community builder, he actively contributes to the open-source ecosystem by organizing FOSS United Pune and leading the Ubuntu Maharashtra LoCo community. With expertise spanning DevOps practices, automation, and cloud infrastructure, Asit bridges technology and collaboration to drive impactful innovation. Beyond engineering, he is deeply committed to nurturing developer communities and fostering knowledge-sharing initiatives."
  },
  {
    id: 4,
    name: "Ganesh Divekar",
    role: "Android Developer",
    imgUrl: "/Ganesh Divekar.jpg",
    linkedin: "https://www.linkedin.com/in/ganesh-divekar-96a72bb7/",
    about: "Ganesh Divekar is an engineering leader at Bajaj Markets, driving digital transformation in the finance industry by building resilient and scalable systems. With expertise across backend (Java, Kotlin, Go, Python), frontend (React, Next.js, Angular), and mobile development (Android, iOS, Flutter, KMP), he delivers high-performance, user-centric applications. Skilled in cloud technologies (AWS, GCP), databases (SQL & NoSQL), microservices, and DevOps (CI/CD, Docker, Kubernetes), Ganesh ensures agility and reliability in every solution. Passionate about innovation, he also explores AI, Generative AI, and Large Language Models to shape the future of fintech."
  },
  {
    id: 5,
    name: "Nayan Chandak",
    role: "Data Scientist",
    imgUrl: "/Nayan Chandak.jpg",
    linkedin: "https://www.linkedin.com/in/nayan-chandak/",
    about: "Nayan Chandak is a Data Scientist at Wolters Kluwer, specializing in data analytics, automation, and revenue forecasting to drive impactful business decisions. He has contributed to key initiatives such as the Annual Price Increase strategy, customer attrition analysis, and the development of a Revenue Bridge model, delivering measurable efficiency gains and revenue insights. Beyond his role, Nayan serves as an Advisory Committee Member at the Artificial Intelligence Students Association. He holds a B.Tech in AI & Data Science with an Honours in Data Analytics in Economics and Finance. Passionate about applying data science to solve real-world challenges, Nayan continues to explore innovative ways to fuel business growth."
  },
  {
    id: 6,
    name: "Nikhil Pathak",
    role: "Senior Engineer",
    imgUrl: "/Nikhil Pathak.jpg",
    linkedin: "https://www.linkedin.com/in/nikhil-pathak/",
    about: "Nikhil P. is a Senior Engineer at DigitalOcean, with expertise in building and scaling modern cloud-native applications. With a strong foundation in software engineering from the University Institute of Technology, RGPV, he has contributed to developing resilient infrastructure and customer-focused solutions in the cloud ecosystem. At DigitalOcean, Nikhil works on designing and optimizing scalable systems that power businesses worldwide, ensuring high performance, security, and reliability. Passionate about problem-solving, he thrives at the intersection of engineering and innovation, constantly exploring ways to improve developer experiences and cloud efficiencies."
  },
  {
    id: 7,
    name: "Pawan Shirke",
    role: "Network Engineer",
    imgUrl: "/Pawan Shirke.jpg",
    linkedin: "https://www.linkedin.com/in/pawan-shirke/",
    about: "Pawan Shirke is a Network Engineer with 4+ years of proven experience in network delivery services, specializing in design, implementation, configuration, analysis, and troubleshooting across multiple Networking OEM platforms. He has strong expertise in Data Center Networking and Network Automation, with hands-on experience in implementation, migration, and integration projects. Skilled in handling full project life cycle phases, Pawan has worked extensively on Core Backbone, Datacenter, and Enterprise wired & wireless networks. He brings in-depth technical knowledge of Juniper, Cisco, Extreme, HPE, Arista, and Open Linux Networking."
  },
  {
    id: 8,
    name: "Rohan Khamkar",
    role: "Senior Solutions Architect",
    imgUrl: "/Rohan Khamkar.jpg",
    linkedin: "https://www.linkedin.com/in/rohankhamkar/",
    about: "Rohan Khamkar is an IT professional with nearly a decade of experience helping enterprises of all sizes, from SMBs to Fortune 100s, solve complex technical challenges. His expertise spans storage and backup solutions, virtualization, SSO integrations, cloud services, and IT infrastructure management. With strong skills in disaster recovery, migrations, and debugging, Rohan is passionate about leveraging technology to deliver secure, scalable, and efficient solutions."
  },
  {
    id: 9,
    name: "Shweta Saraswat",
    role: "Team Lead - Cloud Engineer",
    imgUrl: "/Shweta Saraswat.jpg",
    linkedin: "https://www.linkedin.com/in/shwe/",
    about: "Shweta Saraswat is a seasoned Cloud Engineer and Database Administrator with over 12 years of experience in the IT industry. She is passionate about leveraging innovative technologies to enhance performance, scalability, and customer experience. Shweta has successfully led high-performing teams at DigitalOcean and Altera Digital Health, driving the implementation of cloud solutions and Electronic Health Records (EHR) across critical projects. Her expertise includes optimizing database performance, streamlining processes, training and mentoring junior team members, and improving operational metrics."
  }
];

const SpeakersPage = () => {
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);

  useEffect(() => {
    // Initialize AOS for smooth, repeating scroll animations
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: false, // Ensures animations trigger every time you scroll up and down
      mirror: true, // Elements animate out while scrolling past them
      offset: 50,
    });
    window.scrollTo(0, 0);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedSpeaker) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedSpeaker]);

  return (
    <div className="relative w-full min-h-screen bg-[#FAFAFA] font-sans overflow-x-hidden selection:bg-[#22B3AD]/30 selection:text-[#0A7294]">
      
      {/* --- AMBIENT BACKGROUND GLOWS --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] -right-[5%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-[#22B3AD]/[0.06] to-transparent blur-[120px] mix-blend-multiply" />
        <div className="absolute top-[30%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-[#0A7294]/[0.05] to-transparent blur-[150px] mix-blend-multiply" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-24 pb-24 lg:pt-32">
        
        {/* --- PAGE HEADER (Made words smaller & added AOS) --- */}
        <div className="text-center max-w-2xl mx-auto mb-20 lg:mb-24">
          <div 
            data-aos="fade-down"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#bae6fd]/60 shadow-[0_4px_20px_rgba(10,114,148,0.06)] mb-6 transition-transform hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0A7294] animate-pulse" />
            <span className="text-[10px] font-black text-[#0A7294] tracking-[0.2em] uppercase mt-[1px]">Industry Experts</span>
          </div>

          <h1 
            data-aos="fade-up" data-aos-delay="100"
            className="text-3xl md:text-4xl lg:text-[3.25rem] font-black text-slate-900 tracking-tight leading-[1.15] mb-5"
          >
            Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A7294] via-[#1694a1] to-[#22B3AD] animate-gradient-x">Visionaries.</span>
          </h1>

          <p 
            data-aos="fade-up" data-aos-delay="200"
            className="text-[0.95rem] md:text-base text-slate-500 font-medium leading-relaxed"
          >
            Learn from the brightest minds in the ecosystem. Our speakers bring years of hands-on experience in cloud, architecture, and developer relations.
          </p>
        </div>

        {/* --- SMALL CIRCULAR SPEAKERS GRID WITH AOS --- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 sm:gap-x-6 gap-y-12 sm:gap-y-16 max-w-6xl mx-auto">
          {speakersData.map((speaker, index) => (
            <div 
              key={speaker.id}
              data-aos="fade-up"
              data-aos-delay={(index % 5) * 100} // Creates a staggered effect automatically row by row
              onClick={() => setSelectedSpeaker(speaker)}
              className="group flex flex-col items-center text-center cursor-pointer transform-gpu"
            >
              {/* Outer Glow & Image Container */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 mb-5 lg:mb-6">
                
                {/* Vibrant colorful glow that appears behind the circle on hover */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#0A7294] to-[#22B3AD] opacity-0 group-hover:opacity-60 blur-xl transition-all duration-500 scale-90 group-hover:scale-110" />
                
                {/* White padded border ring */}
                <div className="absolute inset-0 rounded-full bg-white shadow-[0_8px_20px_rgba(0,0,0,0.04)] group-hover:shadow-[0_20px_40px_rgba(10,114,148,0.2)] group-hover:-translate-y-2 transition-all duration-500 p-1.5 sm:p-2 z-10">
                  
                  {/* Actual Image Mask */}
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-100">
                    <img 
                      src={speaker.imgUrl} 
                      alt={speaker.name} 
                      loading="lazy" 
                      decoding="async" 
                      style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    
                    {/* Dark Glassmorphic Overlay on Hover */}
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-all duration-300 flex items-center justify-center">
                      <ArrowUpRight className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    </div>
                  </div>

                </div>
              </div>

              {/* Text Info */}
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight mb-1 group-hover:text-[#0A7294] transition-colors duration-300">
                {speaker.name}
              </h3>
              <p className="text-[9px] sm:text-[10px] font-extrabold text-[#22B3AD] uppercase tracking-widest line-clamp-2 px-2">
                {speaker.role}
              </p>

            </div>
          ))}
        </div>

      </main>

      {/* --- POPUP MODAL (Kept Framer Motion for smooth mounting/unmounting) --- */}
      <AnimatePresence>
        {selectedSpeaker && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 px-4">
            
            {/* Modal Backdrop / Overlay (Smoother blur) */}
            <motion.div 
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.4 }}
              onClick={() => setSelectedSpeaker(null)}
              className="absolute inset-0 bg-slate-900/40 cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row max-h-[90vh] border border-white/60"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedSpeaker(null)}
                className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-sm border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Side: Large Image */}
              <div className="w-full md:w-2/5 h-[250px] sm:h-[300px] md:h-auto relative bg-slate-100 shrink-0">
                <img 
                  src={selectedSpeaker.imgUrl} 
                  alt={selectedSpeaker.name} 
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent md:hidden" />
              </div>

              {/* Right Side: Content */}
              <div className="w-full md:w-3/5 p-6 sm:p-8 lg:p-10 flex flex-col overflow-y-auto">
                
                {/* --- LOGO + ORG NAME HEADER --- */}
                <div className="flex items-center gap-3 mb-6 sm:mb-8 pb-5 sm:pb-6 border-b border-slate-100">
                  <img src="/logo.png" alt="API Community Logo" className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-sm" />
                  <div className="flex flex-col">
                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-[#0A7294] leading-none">The API</span>
                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-[#22B3AD] leading-none mt-1">Community</span>
                  </div>
                </div>

                {/* Speaker Info */}
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-black text-slate-900 tracking-tight leading-none mb-2 sm:mb-3">
                    {selectedSpeaker.name}
                  </h2>
                  <p className="text-[13px] sm:text-[14px] font-extrabold text-[#A1A1AA] uppercase tracking-widest">
                    {selectedSpeaker.role}
                  </p>
                </div>

                {/* Bio Section */}
                <div className="mb-8 sm:mb-10">
                  <h3 className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-widest mb-3 sm:mb-4">
                    <Sparkles className="w-4 h-4 text-[#FF9A3D]" />
                    About
                  </h3>
                  <p className="text-[14px] sm:text-[15px] text-slate-600 font-medium leading-relaxed">
                    {selectedSpeaker.about}
                  </p>
                </div>

                {/* LinkedIn Button */}
                <div className="mt-auto pt-2 sm:pt-4">
                  <a 
                    href={selectedSpeaker.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group inline-flex items-center justify-center gap-2.5 w-full sm:w-auto bg-[#0A0A0A] text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-[14px] sm:text-[15px] shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_30px_rgba(10,114,148,0.3)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Hover Gradient inside button */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#0A7294] to-[#22B3AD] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 fill-white" />
                    <span className="relative z-10">Connect on LinkedIn</span>
                    <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </a>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default SpeakersPage;