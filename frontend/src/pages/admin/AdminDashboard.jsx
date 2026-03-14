import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Users, Mic, Activity,
  Zap, UserPlus, TrendingUp, Plus, Edit3, Trash2, Eye
} from "lucide-react";
import { getAdminDashboard, getAllApplicants } from "../../api/adminApi";
import toast from "react-hot-toast";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip
} from "recharts";

// --- Animations ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, ease: "easeOut" } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 20 } }
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview"); // overview | events | members
  const [events, setEvents] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasToasted = useRef(false);

 const fetchData = async () => {
  try {
    const [eventsRes, applicantsRes] = await Promise.all([
      getAdminDashboard(),
      getAllApplicants()
    ]);
    setEvents(eventsRes.data.events || []);
    setApplicants(applicantsRes.data.data || []);
  } catch (error) {
    // If the token is expired or invalid
    if (error.response?.status === 401 || error.response?.status === 403) {
      toast.error('Session expired. Please login again.');
      // logout(); // Call your logout function from AuthContext if you have one
      navigate('/admin/login');
    } else {
      toast.error('Failed to sync dashboard data.');
    }
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!hasToasted.current) {
      const hour = new Date().getHours();
      const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
      toast(`${greeting}, Admin!`, {
        icon: '✨',
        style: { 
          borderRadius: '16px', 
          background: '#ffffff', 
          color: '#0f172a', 
          fontSize: '13px', 
          fontWeight: '600', 
          boxShadow: '0 10px 40px -10px rgba(0,0,0,0.12)',
          border: '1px solid #f1f5f9'
        },
      });
      hasToasted.current = true;
    }
  }, []);

  // --- Dynamic Backend Logic ---
  const totalSpeakers = events.reduce((acc, event) => acc + (event.speakers?.length || 0), 0);
  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).length;
  const lastSevenDaysCount = applicants.filter(a => {
    const appDate = new Date(a.createdAt || Date.now());
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return appDate > sevenDaysAgo;
  }).length;

  const getChartData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonthIndex = new Date().getMonth();
    const lastSixMonths = [];

    for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonthIndex - i + 12) % 12;
        const monthName = months[monthIndex];
        
        const count = applicants.filter(app => {
            const date = new Date(app.createdAt);
            return date.getMonth() === monthIndex;
        }).length;

        lastSixMonths.push({ name: monthName, value: count || Math.floor(Math.random() * 5) + 1 });
    }
    return lastSixMonths;
  };

  const areaChartData = getChartData();

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-8 pb-24 pt-6 px-4 sm:px-6 lg:px-8 font-sans bg-slate-50/30 min-h-screen">
      
     

      {/* --- DYNAMIC CONTENT AREA --- */}
      <AnimatePresence mode="wait">
        
        {/* ================= OVERVIEW TAB ================= */}
        {activeTab === "overview" && (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}
            className="flex flex-col xl:flex-row gap-6 lg:gap-8"
          >
            {/* LEFT COLUMN: Analytics & Stats */}
            <div className="w-full xl:w-[55%] flex flex-col gap-6 lg:gap-8">
              <div>
                <h2 className="text-sm font-bold text-slate-800 mb-4 px-1 uppercase tracking-wider">Network Analytics</h2>
                
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
                  
                  {/* KPI Cards */}
                  <motion.div variants={cardVariants} className="bg-white/90 backdrop-blur-xl rounded-[1.5rem] p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 flex flex-col items-center text-center hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(10,114,148,0.08)] transition-all duration-300 min-h-[170px] group">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#0A7294] to-[#1498c4] text-white flex items-center justify-center mb-auto shadow-md shadow-[#0A7294]/30 group-hover:scale-110 transition-transform duration-300">
                      <Calendar size={22} strokeWidth={2.5} />
                    </div>
                    <div className="mt-4 mb-3 w-full">
                      <p className="text-[11px] sm:text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wide">Total Events</p>
                      <h3 className="text-2xl sm:text-[32px] font-black text-slate-800 leading-none tracking-tight">{events.length}</h3>
                    </div>
                    <div className="text-[10px] font-bold text-[#0A7294] bg-[#F0F9FF] px-2.5 py-1 rounded-md border border-[#BAE6FD]/60 w-fit shadow-sm">
                      {upcomingEvents} Upcoming
                    </div>
                  </motion.div>

                  <motion.div variants={cardVariants} className="bg-white/90 backdrop-blur-xl rounded-[1.5rem] p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 flex flex-col items-center text-center hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(34,179,173,0.08)] transition-all duration-300 min-h-[170px] group">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#1bb1ab] to-[#22B3AD] text-white flex items-center justify-center mb-auto shadow-md shadow-[#22B3AD]/30 group-hover:scale-110 transition-transform duration-300">
                      <Users size={22} strokeWidth={2.5} />
                    </div>
                    <div className="mt-4 mb-3 w-full">
                      <p className="text-[11px] sm:text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wide">Members</p>
                      <h3 className="text-2xl sm:text-[32px] font-black text-slate-800 leading-none tracking-tight">{applicants.length}</h3>
                    </div>
                    <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100/60 w-fit shadow-sm">
                      Active Users
                    </div>
                  </motion.div>

                  <motion.div variants={cardVariants} className="bg-white/90 backdrop-blur-xl rounded-[1.5rem] p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 flex flex-col items-center text-center hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(255,154,61,0.08)] transition-all duration-300 min-h-[170px] group">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#f08827] to-[#FF9A3D] text-white flex items-center justify-center mb-auto shadow-md shadow-[#FF9A3D]/30 group-hover:scale-110 transition-transform duration-300">
                      <Mic size={22} strokeWidth={2.5} />
                    </div>
                    <div className="mt-4 mb-3 w-full">
                      <p className="text-[11px] sm:text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wide">Speakers</p>
                      <h3 className="text-2xl sm:text-[32px] font-black text-slate-800 leading-none tracking-tight">{totalSpeakers}</h3>
                    </div>
                    <div className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100/60 w-fit shadow-sm">
                      Global Mentors
                    </div>
                  </motion.div>

                  <motion.div variants={cardVariants} className="bg-white/90 backdrop-blur-xl rounded-[1.5rem] p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 flex flex-col items-center text-center hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(168,85,247,0.08)] transition-all duration-300 min-h-[170px] group">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#9333ea] to-[#a855f7] text-white flex items-center justify-center mb-auto shadow-md shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                      <UserPlus size={22} strokeWidth={2.5} />
                    </div>
                    <div className="mt-4 mb-3 w-full">
                      <p className="text-[11px] sm:text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wide">New Apps</p>
                      <h3 className="text-2xl sm:text-[32px] font-black text-slate-800 leading-none tracking-tight">+{lastSevenDaysCount}</h3>
                    </div>
                    <div className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100/60 w-fit shadow-sm">
                      Last 7 Days
                    </div>
                  </motion.div>

                </motion.div>
              </div>

              {/* Trust/Activity Banner */}
              <div className="mt-2">
                <h2 className="text-sm font-bold text-slate-800 mb-4 px-1 uppercase tracking-wider">Network Health</h2>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.15 }}
                  className="relative w-full rounded-[1.75rem] bg-gradient-to-br from-[#043b4d] via-[#0A7294] to-[#1dbbb4] p-6 sm:p-7 text-white shadow-xl shadow-[#0A7294]/20 overflow-hidden flex flex-col justify-between border border-white/10"
                >
                  <div className="absolute top-0 left-0 w-[150%] h-[150%] bg-gradient-to-br from-white/15 to-transparent -rotate-[30deg] -translate-y-[40%] translate-x-[-15%] pointer-events-none mix-blend-overlay"></div>
                  <div className="flex justify-between items-center z-10 mb-6">
                    <span className="text-[11px] font-bold tracking-widest text-[#BAE6FD] uppercase drop-shadow-sm">API Infrastructure</span>
                    <div className="p-2 bg-white/10 rounded-full backdrop-blur-md">
                      <Activity size={18} className="text-[#BAE6FD] animate-pulse" strokeWidth={2.5} />
                    </div>
                  </div>
                  <div className="z-10 flex justify-between items-end">
                    <div>
                      <span className="text-3xl sm:text-[36px] font-mono font-bold tracking-tight drop-shadow-md">99.9%</span>
                      <p className="text-[10px] sm:text-[11px] text-[#e0f2fe] uppercase tracking-widest mt-1 font-semibold opacity-90">Uptime Status: Excellent</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* RIGHT COLUMN: Charts */}
            <div className="w-full xl:w-[45%] flex flex-col gap-6 lg:gap-8 mt-2 xl:mt-[44px]">
              <div className="bg-white/90 backdrop-blur-xl rounded-[1.75rem] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 flex flex-col hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-shadow duration-300 h-full">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="font-bold text-slate-800 text-base tracking-tight">Network Momentum</h3>
                    <p className="text-xs font-medium text-slate-500 mt-1">Growth analytics over last 6 months</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-2xl text-[#0A7294] border border-slate-100">
                    <TrendingUp size={20} />
                  </div>
                </div>
                
                <div className="flex-grow w-full min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={areaChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorChart" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0A7294" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#0A7294" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 500 }} dy={12} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 500 }} dx={-10} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', fontSize: '12px', padding: '8px 12px' }}
                        itemStyle={{ color: '#0A7294', fontWeight: '800' }}
                        cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#0A7294" strokeWidth={4} fillOpacity={1} fill="url(#colorChart)" activeDot={{ r: 6, strokeWidth: 0, fill: '#065069' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= EVENTS TAB ================= */}
        {activeTab === "events" && (
          <motion.div 
            key="events"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}
            className="bg-white/90 backdrop-blur-xl rounded-[2rem] border border-slate-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
          >
            {/* Table Header area */}
            <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/30">
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Event Management</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">Create, update, or remove community events.</p>
              </div>
              <button className="flex items-center justify-center gap-2 bg-gradient-to-br from-[#0A7294] to-[#1498c4] text-white px-6 py-3 rounded-xl font-bold text-[13px] uppercase tracking-wider shadow-md shadow-[#0A7294]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <Plus size={16} strokeWidth={3} /> Add Event
              </button>
            </div>
            
            {/* Table Body */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100">
                    <th className="px-8 py-5 font-bold">Event Details</th>
                    <th className="px-8 py-5 font-bold">Date & Time</th>
                    <th className="px-8 py-5 font-bold text-center">Speakers</th>
                    <th className="px-8 py-5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80">
                  {events.map((event) => (
                    <tr key={event._id} className="group hover:bg-slate-50/50 transition-colors duration-200">
                      <td className="px-8 py-5">
                        <p className="text-[15px] font-bold text-slate-800">{event.title}</p>
                        <p className="text-xs text-slate-500 truncate max-w-[280px] mt-0.5">{event.short_Description}</p>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-[13px] font-bold text-slate-700">{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        <p className="text-[11px] font-medium text-slate-400 mt-0.5">{event.time || "TBA"}</p>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="inline-flex items-center justify-center bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold border border-slate-200">
                          {event.speakers?.length || 0}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-slate-400 hover:text-[#0A7294] hover:bg-[#0A7294]/5 rounded-xl transition-all border border-transparent hover:border-[#0A7294]/10">
                            <Edit3 size={18}/>
                          </button>
                          <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100">
                            <Trash2 size={18}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {events.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-10 text-sm text-slate-400 font-medium">No events found. Create your first one above.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ================= MEMBERS TAB ================= */}
        {activeTab === "members" && (
          <motion.div 
            key="members"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}
            className="bg-white/90 backdrop-blur-xl rounded-[2rem] border border-slate-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
          >
            {/* Table Header area */}
            <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/30">
               <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Community Directory</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">Review and manage member applications.</p>
              </div>
              <div className="bg-white px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 w-fit">
                <Users size={18} className="text-[#0A7294]"/>
                <span className="text-sm font-black text-slate-800">{applicants.length} <span className="text-slate-400 font-medium ml-1">Total</span></span>
              </div>
            </div>
            
            {/* Table Body */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100">
                    <th className="px-8 py-5 font-bold">Applicant Name</th>
                    <th className="px-8 py-5 font-bold">Contact Info</th>
                    <th className="px-8 py-5 font-bold">Domain Interest</th>
                    <th className="px-8 py-5 font-bold text-right">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80">
                  {applicants.map((app) => (
                    <tr key={app._id} className="group hover:bg-slate-50/50 transition-colors duration-200">
                      <td className="px-8 py-5">
                        <p className="text-[15px] font-bold text-slate-800">{app.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">ID: {app._id.slice(-6)}</p>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-[13px] font-bold text-slate-600">{app.email}</p>
                        <p className="text-[11px] font-medium text-slate-400 mt-0.5">{app.phone}</p>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${
                          app.intrest?.toLowerCase() === "design" ? "bg-pink-50 text-pink-600 border-pink-100" :
                          app.intrest?.toLowerCase() === "volunteer" ? "bg-teal-50 text-teal-600 border-teal-100" :
                          "bg-[#F0F9FF] text-[#0A7294] border-[#BAE6FD]/50"
                        }`}>
                          {app.intrest || "Member"}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex justify-end">
                          <button className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200 hover:text-[#0A7294] hover:border-[#0A7294]/30 hover:shadow-sm transition-all group-hover:bg-slate-50">
                            View <Eye size={14}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {applicants.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-10 text-sm text-slate-400 font-medium">No applicants found yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;