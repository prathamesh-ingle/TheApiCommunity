import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Calendar, Clock, MapPin, 
  ImageIcon, Users, Plus, Trash2, UploadCloud, 
  Camera, LayoutTemplate, AlignLeft
} from "lucide-react";
import toast from "react-hot-toast";
import { createEvent } from "../../api/adminApi"; 

const AddEvent = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    const tId = toast.loading("Deploying event...");

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      
      if (eventImages.length > 0) {
        eventImages.forEach(file => data.append("eventImages", file));
      }

      const speakerJson = speakers.map(s => ({ name: s.name, linkedIn_Profile: s.linkedIn_Profile, bio: s.bio, speaker_Image_Url: null }));
      data.append("speakers", JSON.stringify(speakerJson));

      let missingImages = false;
      speakers.forEach((s) => {
        if (s.imageFile) data.append("speakerImages", s.imageFile);
        else missingImages = true;
      });

      if (speakers.length > 0 && missingImages) {
        toast.error("Profile images required for all speakers.", { id: tId });
        setIsSubmitting(false); return;
      }

      await createEvent(data);
      toast.success("Event successfully published!", { id: tId });
      setTimeout(() => navigate("/admin"), 1000);

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to deploy event.", { id: tId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ultra-Soft Input Styles
  const inputClass = "w-full bg-[#F8FAFC] border border-slate-100 hover:bg-white focus:bg-white focus:border-[#22B3AD] rounded-[14px] px-4 py-3 text-[13px] font-medium text-slate-800 focus:ring-4 focus:ring-[#22B3AD]/10 outline-none transition-all placeholder:text-slate-400 shadow-sm";
  const labelClass = "text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-2 block ml-1";
  const cardClass = "bg-white/90 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-100";

  return (
    <div className="w-full min-h-screen bg-slate-50/50 font-sans pb-24 px-4 sm:px-6 lg:px-8 pt-6 selection:bg-[#0A7294]/20">
      
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#22B3AD]/10 via-[#0A7294]/5 to-transparent blur-[100px] pointer-events-none rounded-full -z-10"></div>

      <div className="max-w-[1600px] mx-auto">
        <form onSubmit={handleFormSubmit}>
          
          {/* --- STICKY APP-LIKE HEADER --- */}
          <div className="sticky top-4 z-50 flex items-center justify-between bg-white/80 backdrop-blur-xl p-3 sm:px-5 sm:py-3 rounded-[1.5rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-8">
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200 shadow-sm">
                <ArrowLeft size={18} />
              </button>
              <div className="flex flex-col">
                <span className="text-base font-black text-slate-800 leading-none">Create New Event</span>
                <span className="text-[10px] font-bold text-[#0A7294] uppercase tracking-widest mt-1">Publish to Community</span>
              </div>
            </div>
            
            <button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-[#0A7294] to-[#22B3AD] hover:shadow-lg hover:shadow-[#0A7294]/20 text-white px-8 py-3 rounded-xl font-bold text-[12px] uppercase tracking-widest transition-all disabled:opacity-50 flex items-center gap-2 active:scale-95">
              {isSubmitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : "Publish Event"}
            </button>
          </div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">

            {/* ================= LEFT COLUMN ================= */}
            <div className="xl:col-span-7 space-y-6 lg:space-y-8">
              
              <div className={cardClass}>
                <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                  <div className="p-2 bg-[#0A7294]/10 rounded-xl"><LayoutTemplate size={18} className="text-[#0A7294]" /></div>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Event Details</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className={labelClass}>Event Title</label>
                    <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputClass} placeholder="e.g. Masterclass: System Design 101" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Date</label>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className={`${inputClass} pl-11 text-slate-600`} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Time</label>
                      <div className="relative">
                        <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input required type="text" placeholder="10:00 AM - 02:00 PM" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className={`${inputClass} pl-11`} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Location / Link</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input required type="text" placeholder="Pune, India or Google Meet URL" value={formData.event_Location} onChange={e => setFormData({...formData, event_Location: e.target.value})} className={`${inputClass} pl-11`} />
                    </div>
                  </div>
                </div>
              </div>

              <div className={cardClass}>
                <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                  <div className="p-2 bg-[#22B3AD]/10 rounded-xl"><AlignLeft size={18} className="text-[#22B3AD]" /></div>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Description</h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className={labelClass}>Short Hook (Subtitle)</label>
                    <input required type="text" placeholder="A one-sentence summary to grab attention..." value={formData.short_Description} onChange={e => setFormData({...formData, short_Description: e.target.value})} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Full Description</label>
                    <textarea required rows="6" placeholder="Agenda, prerequisites, and what to expect..." value={formData.detailed_Description} onChange={e => setFormData({...formData, detailed_Description: e.target.value})} className={`${inputClass} resize-none`} />
                  </div>
                </div>
              </div>
            </div>

            {/* ================= RIGHT COLUMN ================= */}
            <div className="xl:col-span-5 space-y-6 lg:space-y-8">

              {/* --- SECTION 3: BEAUTIFUL MULTI-IMAGE UPLOAD --- */}
              <div className={cardClass}>
                <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-xl"><ImageIcon size={18} className="text-indigo-500" /></div>
                    <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Event Gallery</h2>
                  </div>
                  {eventImages.length > 0 && (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-lg">
                      {eventImages.length} Images Added
                    </span>
                  )}
                </div>
                
                {/* Image Previews Grid */}
                <div className="space-y-4">
                  {eventImages.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      <AnimatePresence>
                        {eventImages.map((file, idx) => (
                          <motion.div 
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                            className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm border border-slate-200"
                          >
                            <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            {/* Hover Overlay with Delete Icon */}
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                              <button type="button" onClick={() => removeImage(idx)} className="p-2 bg-rose-500 text-white rounded-[10px] hover:bg-rose-600 transition-colors shadow-lg transform translate-y-2 group-hover:translate-y-0 duration-300">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                        
                        {/* Tiny "Add More" Box */}
                        <motion.div layout className="relative aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-[#F0F9FF] hover:border-[#BAE6FD] transition-colors flex flex-col items-center justify-center cursor-pointer group">
                          <input type="file" multiple accept="image/*" onChange={handleImageSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                          <Plus size={20} className="text-slate-400 group-hover:text-[#0A7294] transition-colors mb-1" />
                          <span className="text-[9px] font-bold text-slate-500 group-hover:text-[#0A7294]">Add More</span>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  ) : (
                    // Default Empty State
                    <div className="relative border-2 border-dashed border-slate-200 rounded-[1.5rem] bg-slate-50 hover:bg-slate-100 transition-colors p-8 flex flex-col items-center justify-center text-center group cursor-pointer min-h-[180px]">
                      <input type="file" multiple accept="image/*" onChange={handleImageSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-[#0A7294] transition-colors mb-4 group-hover:scale-105 duration-300">
                        <UploadCloud size={24} />
                      </div>
                      <p className="text-[14px] font-bold text-slate-700">Drag & drop files here</p>
                      <p className="text-[11px] font-medium text-slate-400 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* --- SECTION 4: SPEAKERS --- */}
              <div className={cardClass}>
                <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#FF9A3D]/10 rounded-xl"><Users size={18} className="text-[#FF9A3D]" /></div>
                    <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Speakers</h2>
                  </div>
                  <button type="button" onClick={addSpeakerField} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#0A7294] bg-[#F0F9FF] hover:bg-[#E0F2FE] px-3 py-1.5 rounded-lg transition-colors border border-[#BAE6FD]/50 shadow-sm">
                    <Plus size={14} strokeWidth={3}/> Add
                  </button>
                </div>

                <div className="space-y-4">
                  <AnimatePresence>
                    {speakers.map((speaker, index) => (
                      <motion.div 
                        initial={{ opacity: 0, height: 0, scale: 0.95 }} animate={{ opacity: 1, height: "auto", scale: 1 }} exit={{ opacity: 0, height: 0, scale: 0.95 }}
                        key={index} 
                        className="p-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] relative group overflow-hidden"
                      >
                        <button type="button" onClick={() => removeSpeaker(index)} className="absolute right-3 top-3 p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors z-20">
                          <Trash2 size={16}/>
                        </button>

                        <div className="flex items-center gap-4 mb-4 pr-8">
                          <div className="relative w-14 h-14 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0 overflow-hidden group/avatar">
                            {speaker.imageFile ? (
                               <img src={URL.createObjectURL(speaker.imageFile)} alt="preview" className="w-full h-full object-cover" />
                            ) : (
                               <Camera size={18} className="text-slate-300" />
                            )}
                            <input type="file" accept="image/*" onChange={e => updateSpeaker(index, 'imageFile', e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity pointer-events-none">
                              <Plus size={16} className="text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                             <input required type="text" placeholder="Speaker Name" value={speaker.name} onChange={e => updateSpeaker(index, 'name', e.target.value)} className="w-full bg-transparent border-b border-transparent focus:border-[#22B3AD] px-1 py-1 text-[14px] font-bold text-slate-800 outline-none transition-all placeholder:text-slate-400" />
                             <input type="text" placeholder="Role (e.g. CEO @ Tech)" value={speaker.bio} onChange={e => updateSpeaker(index, 'bio', e.target.value)} className="w-full bg-transparent border-b border-transparent focus:border-[#22B3AD] px-1 py-1 text-[11px] font-medium text-slate-500 outline-none transition-all placeholder:text-slate-300 mt-1" />
                          </div>
                        </div>
                        <input type="text" placeholder="LinkedIn Profile URL" value={speaker.linkedIn_Profile} onChange={e => updateSpeaker(index, 'linkedIn_Profile', e.target.value)} className={inputClass} />
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {speakers.length === 0 && (
                    <div className="py-8 bg-slate-50 rounded-[1.5rem] border border-dashed border-slate-200 text-center flex flex-col items-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-300 mb-2"><Users size={20} /></div>
                      <p className="text-[13px] font-bold text-slate-600">No speakers added</p>
                      <p className="text-[10px] font-medium text-slate-400 mt-1">Click the add button above</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;