// frontend/src/pages/admin/ManageApplicants.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Users, Mail, Phone, Clock, 
  Filter, Copy, ExternalLink, Sparkles, Briefcase, Palette, HeartHandshake
} from "lucide-react";
import toast from "react-hot-toast";
import { getAllApplicants } from "../../api/adminApi";

// --- HELPER: ROLE STYLING ---
const getRoleConfig = (role) => {
  const r = role?.toLowerCase() || "";
  if (r.includes("design")) return { color: "text-pink-600", bg: "bg-pink-50", border: "border-pink-100", icon: <Palette size={12} /> };
  if (r.includes("management")) return { color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100", icon: <Briefcase size={12} /> };
  if (r.includes("social")) return { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", icon: <Sparkles size={12} /> };
  if (r.includes("volunteer")) return { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", icon: <HeartHandshake size={12} /> };
  return { color: "text-[#0A7294]", bg: "bg-[#F0F9FF]", border: "border-[#BAE6FD]/50", icon: <Users size={12} /> };
};

// --- HELPER: DYNAMIC AVATAR ---
const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : parts[0].substring(0, 2).toUpperCase();
};

// --- HELPER: TIME AGO ---
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return "Just now";
};

const ManageApplicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await getAllApplicants();
        const sorted = (res.data.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setApplicants(sorted);
      } catch (error) {
        toast.error("Failed to load applicants.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, []);

  const filteredApplicants = applicants.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "All" || app.intrest?.toLowerCase() === filterRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied!`, { icon: <Copy size={14} className="text-[#0A7294]" />, style: { borderRadius: '10px', fontSize: '12px', fontWeight: '600', padding: '8px 12px' } });
  };

  return (
    <div className="w-full min-h-screen bg-[#F5F7FA] font-sans pb-24 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 relative overflow-hidden">
      
      {/* Soft Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-[#22B3AD]/[0.04] to-transparent blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tr from-[#0A7294]/[0.04] to-transparent blur-[100px]" />
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10 space-y-6">
        
        {/* --- HEADER & COMPACT CONTROLS --- */}
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-white/80 backdrop-blur-xl p-4 sm:p-5 rounded-[2rem] border border-white/80 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.04)] flex flex-col lg:flex-row gap-5 items-start lg:items-center justify-between">
          
          <div className="flex items-center gap-4 pl-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0A7294] to-[#22B3AD] shadow-md flex items-center justify-center text-white shrink-0">
              <Users size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none mb-1">Applicant Directory</h1>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold text-[#0A7294] uppercase tracking-widest flex items-center gap-1">
                   Database
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[9px] font-bold">
                  {filteredApplicants.length} Entries
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 group-focus-within:text-[#0A7294] transition-colors" />
              <input 
                type="text" 
                placeholder="Search records..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-[12px] font-medium focus:bg-white focus:border-[#0A7294]/40 focus:ring-2 focus:ring-[#0A7294]/10 outline-none transition-all shadow-sm" 
              />
            </div>
            
            {/* Filter */}
            <div className="relative w-full sm:w-44 group">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 group-focus-within:text-[#0A7294] transition-colors" />
              <select 
                value={filterRole} 
                onChange={(e) => setFilterRole(e.target.value)} 
                className="w-full pl-9 pr-8 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-[12px] font-medium focus:bg-white focus:border-[#0A7294]/40 focus:ring-2 focus:ring-[#0A7294]/10 outline-none transition-all shadow-sm appearance-none cursor-pointer text-slate-700"
              >
                <option value="All">All Domains</option>
                <option value="volunteer">Volunteer</option>
                <option value="Management">Management</option>
                <option value="Social Creation">Social Creation</option>
                <option value="Design">Design</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- SMOOTH COMPACT TABLE --- */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-white/70 backdrop-blur-2xl border border-white rounded-[2rem] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] overflow-hidden p-2 sm:p-3">
          
          <div className="overflow-x-auto rounded-[1.5rem] bg-white border border-slate-100/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)]">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              
              {/* Table Head */}
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4 rounded-tl-[1.5rem]">Applicant</th>
                  <th className="px-6 py-4">Domain Focus</th>
                  <th className="px-6 py-4">Contact Info</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 bg-slate-200 rounded-full"></div><div className="w-24 h-3 bg-slate-200 rounded-full"></div></div></td>
                      <td className="px-6 py-4"><div className="w-20 h-5 bg-slate-200 rounded-full"></div></td>
                      <td className="px-6 py-4"><div className="w-32 h-3 bg-slate-200 rounded-full"></div></td>
                      <td className="px-6 py-4 text-right"><div className="w-16 h-6 bg-slate-200 rounded-full ml-auto"></div></td>
                    </tr>
                  ))
                ) : filteredApplicants.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-20 text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300"><Users size={24} /></div>
                      <p className="text-sm font-bold text-slate-700">No records found</p>
                      <p className="text-xs font-medium text-slate-400 mt-1">Try clearing your search filters.</p>
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {filteredApplicants.map((app) => {
                      const conf = getRoleConfig(app.intrest);
                      return (
                        <motion.tr 
                          layout
                          initial={{ opacity: 0, opacity: 0 }} 
                          animate={{ opacity: 1, opacity: 1 }} 
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          key={app._id} 
                          className="group hover:bg-[#F0F9FF]/30 transition-colors duration-200"
                        >
                          {/* Col 1: Profile */}
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-3.5">
                              <div className="w-10 h-10 rounded-[10px] bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-sm shrink-0">
                                {getInitials(app.name)}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[13px] font-black text-slate-800">{app.name}</span>
                                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 mt-0.5">
                                  <Clock size={10} /> {timeAgo(app.createdAt)}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Col 2: Role */}
                          <td className="px-6 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${conf.bg} ${conf.color} ${conf.border}`}>
                              {conf.icon} {app.intrest || "Member"}
                            </span>
                          </td>

                          {/* Col 3: Contact */}
                          <td className="px-6 py-3.5">
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center gap-2 text-[12px] font-bold text-slate-500">
                                <Mail size={12} className="text-slate-400" />
                                <span className="truncate w-36 sm:w-auto">{app.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[12px] font-bold text-slate-500">
                                <Phone size={12} className="text-slate-400" />
                                <span>{app.phone}</span>
                              </div>
                            </div>
                          </td>

                          

                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ManageApplicants;