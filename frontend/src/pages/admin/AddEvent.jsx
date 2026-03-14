// frontend/src/pages/admin/AddEvent.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Calendar, Clock, MapPin, 
  ImageIcon, Users, Plus, Trash2, UploadCloud, 
  Camera, LayoutTemplate, AlignLeft, Sparkles, CheckCircle2
} from "lucide-react";
import toast from "react-hot-toast";
import { createEvent } from "../../api/adminApi"; 

const AddEvent = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [formData, setFormData] = useState({
    title: "", short_Description: "", detailed_Description: "", date: "", time: "", event_Location: ""
  });
  
  const [eventImages, setEventImages] = useState([]); 
  const [speakers, setSpeakers] = useState([]); 

  // --- Speaker Handlers ---
  const addSpeakerField = () => setSpeakers([...speakers, { name: "", linkedIn_Profile: "", bio: "", imageFile: null }]);
  
  const updateSpeaker = (index, field, value) => {
    const updated = [...speakers];
    updated[index][field] = value;
    setSpeakers(updated);
  };
  
  const removeSpeaker = (index) => setSpeakers(speakers.filter((_, i) => i !== index));

  // --- Image Handlers ---
  const handleImageSelect = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setEventImages((prev) => [...prev, ...newFiles]);
    }
  };

  const removeImage = (indexToRemove) => {
    setEventImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // --- Submit Handler ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    let missingImages = false;
    speakers.forEach((s) => { if (!s.imageFile) missingImages = true; });
    if (speakers.length > 0 && missingImages) {
      toast.error("Profile images are required for all added speakers.");
      return;
    }

    setIsSubmitting(true);
    const tId = toast.loading("Deploying to database...");

    try {
      const data = new FormData();
      
      // Append text fields
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      
      // Append Gallery Images
      if (eventImages.length > 0) {
        eventImages.forEach(file => data.append("eventImages", file));
      }

      // Append Speakers JSON - Ensure it's a clean stringified array
      const speakerJson = speakers.map(s => ({ 
          name: s.name, 
          linkedIn_Profile: s.linkedIn_Profile, 
          bio: s.bio, 
          speaker_Image_Url: null 
      }));
      data.append("speakers", JSON.stringify(speakerJson));

      // Append Speaker Profile Pictures in exact order
      speakers.forEach((s) => {
        if (s.imageFile) data.append("speakerImages", s.imageFile);
      });

      // API Call
      await createEvent(data);
      
      toast.success("Event successfully published!", { id: tId });
      setShowSuccessPopup(true);
      
      // Show popup for 2 seconds, then navigate
      setTimeout(() => navigate("/admin/events"), 2000);

    } catch (error) {
      console.error("Upload Error:", error);
      toast.error(error.response?.data?.message || "Failed to deploy event.", { id: tId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Premium Soft Styles ---
  const inputClass = "w-full bg-slate-50/50 border border-slate-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)] focus:bg-white focus:border-[#0A7294]/30 rounded-2xl px-5 py-3.5 text-[14px] font-medium text-slate-800 focus:ring-4 focus:ring-[#0A7294]/10 outline-none transition-all duration-300 placeholder:text-slate-400";
  const labelClass = "text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-2 block ml-1";
  const cardClass = "bg-white/80 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 rounded-[2.5rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] border border-white/60 relative overflow-hidden";

  return (
    <div className="w-full min-h-screen bg-[#F5F7FA] font-sans pb-24 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 selection:bg-[#0A7294]/20 relative">
      
      {/* Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-[#22B3AD]/[0.04] blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#0A7294]/[0.04] blur-[120px]" />
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <form onSubmit={handleFormSubmit}>
          
          {/* --- STICKY APP-LIKE HEADER --- */}
          <div className="sticky top-4 sm:top-6 z-40 flex items-center justify-between bg-white/80 backdrop-blur-xl p-3 sm:px-6 sm:py-4 rounded-[2rem] border border-white/60 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] mb-8 sm:mb-12 transition-all">
            <div className="flex items-center gap-3 sm:gap-5">
              <button type="button" onClick={() => navigate(-1)} className="w-10 h-10 sm:w-12 sm:h-12 rounded-[1rem] bg-slate-50 flex items-center justify-center text-slate-500 hover:text-[#0A7294] hover:bg-[#F0F9FF] transition-all border border-slate-100 shadow-sm group">
                <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-black text-slate-800 leading-none tracking-tight">Create Event</span>
                <span className="text-[10px] sm:text-[11px] font-extrabold text-[#0A7294] uppercase tracking-widest mt-1.5 flex items-center gap-1">
                  <Sparkles size={10} /> Publish to Community
                </span>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="bg-gradient-to-r from-[#0A7294] to-[#22B3AD] hover:shadow-[0_10px_25px_-5px_rgba(10,114,148,0.4)] text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl font-bold text-[12px] sm:text-[13px] uppercase tracking-widest transition-all duration-300 disabled:opacity-60 flex items-center gap-2 active:scale-95"
            >
              {isSubmitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : "Publish Event"}
            </button>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-10">

            {/* ================= LEFT COLUMN: DETAILS ================= */}
            <div className="xl:col-span-7 space-y-8 lg:space-y-10">
              
              <div className={cardClass}>
                <div className="flex items-center gap-3.5 mb-8 border-b border-slate-100/50 pb-5">
                  <div className="w-10 h-10 bg-[#0A7294]/10 rounded-[12px] flex items-center justify-center"><LayoutTemplate size={18} className="text-[#0A7294]" /></div>
                  <h2 className="text-base font-black text-slate-800 uppercase tracking-widest">Event Master Data</h2>
                </div>
                
                <div className="space-y-7">
                  <div className="group">
                    <label className={labelClass}>Event Title</label>
                    <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputClass} placeholder="e.g. System Design Masterclass" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                    <div className="group">
                      <label className={labelClass}>Date</label>
                      <div className="relative">
                        <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0A7294] transition-colors" />
                        <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className={`${inputClass} pl-12 text-slate-600`} />
                      </div>
                    </div>
                    <div className="group">
                      <label className={labelClass}>Time</label>
                      <div className="relative">
                        <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0A7294] transition-colors" />
                        <input required type="text" placeholder="10:00 AM - 02:00 PM" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className={`${inputClass} pl-12`} />
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <label className={labelClass}>Location / Meet Link</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0A7294] transition-colors" />
                      <input required type="text" placeholder="Pune, India or Google Meet URL" value={formData.event_Location} onChange={e => setFormData({...formData, event_Location: e.target.value})} className={`${inputClass} pl-12`} />
                    </div>
                  </div>
                </div>
              </div>

              <div className={cardClass}>
                <div className="flex items-center gap-3.5 mb-8 border-b border-slate-100/50 pb-5">
                  <div className="w-10 h-10 bg-[#22B3AD]/10 rounded-[12px] flex items-center justify-center"><AlignLeft size={18} className="text-[#22B3AD]" /></div>
                  <h2 className="text-base font-black text-slate-800 uppercase tracking-widest">Copywriting</h2>
                </div>
                <div className="space-y-7">
                  <div>
                    <label className={labelClass}>Short Hook (Subtitle)</label>
                    <input required type="text" placeholder="A compelling one-liner to grab attention..." value={formData.short_Description} onChange={e => setFormData({...formData, short_Description: e.target.value})} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Full Description</label>
                    <textarea required rows="7" placeholder="Detailed agenda, what to expect, prerequisites..." value={formData.detailed_Description} onChange={e => setFormData({...formData, detailed_Description: e.target.value})} className={`${inputClass} resize-none`} />
                  </div>
                </div>
              </div>
            </div>

            {/* ================= RIGHT COLUMN: MEDIA & SPEAKERS ================= */}
            <div className="xl:col-span-5 space-y-8 lg:space-y-10">

              {/* --- MEDIA GALLERY --- */}
              <div className={cardClass}>
                <div className="flex items-center justify-between mb-8 border-b border-slate-100/50 pb-5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 bg-indigo-50 rounded-[12px] flex items-center justify-center"><ImageIcon size={18} className="text-indigo-500" /></div>
                    <h2 className="text-base font-black text-slate-800 uppercase tracking-widest">Gallery</h2>
                  </div>
                  {eventImages.length > 0 && (
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg uppercase tracking-widest">
                      {eventImages.length} Uploaded
                    </span>
                  )}
                </div>
                
                <div className="space-y-4">
                  {eventImages.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      <AnimatePresence>
                        {eventImages.map((file, idx) => (
                          <motion.div 
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                            className="relative aspect-square rounded-[1rem] overflow-hidden group shadow-sm border border-slate-200"
                          >
                            <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                              <button type="button" onClick={() => removeImage(idx)} className="p-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors shadow-lg transform translate-y-2 group-hover:translate-y-0 duration-300">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                        
                        <motion.div layout className="relative aspect-square rounded-[1rem] border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-[#F0F9FF] hover:border-[#BAE6FD] transition-colors flex flex-col items-center justify-center cursor-pointer group">
                          <input type="file" multiple accept="image/*" onChange={handleImageSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                          <Plus size={20} className="text-slate-400 group-hover:text-[#0A7294] transition-colors mb-1" />
                          <span className="text-[10px] font-bold text-slate-500 group-hover:text-[#0A7294]">Add</span>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="relative border-2 border-dashed border-slate-200 rounded-[1.5rem] bg-slate-50 hover:bg-[#F0F9FF] hover:border-[#BAE6FD] transition-colors p-8 flex flex-col items-center justify-center text-center group cursor-pointer min-h-[220px]">
                      <input type="file" multiple accept="image/*" onChange={handleImageSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-[#0A7294] transition-colors mb-4 group-hover:scale-105 duration-300">
                        <UploadCloud size={28} />
                      </div>
                      <p className="text-[15px] font-bold text-slate-700 group-hover:text-[#0A7294] transition-colors">Drag & drop high-res images</p>
                      <p className="text-[12px] font-medium text-slate-400 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* --- SPEAKERS --- */}
              <div className={cardClass}>
                <div className="flex items-center justify-between mb-8 border-b border-slate-100/50 pb-5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 bg-[#FF9A3D]/10 rounded-[12px] flex items-center justify-center"><Users size={18} className="text-[#FF9A3D]" /></div>
                    <h2 className="text-base font-black text-slate-800 uppercase tracking-widest">Speakers</h2>
                  </div>
                  <button type="button" onClick={addSpeakerField} className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#0A7294] bg-[#F0F9FF] hover:bg-[#E0F2FE] px-3.5 py-2 rounded-xl transition-all border border-[#BAE6FD]/50 shadow-sm hover:shadow-md">
                    <Plus size={14} strokeWidth={3}/> Add Mentor
                  </button>
                </div>

                <div className="space-y-5">
                  <AnimatePresence>
                    {speakers.map((speaker, index) => (
                      <motion.div 
                        initial={{ opacity: 0, height: 0, scale: 0.95 }} animate={{ opacity: 1, height: "auto", scale: 1 }} exit={{ opacity: 0, height: 0, scale: 0.95 }}
                        key={index} 
                        className="p-5 bg-slate-50/80 border border-slate-100 rounded-[1.5rem] relative group overflow-hidden shadow-sm"
                      >
                        <button type="button" onClick={() => removeSpeaker(index)} className="absolute right-4 top-4 p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors z-20">
                          <Trash2 size={18}/>
                        </button>

                        <div className="flex items-start gap-4 mb-5 pr-10">
                          <div className="relative w-16 h-16 rounded-[1rem] bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0 overflow-hidden group/avatar cursor-pointer">
                            {speaker.imageFile ? (
                               <img src={URL.createObjectURL(speaker.imageFile)} alt="preview" className="w-full h-full object-cover" />
                            ) : (
                               <Camera size={20} className="text-slate-300" />
                            )}
                            <input type="file" accept="image/*" onChange={e => updateSpeaker(index, 'imageFile', e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity pointer-events-none">
                              <Plus size={20} className="text-white" />
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0 space-y-2 pt-1">
                             <input required type="text" placeholder="Mentor Name" value={speaker.name} onChange={e => updateSpeaker(index, 'name', e.target.value)} className="w-full bg-transparent border-b-2 border-slate-200 focus:border-[#22B3AD] px-1 py-1 text-[16px] font-black text-slate-800 outline-none transition-all placeholder:text-slate-300" />
                             <input type="text" placeholder="Designation (e.g. SDE @ Google)" value={speaker.bio} onChange={e => updateSpeaker(index, 'bio', e.target.value)} className="w-full bg-transparent border-b border-slate-200 focus:border-[#22B3AD] px-1 py-1 text-[12px] font-bold text-slate-500 outline-none transition-all placeholder:text-slate-300" />
                          </div>
                        </div>
                        
                        <input type="text" placeholder="LinkedIn Profile URL" value={speaker.linkedIn_Profile} onChange={e => updateSpeaker(index, 'linkedIn_Profile', e.target.value)} className={`${inputClass} !py-3`} />
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {speakers.length === 0 && (
                    <div className="py-10 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200 text-center flex flex-col items-center">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-300 mb-3"><Users size={24} /></div>
                      <p className="text-[14px] font-bold text-slate-600">No mentors added yet</p>
                      <p className="text-[11px] font-medium text-slate-400 mt-1 max-w-[200px]">Highlight the brilliant minds guiding your event.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        </form>
      </div>

      {/* --- SUCCESS POPUP MODAL --- */}
      <AnimatePresence>
        {showSuccessPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="relative bg-white rounded-[2.5rem] p-10 text-center shadow-2xl max-w-sm w-full flex flex-col items-center">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={40} strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Awesome!</h2>
              <p className="text-slate-500 font-medium mb-6">Your event has been successfully stored in the database.</p>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2 }} className="h-full bg-emerald-500 rounded-full" />
              </div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-4">Redirecting to Manage Events...</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AddEvent;