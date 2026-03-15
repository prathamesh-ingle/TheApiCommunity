import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Linkedin, ArrowUpRight, Users, Target, X, ChevronRight } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// --- DATA: ORGANIZERS ---
const organizersData = [
  {
    id: 1,
    name: "Shrawan Saproo",
    role: "Organizer",
    imgUrl: "/Shrawan Saproo.jpg",
    linkedin: "https://www.linkedin.com/in/shrawan513/",
    about: "I'm Shrawan, a Community Builder, DevRel Leader, Technical Content Creator, and Region Lead at AI Camp, passionate about empowering developers and building thriving ecosystems. Currently leading the API Community and serving as a DigitalOcean Wavemaker, I bring 2+ years of experience in developer relations, community growth, and event management."
  },
  {
    id: 2,
    name: "Aditya Bisht",
    role: "Organizer",
    imgUrl: "/Aditya Bisht.jpg",
    linkedin: "https://www.linkedin.com/in/aditya894/",
    about: "Hi, I'm Aditya Bisht, a curious and committed engineering student pursued B.E. in Robotics and Automation, with a passion for software development and community-driven tech innovation. With a strong foundation in C/C++, Python, JavaScript, and modern frameworks like React, Node.js, and Next.js, I thrive at the intersection of software and hardware. I enjoy exploring both front-end and back-end technologies, crafting solutions that are not only functional but also meaningful. Beyond development, I'm deeply invested in community building. I co-founded The API Community, organizing 10+ events to foster collaboration and API literacy among developers."
  }
];

// --- DATA: TEAM LEADS ---
const teamLeadsData = [
  {
    id: 3,
    name: "Aman Mogal",
    role: "Growth Lead",
    imgUrl: "/Aman Mogal.jpg",
    linkedin: "https://www.linkedin.com/in/aman-mogal-b7773b246/",
    about: "Aman Mogal is an AI & DevOps Engineer and Founder of localDev, passionate about automating intelligence in the cloud. As an open-source enthusiast and Community Representative at the API Community, he focuses on growth management, community relations, and driving impactful developer experiences. Currently pursuing his degree at MCOE (Class of 2026), Aman actively contributes to fostering collaboration and innovation in tech communities."
  },
  {
    id: 4,
    name: "Namrata Bhalerao",
    role: "Design Lead",
    imgUrl: "/Namrata Bhalerao.jpg",
    linkedin: "https://in.linkedin.com/in/namrata-bhalerao-66417a244",
    about: "I'm Namrata, an Electronics & Telecommunication student with a enthusiasm for visual story telling, UI frameworks and crafting intuitive digital experiences. At the API Community, I bring my skills as a designer. I focus on shaping our visual presence and ensuring consistent aesthetics across platforms. With a keen eye for design and creativity, I lead the creation of engaging social media visuals and community-driven designs that reflect our vibrant spirit. My goal is to merge technology with creativity."
  },
  {
    id: 5,
    name: "Arjun Khadse",
    role: "Operations Lead",
    imgUrl: "/Arjun Khadse.jpg",
    linkedin: "https://www.linkedin.com/in/arjunkh",
    about: "I'm a creative Full-Stack Developer and Designer with expertise in modern JavaScript frameworks and libraries. Passionate about crafting intuitive, scalable, and visually engaging digital experiences, I seamlessly blend design with functionality to bring ideas to life. Skilled in custom visual effects, animations, and performance optimization, I specialize in building user-focused applications that leave a lasting impact. Driven by curiosity and continuous learning, I thrive on exploring new technologies, solving complex challenges, and collaborating to transform ideas into reality."
  },
  {
    id: 6,
    name: "Ritika Pasari",
    role: "Operations Lead",
    imgUrl: "/Ritika Pasari.jpg",
    linkedin: "https://www.linkedin.com/in/ritika-pasari-225139225",
    about: "Building tech, growing communities, and creating impact. I'm Ritika Pasari — a Software Engineer and Community Builder passionate about blending technology with collaboration. With experience in AI, microservices, and AI full-stack development, I enjoy turning ideas into impactful solutions. Beyond code, I actively contribute to developer communities, fostering growth, knowledge-sharing, and meaningful connections. Driven by curiosity and creativity, I thrive on building both products and people."
  },
  {
    id: 7,
    name: "Eric Fernandes",
    role: "Support Lead",
    imgUrl: "/Eric Fernandes.jpg",
    linkedin: "https://www.linkedin.com/in/ericfernandes1681/",
    about: "Eric Fernandes is a Graduate Engineer Trainee at iTech Robotics & Automation, working on robotics programming and computer vision. Alongside this, he serves as Community Support Manager at the API Community, where he contributes to community growth, developer support, and technical advocacy. Passionate about AI, automation, and open-source, Eric is building a career at the intersection of technology."
  },
  {
    id: 8,
    name: "Asmita Khuspe",
    role: "Anchors Lead",
    imgUrl: "/Asmita Khuspe.jpg",
    linkedin: "https://www.linkedin.com/in/asmita-khuspe/",
    about: "I'm a passionate technologist with a strong foundation in C, C++, Java, and Python, and a growing expertise in cloud technologies like AWS, GCP, Azure, DevOps, and system administration. I enjoy solving complex problems, exploring new tools, and bringing efficiency to the projects I work on. Currently preparing to pursue an MS in Cloud Computing abroad, I'm eager to deepen my knowledge and contribute meaningfully to the evolving tech landscape. Beyond coding, I love mentoring, public speaking, and guiding aspiring professionals."
  },
  {
    id: 9,
    name: "Roheeni Naraynkar",
    role: "Anchors Lead",
    imgUrl: "/Roheeni Naraynkar.jpg",
    linkedin: "http://www.linkedin.com/in/roheeni-narayankar-a7bb49199",
    about: "I'm Roheeni, currently a Full-Time Technology Analyst at Citi Bank and proud Citi Bridge Grad'24. I have held diverse roles such as Mentor, PR, Developer, and Editor in clubs like Vinidra Satellite Club and Kshitij during my college years. My internship experience spans Reknot Solution, Citi Bank, and a research role at my college. Alongside my career, I'm active in both social and tech volunteering initiatives, serving as an anchor for the API Community and volunteering at Bhumi."
  },
  {
    id: 10,
    name: "Sakshi Sonawane",
    role: "Media Lead",
    imgUrl: "/Sakshi Sonawane.jpg",
    linkedin: "https://www.linkedin.com/in/sakshi-s-284233206/",
    about: "Hi there! I'm Sakshi, a passionate Data Science and Machine Learning enthusiast specialising in developing Python-based solutions to solve complex problems. With hands-on experience in building AI chatbots and creating robust ML pipelines, I am proficient in SQL and Power BI for data analysis and visualisation. I am actively seeking opportunities in Data Analytics and AI to apply my skills and contribute to innovative projects. Let's connect and drive data-driven success together!"
  },
  {
    id: 11,
    name: "Saloni Pawar",
    role: "Design Lead",
    imgUrl: "/Saloni Pawar.jpg",
    linkedin: "http://linkedin.com/in/saloni-pawar-949aa1178",
    about: "I'm Saloni Pawar an engineer who traded circuits for creativity. While my degree says engineering, my passion drives storytelling, design, and digital strategy. I bring ideas to life as a social media, content creator, and graphic designer, crafting digital experiences that make people stop, think, and connect. I thrive at the intersection of creativity and strategy shaping brand presence, curating stories that resonate, and designing visuals that speak with clarity and style."
  }
];

const TeamPage = () => {
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    document.body.style.overflow = 'unset';
    window.scrollTo(0, 0);
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: false,
      mirror: true,
      offset: 50,
    });
  }, []);

  useEffect(() => {
    if (selectedMember) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedMember]);

  return (
    <div className="relative w-full min-h-screen bg-[#F5F7FA] font-sans selection:bg-[#22B3AD]/30 selection:text-[#0A7294] pb-24">
      
      {/* --- EXTREMELY SOFT BACKGROUND GLOWS --- */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] rounded-full bg-[#22B3AD]/[0.03] blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#0A7294]/[0.03] blur-[120px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pt-28 lg:pt-36">
        
        {/* ==========================================
            PAGE HEADER
            ========================================== */}
        <div className="max-w-3xl mx-auto text-center mb-28 lg:mb-36">
          <div data-aos="fade-down" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] mb-6">
            <Users className="w-3.5 h-3.5 text-[#0A7294]" />
            <span className="text-[10px] font-black text-[#0A7294] tracking-[0.2em] uppercase mt-[1px]">The Core Team</span>
          </div>

          <h1 data-aos="fade-up" data-aos-delay="100" className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] tracking-tight mb-6 text-slate-900">
            Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A7294] to-[#22B3AD]">Minds.</span>
          </h1>

          <p data-aos="fade-up" data-aos-delay="200" className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
            Our mission is to equip community members with practical skills, enabling them to communicate insights and drive innovative solutions effectively.
          </p>
        </div>

        {/* ==========================================
            SECTION 1: ORGANIZERS 
            ========================================== */}
        <div className="mb-28 lg:mb-36">
          <div className="flex flex-wrap justify-center items-stretch gap-10 sm:gap-12 lg:gap-16 max-w-5xl mx-auto mt-16">
            {organizersData.map((org, index) => (
              <div 
                key={org.id}
                data-aos="fade-up"
                data-aos-delay={index * 150}
                className="group relative w-full max-w-[340px] bg-white rounded-3xl p-8 pt-0 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(10,114,148,0.08)] transition-all duration-500 flex flex-col items-center mt-12 cursor-pointer"
                onClick={() => setSelectedMember(org)}
              >
                {/* Overlapping Profile Image */}
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full -mt-16 mb-6 ring-[6px] ring-white bg-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.08)] group-hover:ring-teal-50 transition-all duration-500 z-10 overflow-hidden">
                  <img 
                    src={org.imgUrl} 
                    alt={org.name} 
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                
                <h2 className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-[#0A7294] transition-colors mb-2">
                  {org.name}
                </h2>
                
                <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-md bg-[#22B3AD]/10 text-[#0A7294] text-[11px] font-bold uppercase tracking-widest mb-5">
                  {org.role}
                </div>

                <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-6">
                  {org.about}
                </p>

                <div className="mt-auto pt-4 border-t border-slate-100 w-full flex items-center justify-center gap-4">
                  <span className="text-[#0A7294] text-xs font-bold uppercase tracking-wider group-hover:text-[#22B3AD] transition-colors">
                    Read Bio
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#0A7294] transition-colors duration-300">
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==========================================
            SECTION 2: TEAM LEADS HEADER
            ========================================== */}
        <div className="text-center max-w-2xl mx-auto mb-20" data-aos="fade-up">
          <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            The Innovators
          </h2>
          <p className="text-base text-slate-500 font-medium leading-relaxed">
            They inspire, motivate, and empower our teams to achieve extraordinary results.
          </p>
        </div>

        {/* ==========================================
            SECTION 3: TEAM LEADS GRID
            ========================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-x-6 sm:gap-y-16 max-w-7xl mx-auto mt-12">
          {teamLeadsData.map((lead, index) => (
            <div 
              key={lead.id} 
              data-aos="fade-up" 
              data-aos-delay={(index % 4) * 100}
              onClick={() => setSelectedMember(lead)}
              className="group bg-white rounded-3xl p-6 pt-0 text-center shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_15px_30px_rgb(10,114,148,0.08)] transition-all duration-300 cursor-pointer flex flex-col items-center mt-10"
            >
              {/* Overlapping Profile Image */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full -mt-12 mb-5 relative ring-[4px] ring-white bg-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.06)] group-hover:ring-teal-50 transition-all duration-300 overflow-hidden z-10">
                <img 
                  src={lead.imgUrl} 
                  alt={lead.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-[#0A7294] transition-colors line-clamp-1">
                {lead.name}
              </h3>
              <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-4">
                {lead.role}
              </p>
              
              <div className="mt-auto px-4 py-2 bg-slate-50 group-hover:bg-slate-100 rounded-full text-[11px] font-bold text-[#0A7294] transition-colors flex items-center justify-center gap-1.5 w-full">
                View Profile <ChevronRight className="w-3.5 h-3.5 opacity-50 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
              </div>
            </div>
          ))}
        </div>

      </main>

      {/* ==========================================
          POPUP MODAL (Modern & Soft)
          ========================================== */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            
            {/* Modal Backdrop */}
            <motion.div 
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedMember(null)}
              className="absolute inset-0 bg-slate-900/40 cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row max-h-[85vh] md:max-h-[75vh]"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Side: Image */}
              <div className="w-full md:w-2/5 h-[280px] sm:h-[320px] md:h-auto relative bg-slate-100 shrink-0">
                <img 
                  src={selectedMember.imgUrl} 
                  alt={selectedMember.name} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-90 md:hidden" />
              </div>

              {/* Right Side: Content */}
              <div className="w-full md:w-3/5 p-6 sm:p-8 lg:p-12 flex flex-col overflow-y-auto">
                
                <div className="mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#22B3AD]/10 text-[#0A7294] text-[10px] font-extrabold uppercase tracking-widest mb-3">
                    {selectedMember.role}
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">
                    {selectedMember.name}
                  </h2>
                </div>

                <div className="mb-8 prose prose-slate prose-sm sm:prose-base max-w-none">
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {selectedMember.about}
                  </p>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100">
                  <a 
                    href={selectedMember.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 w-full sm:w-fit bg-slate-900 hover:bg-[#0A7294] text-white px-8 py-3.5 rounded-xl font-bold text-[14px] transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md"
                  >
                    <Linkedin className="w-4 h-4" />
                    Connect on LinkedIn
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

export default TeamPage;