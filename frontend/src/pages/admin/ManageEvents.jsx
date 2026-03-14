import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarPlus, Download, Search, Edit3, Trash2, 
  MapPin, Clock, Filter, Activity, Users,
  X,Eye,Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { getAdminDashboard, deleteEvent, updateEvent } from "../../api/adminApi";
import EventForm from "../../components/admin/EventForm.jsx";
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
      window.location.reload();
      fetchEvents();
    } catch (error) {
      toast.error("Failed to delete.", { id: tId });
    }
  };
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingEvent, setViewingEvent] = useState(null);
// Function to trigger when Edit is clicked
const handleEditClick = (event) => {
  setEditingEvent(event); // This opens the form and fills it with data
};
const handleUpdate = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const updatedData = Object.fromEntries(formData.entries());

  const tId = toast.loading("Updating event...");
  try {
    // 2. Use the imported function
    await updateEvent(editingEvent._id, updatedData);
    
    toast.success("Event updated!", { id: tId });
    setEditingEvent(null); 
    fetchEvents(); // Refresh the list automatically
  } catch (error) {
    toast.error("Update failed.", { id: tId });
  }
};
const handleUpdateSubmit = async ({ formData, eventImages, speakers }) => {
  const tId = toast.loading("Saving changes...");
  try {
    const data = new FormData();
    
    // 1. Append basic text fields
    Object.keys(formData).forEach(key => {
      // Don't append empty or old image URLs here
      if (key !== 'eventImages' && key !== 'speakers') {
        data.append(key, formData[key]);
      }
    });

    // 2. Append New Gallery Images
    if (eventImages.length > 0) {
      eventImages.forEach(file => data.append("eventImages", file));
    }

    // 3. Handle Speakers
    // We send speaker metadata as JSON, and images separately
    const speakerJson = speakers.map(s => ({
      name: s.name,
      linkedIn_Profile: s.linkedIn_Profile,
      bio: s.bio,
      // Keep existing URL if no new file is uploaded
      speaker_Image_Url: s.imageFile ? null : s.speaker_Image_Url 
    }));
    data.append("speakers", JSON.stringify(speakerJson));

    speakers.forEach((s) => {
      if (s.imageFile) data.append("speakerImages", s.imageFile);
    });

    // 4. Call your API (Ensure updateEvent is imported from adminApi)
    await updateEvent(editingEvent._id, data);

    toast.success("Event updated successfully!", { id: tId });
    setEditingEvent(null); // Close the form
    fetchEvents(); // Refresh the list
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "Update failed.", { id: tId });
  }
};

  return (
    <div className="w-full min-h-screen bg-slate-50/50 font-sans pb-24 px-4 sm:px-6 lg:px-8 pt-6 selection:bg-[#0A7294]/20">
<AnimatePresence>
  {editingEvent && (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      // FIX: Changed z-[100] to z-[9999] so it floats above the Navbar
      className="fixed inset-0 z-[9999] bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-2 sm:p-6"
    >
      <motion.div 
        initial={{ y: 20, opacity: 0, scale: 0.95 }} 
        animate={{ y: 0, opacity: 1, scale: 1 }} 
        exit={{ y: 20, opacity: 0, scale: 0.95 }}
        // 1. Removed padding here, added flex-col and overflow-hidden
        className="bg-slate-50/95 backdrop-blur-xl w-full max-w-6xl max-h-[95vh] rounded-[2rem] shadow-2xl border border-white relative flex flex-col overflow-hidden"
      >
        
        {/* 2. THE FLUSH HEADER - No negative margins needed */}
        <div className="bg-white z-10 px-5 py-4 sm:px-8 sm:py-6 flex justify-between items-center border-b border-slate-200 shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Update Event</h2>
            <p className="text-[10px] sm:text-xs font-bold text-[#0A7294] uppercase tracking-widest mt-1 truncate max-w-[200px] sm:max-w-md">Modifying: {editingEvent.title}</p>
          </div>
          <button onClick={() => setEditingEvent(null)} className="p-2 bg-slate-50 border border-slate-200 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 rounded-full transition-all shadow-sm">
             <X size={20} />
          </button>
        </div>

        {/* 3. THE SCROLLING BODY - Padding is applied here instead */}
        <div className="p-5 sm:p-8 overflow-y-auto custom-scrollbar">
          <EventForm 
            initialData={editingEvent} 
            onSubmit={handleUpdateSubmit} 
            isSubmitting={loading} 
          />
        </div>

      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
{/* THE VIEW EVENT MODAL */}
<AnimatePresence>
  {viewingEvent && (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      // FIX: Changed z-[100] to z-[9999] so it floats above the Navbar
      className="fixed inset-0 z-[9999] bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-2 sm:p-6"
    >
      <motion.div 
        initial={{ y: 20, opacity: 0, scale: 0.95 }} 
        animate={{ y: 0, opacity: 1, scale: 1 }} 
        exit={{ y: 20, opacity: 0, scale: 0.95 }}
        className="bg-slate-50/95 backdrop-blur-xl w-full max-w-5xl max-h-[95vh] rounded-[2rem] shadow-2xl border border-white relative flex flex-col overflow-hidden"
      >
        {/* Flush Header */}
        <div className="bg-white z-10 px-5 py-5 sm:px-8 sm:py-6 flex justify-between items-center border-b border-slate-200 shrink-0 shadow-sm">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className={`text-[9px] font-black px-2.5 py-1 rounded uppercase tracking-widest ${new Date(viewingEvent.date) < new Date() ? 'text-slate-500 bg-slate-100' : 'text-[#0A7294] bg-[#F0F9FF] border border-[#BAE6FD]/50'}`}>
                {new Date(viewingEvent.date) < new Date() ? 'Completed' : 'Upcoming'}
              </span>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Calendar size={12}/> {new Date(viewingEvent.date).toLocaleDateString()}</p>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">{viewingEvent.title}</h2>
          </div>
          <button onClick={() => setViewingEvent(null)} className="p-2.5 bg-slate-50 border border-slate-200 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 rounded-full transition-all shadow-sm">
             <X size={20} />
          </button>
        </div>

        {/* Scrolling Body */}
        <div className="p-5 sm:p-8 overflow-y-auto custom-scrollbar space-y-8">
          
          {/* Detailed Info Card */}
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-[#0A7294] border-l-4 border-[#22B3AD] pl-4">{viewingEvent.short_Description}</h3>
            <p className="text-sm font-medium text-slate-600 whitespace-pre-wrap leading-relaxed">
              {viewingEvent.detailed_Description}
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200"><Clock size={16} className="text-[#22B3AD]"/> {viewingEvent.time}</div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200"><MapPin size={16} className="text-[#22B3AD]"/> {viewingEvent.event_Location}</div>
            </div>
          </div>

          {/* Speakers Grid */}
          {viewingEvent.speakers?.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase mb-5 ml-2"><Users size={18} className="text-[#FF9A3D]"/> Featured Speakers</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {viewingEvent.speakers.map((s, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-[#BAE6FD] hover:shadow-md transition-all">
                    <img src={s.speaker_Image_Url || "https://via.placeholder.com/150"} alt={s.name} className="w-16 h-16 rounded-full object-cover border-4 border-slate-50 shadow-sm group-hover:scale-105 transition-transform" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-slate-800 truncate">{s.name}</h4>
                      <p className="text-[11px] font-medium text-slate-500 line-clamp-2 mt-0.5">{s.bio}</p>
                      {s.linkedIn_Profile && (
                        <a href={s.linkedIn_Profile} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-[#0A7294] uppercase tracking-widest hover:underline mt-2 inline-block">LinkedIn ↗</a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery Grid */}
          {viewingEvent.eventImages?.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase mb-5 ml-2"><ImageIcon size={18} className="text-indigo-500"/> Event Gallery</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {viewingEvent.eventImages.map((imgUrl, idx) => (
                  <div key={idx} className="aspect-square rounded-2xl overflow-hidden border border-slate-200 shadow-sm group">
                    <img src={imgUrl} alt="gallery" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#22B3AD]/10 via-[#0A7294]/5 to-transparent blur-[100px] pointer-events-none rounded-full -z-10"></div>

      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* --- HEADER --- */}
        <div className="sticky top-4 z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 backdrop-blur-xl px-6 py-4 rounded-[1.5rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
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
                    
                    <div className="flex items-center gap-2 text-[12px] font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
  <Users size={14} className="text-[#FF9A3D]" />
  {event.speakers?.length || 0} Speakers
</div>
                  </div>

                  <div className="flex gap-2 w-full lg:w-auto justify-end mt-4 lg:mt-0">
                    {/* Assuming you will pass state or use a route to edit */}
                    <button onClick={() => setViewingEvent(event)} className="p-3 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-500 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm" title="View Full Details">
                   <Eye size={16} />
                 </button>
                    <button onClick={() => handleEditClick(event)} className="p-3 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-[#0A7294] hover:border-[#BAE6FD] hover:bg-[#F0F9FF] transition-all shadow-sm">
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