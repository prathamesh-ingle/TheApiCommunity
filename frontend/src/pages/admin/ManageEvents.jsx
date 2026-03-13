import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarPlus, Download, Search, Edit3, Trash2, 
  MapPin, Clock, X, Plus, UploadCloud, Image as ImageIcon
} from "lucide-react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { getAdminDashboard, deleteEvent, createEvent, updateEvent } from "../../api/adminApi";

// --- Animations ---
const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const cardVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // --- Modal & Form State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "", short_Description: "", detailed_Description: "", date: "", time: "", event_Location: ""
  });
  const [eventImages, setEventImages] = useState([]); 
  const [speakers, setSpeakers] = useState([]); 

  // --- Fetch Events ---
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await getAdminDashboard();
      // Sort date-wise (Newest events first)
      const sorted = (res.data.events || []).sort((a, b) => new Date(b.date) - new Date(a.date));
      setEvents(sorted);
    } catch (error) {
      toast.error("Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  // --- Excel Export ---
  const handleExportExcel = () => {
    if (events.length === 0) return toast.error("No events to export");
    
    const exportData = events.map((e, index) => ({
      "S.No": index + 1,
      "Event Title": e.title,
      "Date": new Date(e.date).toLocaleDateString(),
      "Time": e.time || "TBD",
      "Location": e.event_Location,
      "Total Speakers": e.speakers?.length || 0,
      "Speakers Names": e.speakers?.map(s => s.name).join(", ") || "None",
      "Short Description": e.short_Description
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Events");
    XLSX.writeFile(workbook, `API_Community_Events_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Excel downloaded successfully!");
  };

  // --- Delete Event ---
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event? All associated Cloudinary images will also be removed.")) return;
    const tId = toast.loading("Deleting event...");
    try {
      await deleteEvent(id);
      toast.success("Event deleted successfully.", { id: tId });
      fetchEvents();
    } catch (error) {
      toast.error("Failed to delete event.", { id: tId });
    }
  };

  // --- Form Handlers ---
  const openModal = (event = null) => {
    if (event) {
      setEditingId(event._id);
      setFormData({
        title: event.title, 
        short_Description: event.short_Description, 
        detailed_Description: event.detailed_Description, 
        date: event.date.split('T')[0], // Format for input type="date"
        time: event.time, 
        event_Location: event.event_Location
      });
      // Load existing speakers and attach a blank imageFile placeholder
      setSpeakers(event.speakers.map(s => ({ ...s, imageFile: null })));
    } else {
      setEditingId(null);
      setFormData({ title: "", short_Description: "", detailed_Description: "", date: "", time: "", event_Location: "" });
      setSpeakers([]);
    }
    setEventImages([]);
    setIsModalOpen(true);
  };

  const addSpeakerField = () => {
    setSpeakers([...speakers, { name: "", linkedIn_Profile: "", bio: "", imageFile: null }]);
  };

  const updateSpeaker = (index, field, value) => {
    const updated = [...speakers];
    updated[index][field] = value;
    setSpeakers(updated);
  };

  const removeSpeaker = (index) => {
    setSpeakers(speakers.filter((_, i) => i !== index));
  };

  // --- Submit Form (Creates Multipart FormData) ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const tId = toast.loading(editingId ? "Updating Event..." : "Creating Event...");

    try {
      const data = new FormData();
      
      // 1. Append Text Data
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      
      // 2. Append Event Gallery Images
      if (eventImages.length > 0) {
        Array.from(eventImages).forEach(file => data.append("eventImages", file));
      }

      // 3. Format Speakers JSON
      const speakerJson = speakers.map(s => ({
        name: s.name, 
        linkedIn_Profile: s.linkedIn_Profile, 
        bio: s.bio, 
        speaker_Image_Url: s.speaker_Image_Url || null
      }));
      data.append("speakers", JSON.stringify(speakerJson));

      // 4. Append Speaker Images
      let missingImages = false;
      speakers.forEach((s) => {
        if (s.imageFile) {
          data.append("speakerImages", s.imageFile);
        } else if (editingId && s.speaker_Image_Url) {
           data.append("speakerImages", new File([""], "placeholder.txt", { type: "text/plain" }));
        } else {
          missingImages = true;
        }
      });

      if (!editingId && missingImages) {
        toast.error("Every speaker must have a profile image.", { id: tId });
        setIsSubmitting(false);
        return;
      }

      // Execute API Call
      if (editingId) {
        await updateEvent(editingId, data);
      } else {
        await createEvent(data);
      }

      toast.success(`Event ${editingId ? 'updated' : 'created'} successfully!`, { id: tId });
      setIsModalOpen(false);
      fetchEvents();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save event. Ensure files are < 10MB.", { id: tId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredEvents = events.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-6 pb-24 pt-4 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white px-5 py-4 rounded-[1.5rem] border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Event Master Control</h1>
          <p className="text-[11px] font-medium text-slate-500 mt-1 uppercase tracking-widest">Date-wise Community Gatherings</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button onClick={handleExportExcel} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-sm active:scale-95 flex-1 sm:flex-none">
            <Download size={16} /> Export
          </button>
          <button onClick={() => openModal()} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0A7294] to-[#22B3AD] hover:shadow-lg hover:shadow-[#0A7294]/30 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-sm active:scale-95 flex-1 sm:flex-none">
            <CalendarPlus size={16} /> New Event
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative max-w-xl group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-[#0A7294] transition-colors" />
        <input 
          type="text" 
          placeholder="Search events by title..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-[1.25rem] text-sm font-medium focus:border-[#22B3AD] focus:ring-4 focus:ring-[#22B3AD]/10 outline-none shadow-sm transition-all placeholder:text-slate-400" 
        />
      </div>

      {/* EVENT LIST */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 gap-4">
        {loading ? (
           <div className="h-40 bg-slate-50 animate-pulse rounded-[1.5rem] border border-slate-100" /> 
        ) : filteredEvents.length === 0 ? (
           <div className="bg-white rounded-[1.5rem] py-16 text-center border-2 border-dashed border-slate-200 flex flex-col items-center">
             <CalendarPlus size={40} className="text-slate-300 mb-3" />
             <p className="text-slate-500 font-bold text-sm">No events found in the database.</p>
           </div>
        ) : (
          filteredEvents.map((event) => {
            const eventDate = new Date(event.date);
            const isPast = eventDate < new Date();

            return (
              <motion.div key={event._id} variants={cardVariants} className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-[#BAE6FD] transition-all flex flex-col lg:flex-row items-start lg:items-center gap-6 relative overflow-hidden group">
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isPast ? 'bg-slate-300' : 'bg-gradient-to-b from-[#0A7294] to-[#22B3AD]'}`} />
                
                <div className="flex-1 pl-2 min-w-0">
                  <div className="mb-2">
                    <span className={`text-[9px] font-black px-2.5 py-1 rounded uppercase tracking-widest ${isPast ? 'text-slate-500 bg-slate-100' : 'text-[#0A7294] bg-[#F0F9FF] border border-[#BAE6FD]/50'}`}>
                      {isPast ? 'Completed' : 'Upcoming'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight truncate mb-1">{event.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2">{event.short_Description}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 lg:px-8 lg:border-x border-slate-100 w-full lg:w-auto">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                      <Clock size={16} className="text-[#22B3AD]" /> 
                      {eventDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} • {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                      <MapPin size={16} className="text-[#22B3AD]" /> 
                      <span className="truncate max-w-[200px]">{event.event_Location}</span>
                    </div>
                  </div>
                  
                  {/* Speaker Avatars */}
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {event.speakers?.slice(0, 3).map((s, i) => (
                        <img key={i} src={s.speaker_Image_Url} alt={s.name} title={s.name} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 object-cover shadow-sm hover:scale-110 hover:z-10 transition-transform" />
                      ))}
                      {event.speakers?.length > 3 && (
                        <div className="w-10 h-10 rounded-full bg-slate-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                          +{event.speakers.length - 3}
                        </div>
                      )}
                    </div>
                    {event.speakers?.length === 0 && <span className="text-xs text-slate-400 italic">No speakers</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 w-full lg:w-auto justify-end mt-4 lg:mt-0">
                  <button onClick={() => openModal(event)} className="p-3 rounded-xl bg-slate-50 text-slate-600 hover:text-[#0A7294] hover:bg-[#F0F9FF] border border-transparent hover:border-[#BAE6FD] transition-colors" title="Edit Event">
                    <Edit3 size={18} />
                  </button>
                  <button onClick={() => handleDelete(event._id)} className="p-3 rounded-xl bg-slate-50 text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors" title="Delete Event">
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ); // <-- This was the missing semicolon return fix!
          })
        )}
      </motion.div>

      {/* --- ADD/EDIT MODAL OVERLAY --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)} />
            
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest">{editingId ? "Update Event Profile" : "Create New Event"}</h2>
                <button onClick={() => setIsModalOpen(false)} disabled={isSubmitting} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-800 shadow-sm border border-slate-200 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-8">
                
                {/* 1. Basic Details */}
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2"><MapPin size={16} className="text-[#0A7294]" /> Core Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Event Title</label>
                      <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full mt-1.5 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#22B3AD] focus:ring-4 focus:ring-[#22B3AD]/10 transition-all outline-none text-sm font-medium" placeholder="e.g. Masterclass: API Architecture" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date</label>
                      <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full mt-1.5 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#22B3AD] focus:ring-4 focus:ring-[#22B3AD]/10 transition-all outline-none text-sm font-medium text-slate-700" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Time</label>
                      <input required type="text" placeholder="e.g. 10:00 AM - 4:00 PM" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full mt-1.5 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#22B3AD] focus:ring-4 focus:ring-[#22B3AD]/10 transition-all outline-none text-sm font-medium" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Location</label>
                      <input required type="text" placeholder="e.g. Pune, India or Virtual (Zoom)" value={formData.event_Location} onChange={e => setFormData({...formData, event_Location: e.target.value})} className="w-full mt-1.5 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#22B3AD] focus:ring-4 focus:ring-[#22B3AD]/10 transition-all outline-none text-sm font-medium" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Short Description</label>
                      <input required type="text" placeholder="A one-line hook for the event card" value={formData.short_Description} onChange={e => setFormData({...formData, short_Description: e.target.value})} className="w-full mt-1.5 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#22B3AD] focus:ring-4 focus:ring-[#22B3AD]/10 transition-all outline-none text-sm font-medium" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Detailed Description</label>
                      <textarea required rows="4" placeholder="Full details, schedule, prerequisites..." value={formData.detailed_Description} onChange={e => setFormData({...formData, detailed_Description: e.target.value})} className="w-full mt-1.5 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#22B3AD] focus:ring-4 focus:ring-[#22B3AD]/10 transition-all outline-none text-sm font-medium custom-scrollbar" />
                    </div>
                  </div>
                </div>

                {/* 2. Event Images */}
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2"><ImageIcon size={16} className="text-[#0A7294]" /> Event Media</h3>
                  <div className="p-5 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors relative">
                    <input type="file" multiple accept="image/*" onChange={e => setEventImages(e.target.files)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="flex items-center gap-4 pointer-events-none">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-[#22B3AD]">
                        <UploadCloud size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">Upload Gallery Images <span className="text-slate-400 font-normal text-xs">(Multiple allowed)</span></p>
                        <p className="text-xs font-medium text-slate-500 mt-1">
                          {eventImages.length > 0 ? <span className="text-[#0A7294] font-bold">{eventImages.length} files selected</span> : "Drag & drop or click to select files"}
                        </p>
                      </div>
                    </div>
                  </div>
                  {editingId && <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mt-2 flex items-center gap-1">* <span className="normal-case tracking-normal font-medium text-slate-500">Uploading new files will append them to the existing gallery.</span></p>}
                </div>

                {/* 3. Speakers Array */}
                <div>
                  <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2"><Users size={16} className="text-[#0A7294]" /> Speaker Lineup</h3>
                    <button type="button" onClick={addSpeakerField} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#0A7294] bg-[#F0F9FF] hover:bg-[#E0F2FE] border border-[#BAE6FD] px-3 py-1.5 rounded-lg transition-colors">
                      <Plus size={14}/> Add Speaker
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {speakers.map((speaker, index) => (
                      <div key={index} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm relative group transition-all hover:border-[#BAE6FD]">
                        <button type="button" onClick={() => removeSpeaker(index)} className="absolute top-3 right-3 p-1.5 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16}/></button>
                        
                        <div className="flex items-center gap-2 mb-3">
                           <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">{index + 1}</span>
                           <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">Speaker Profile</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Name</label>
                            <input required type="text" placeholder="John Doe" value={speaker.name} onChange={e => updateSpeaker(index, 'name', e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm font-medium focus:bg-white focus:border-[#22B3AD]" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">LinkedIn URL</label>
                            <input type="text" placeholder="https://linkedin.com/in/johndoe" value={speaker.linkedIn_Profile} onChange={e => updateSpeaker(index, 'linkedIn_Profile', e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm font-medium focus:bg-white focus:border-[#22B3AD]" />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Short Bio</label>
                            <input type="text" placeholder="Senior Architect at Google..." value={speaker.bio} onChange={e => updateSpeaker(index, 'bio', e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none text-sm font-medium focus:bg-white focus:border-[#22B3AD]" />
                          </div>
                          
                          <div className="md:col-span-2 mt-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Profile Picture {(!editingId || !speaker.speaker_Image_Url) && <span className="text-rose-500">*</span>}</label>
                            <div className="flex items-center gap-4">
                              {/* Show existing image preview if editing */}
                              {editingId && speaker.speaker_Image_Url && !speaker.imageFile && (
                                <img src={speaker.speaker_Image_Url} alt="Current" className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 shadow-sm" />
                              )}
                              
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={e => updateSpeaker(index, 'imageFile', e.target.files[0])} 
                                className="text-xs file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-slate-100 file:text-slate-700 file:font-bold hover:file:bg-slate-200 file:transition-colors file:cursor-pointer outline-none" 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {speakers.length === 0 && (
                      <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                        <Users size={32} className="text-slate-300 mb-2"/>
                        <p className="text-sm font-bold text-slate-600">No speakers assigned.</p>
                        <p className="text-xs text-slate-400 mt-1">Click "Add Speaker" to build your lineup.</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Submit Button */}
                <div className="pt-6 pb-2 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3 sticky bottom-0 bg-white z-10">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-slate-50 transition-colors w-full sm:w-auto">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="flex justify-center items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#0A7294] to-[#22B3AD] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:shadow-lg hover:shadow-[#0A7294]/30 transition-all disabled:opacity-50 w-full sm:w-auto active:scale-95">
                    {isSubmitting ? (
                      <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Processing...</>
                    ) : editingId ? "Save Changes" : "Publish Event"}
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ManageEvents;