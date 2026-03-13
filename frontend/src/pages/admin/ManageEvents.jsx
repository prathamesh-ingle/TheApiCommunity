import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarPlus, Download, Search, Edit3, Trash2, 
  MapPin, Clock, Filter, Activity, Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { getAdminDashboard, deleteEvent } from "../../api/adminApi";

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const cardVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

const ManageEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- Filters ---
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await getAdminDashboard();
      const sorted = (res.data.events || []).sort((a, b) => new Date(b.date) - new Date(a.date));
      setEvents(sorted);
    } catch (error) {
      toast.error("Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase());
    const eventDate = new Date(e.date);
    eventDate.setHours(0, 0, 0, 0); 

    let matchesFromDate = true;
    if (fromDate) {
      const from = new Date(fromDate);
      from.setHours(0, 0, 0, 0);
      matchesFromDate = eventDate >= from;
    }

    let matchesToDate = true;
    if (toDate) {
      const to = new Date(toDate);
      to.setHours(0, 0, 0, 0);
      matchesToDate = eventDate <= to;
    }

    return matchesSearch && matchesFromDate && matchesToDate;
  });

  const handleExportExcel = () => {
    if (filteredEvents.length === 0) return toast.error("No events to export.");
    const exportData = filteredEvents.map((e, index) => ({
      "S.No": index + 1, "Event Title": e.title, "Date": new Date(e.date).toLocaleDateString(),
      "Time": e.time || "TBD", "Location": e.event_Location, "Total Speakers": e.speakers?.length || 0,
      "Speakers Names": e.speakers?.map(s => s.name).join(", ") || "None", "Description": e.short_Description
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Events");
    XLSX.writeFile(workbook, `API_Events_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Excel exported!");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event? Cloudinary media will be wiped.")) return;
    const tId = toast.loading("Deleting...");
    try {
      await deleteEvent(id);
      toast.success("Event deleted.", { id: tId });
      fetchEvents();
    } catch (error) {
      toast.error("Failed to delete.", { id: tId });
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/50 font-sans pb-24 px-4 sm:px-6 lg:px-8 pt-6 selection:bg-[#0A7294]/20">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#22B3AD]/10 via-[#0A7294]/5 to-transparent blur-[100px] pointer-events-none rounded-full -z-10"></div>

      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* --- HEADER --- */}
        <div className="sticky top-4 z-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 backdrop-blur-xl px-6 py-4 rounded-[1.5rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#065069] to-[#0A7294] shadow-lg shadow-[#0A7294]/20 flex items-center justify-center text-white"><Activity size={22} /></div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Event Master Control</h1>
              <p className="text-[10px] font-bold text-[#0A7294] mt-1 uppercase tracking-widest">Network Telemetry</p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button onClick={handleExportExcel} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all shadow-sm active:scale-95 flex-1 md:flex-none">
              <Download size={14} /> Export
            </button>
            <button onClick={() => navigate("/admin/add-event")} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#0A7294] to-[#22B3AD] hover:shadow-lg hover:shadow-[#0A7294]/30 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all shadow-sm active:scale-95 flex-1 md:flex-none">
              <CalendarPlus size={14} /> New Event
            </button>
          </div>
        </div>

        {/* --- FILTERS --- */}
        <div className="bg-white/60 backdrop-blur-md p-4 rounded-[1.5rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative w-full lg:w-1/3 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-[#0A7294] transition-colors" />
            <input type="text" placeholder="Search events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-medium focus:border-[#22B3AD] focus:ring-4 focus:ring-[#22B3AD]/10 outline-none transition-all shadow-sm" />
          </div>
          <div className="h-6 w-px bg-slate-200 hidden lg:block"></div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-2/3">
            <div className="flex items-center gap-3 w-full sm:w-1/2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm focus-within:border-[#22B3AD] focus-within:ring-4 focus-within:ring-[#22B3AD]/10 transition-all">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">From</label>
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full bg-transparent text-[13px] font-medium outline-none text-slate-700" />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-1/2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm focus-within:border-[#22B3AD] focus-within:ring-4 focus-within:ring-[#22B3AD]/10 transition-all">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">To</label>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full bg-transparent text-[13px] font-medium outline-none text-slate-700" />
            </div>
            {(searchTerm || fromDate || toDate) && (
              <button onClick={() => { setSearchTerm(""); setFromDate(""); setToDate(""); }} className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors shrink-0 border border-transparent hover:border-rose-100" title="Clear Filters">
                <Filter size={16} className="rotate-180" />
              </button>
            )}
          </div>
        </div>

        {/* --- LIST --- */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 gap-4">
          {loading ? (
             <div className="h-32 bg-white/50 animate-pulse rounded-[1.5rem] border border-slate-100" /> 
          ) : filteredEvents.length === 0 ? (
             <div className="bg-white/60 rounded-[2rem] py-20 text-center border-2 border-dashed border-slate-200 flex flex-col items-center">
               <CalendarPlus size={40} className="text-slate-300 mb-4" />
               <p className="text-slate-600 font-bold text-sm">No events found.</p>
               <p className="text-[11px] text-slate-400 font-medium mt-1">Try adjusting your filters or add a new event.</p>
             </div>
          ) : (
            filteredEvents.map((event) => {
              const eventDate = new Date(event.date);
              const isPast = eventDate < new Date(new Date().setHours(0,0,0,0));

              return (
                <motion.div key={event._id} variants={cardVariants} className="bg-white/90 backdrop-blur-xl rounded-[1.5rem] p-5 sm:p-6 shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-slate-100 hover:shadow-[0_8px_30px_rgba(10,114,148,0.06)] hover:border-[#BAE6FD] transition-all flex flex-col lg:flex-row items-start lg:items-center gap-6 relative overflow-hidden group">
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isPast ? 'bg-slate-200' : 'bg-gradient-to-b from-[#0A7294] to-[#22B3AD]'}`} />
                  
                  <div className="flex-1 pl-3 min-w-0">
                    <div className="mb-2">
                      <span className={`text-[9px] font-black px-2.5 py-1 rounded uppercase tracking-widest ${isPast ? 'text-slate-500 bg-slate-100' : 'text-[#0A7294] bg-[#F0F9FF] border border-[#BAE6FD]/50'}`}>
                        {isPast ? 'Completed' : 'Upcoming'}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight truncate mb-1.5">{event.title}</h3>
                    <p className="text-[13px] font-medium text-slate-500 line-clamp-2">{event.short_Description}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 lg:px-8 lg:border-x border-slate-100 w-full lg:w-auto">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-[13px] text-slate-700 font-bold">
                        <Clock size={16} className="text-[#22B3AD]" /> 
                        {eventDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} • {event.time}
                      </div>
                      <div className="flex items-center gap-2 text-[12px] text-slate-500 font-medium">
                        <MapPin size={15} className="text-[#22B3AD]" /> 
                        <span className="truncate max-w-[200px]">{event.event_Location}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-3">
                        {event.speakers?.slice(0, 3).map((s, i) => (
                          <img key={i} src={s.speaker_Image_Url} alt={s.name} title={s.name} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 object-cover shadow-sm hover:scale-110 hover:z-10 transition-transform" />
                        ))}
                        {event.speakers?.length > 3 && (
                          <div className="w-10 h-10 rounded-full bg-slate-50 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-500 shadow-sm">
                            +{event.speakers.length - 3}
                          </div>
                        )}
                      </div>
                      {event.speakers?.length === 0 && <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 border-dashed flex items-center justify-center"><Users size={14} className="text-slate-300"/></div>}
                    </div>
                  </div>

                  <div className="flex gap-2 w-full lg:w-auto justify-end mt-4 lg:mt-0">
                    {/* Assuming you will pass state or use a route to edit */}
                    <button onClick={() => navigate(`/admin/edit-event/${event._id}`)} className="p-3 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-[#0A7294] hover:border-[#BAE6FD] hover:bg-[#F0F9FF] transition-all shadow-sm">
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => handleDelete(event._id)} className="p-3 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-all shadow-sm">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ); 
            })
          )}
        </motion.div>

      </div>
    </div>
  );
};

export default ManageEvents;