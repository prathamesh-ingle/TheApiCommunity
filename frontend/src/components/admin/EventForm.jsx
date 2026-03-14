import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, Clock, MapPin, ImageIcon, Users, Plus, 
  Trash2, UploadCloud, Camera, LayoutTemplate, AlignLeft 
} from "lucide-react";

const EventForm = ({ initialData, onSubmit, isSubmitting, buttonText = "Save Changes" }) => {
  const [formData, setFormData] = useState({
    title: "", short_Description: "", detailed_Description: "", 
    date: "", time: "", event_Location: "", ...initialData
  });
  
  const [eventImages, setEventImages] = useState([]); 
  const [speakers, setSpeakers] = useState(initialData?.speakers || []);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
      setSpeakers(initialData.speakers || []);
    }
  }, [initialData]);

  // --- Image Handlers ---
  const handleImageSelect = (e) => {
    if (e.target.files) {
      setEventImages((prev) => [...prev, ...Array.from(e.target.files)]);
    }
  };
  const removeImage = (idxToRemove) => {
    setEventImages(prev => prev.filter((_, idx) => idx !== idxToRemove));
  };

  // --- Speaker Handlers ---
  const addSpeaker = () => setSpeakers([...speakers, { name: "", bio: "", linkedIn_Profile: "", imageFile: null }]);
  const updateSpeaker = (idx, field, val) => {
    const updated = [...speakers];
    updated[idx][field] = val;
    setSpeakers(updated);
  };
  const removeSpeaker = (idx) => setSpeakers(speakers.filter((_, i) => i !== idx));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ formData, eventImages, speakers });
  };

  // Shared Styles
  const inputClass = "w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0A7294] focus:ring-4 focus:ring-[#0A7294]/10 rounded-xl px-4 py-3 text-[14px] font-medium text-slate-800 outline-none transition-all shadow-sm";
  const labelClass = "text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block ml-1";
  const cardClass = "bg-white p-5 sm:p-7 rounded-3xl border border-slate-100 shadow-sm";
  const sectionHeaderClass = "flex items-center gap-2 text-xs font-black text-slate-800 uppercase mb-5 border-b border-slate-50 pb-3";

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 pb-4">
      
      {/* ================= LEFT COLUMN (Core Details) ================= */}
      <div className="xl:col-span-7 space-y-6">
        
        <div className={cardClass}>
          <h3 className={sectionHeaderClass}><LayoutTemplate size={16} className="text-[#0A7294]"/> Core Information</h3>
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Event Title</label>
              <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputClass} placeholder="e.g. Annual Tech Summit 2026" />
            </div>
            {/* Stacks on mobile, side-by-side on sm screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Date</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input required type="date" value={formData.date?.split('T')[0]} onChange={e => setFormData({...formData, date: e.target.value})} className={`${inputClass} pl-11`} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Time</label>
                <div className="relative">
                  <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input required type="text" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className={`${inputClass} pl-11`} placeholder="10:00 AM - 02:00 PM" />
                </div>
              </div>
            </div>
            <div>
              <label className={labelClass}>Venue / Map Link</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input required type="text" value={formData.event_Location} onChange={e => setFormData({...formData, event_Location: e.target.value})} className={`${inputClass} pl-11`} placeholder="City, State or Zoom Link" />
              </div>
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <h3 className={sectionHeaderClass}><AlignLeft size={16} className="text-[#22B3AD]"/> Event Descriptions</h3>
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Short Hook (Subtitle)</label>
              <input required type="text" value={formData.short_Description} onChange={e => setFormData({...formData, short_Description: e.target.value})} className={inputClass} placeholder="A one-sentence summary..." />
            </div>
            <div>
              <label className={labelClass}>Detailed Agenda</label>
              <textarea required rows="5" value={formData.detailed_Description} onChange={e => setFormData({...formData, detailed_Description: e.target.value})} className={`${inputClass} resize-none`} placeholder="Full event details and expectations..." />
            </div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT COLUMN (Media & People) ================= */}
      <div className="xl:col-span-5 space-y-6 flex flex-col">
        
        {/* Gallery Upload Section */}
        <div className={cardClass}>
          <h3 className={sectionHeaderClass}><ImageIcon size={16} className="text-indigo-500"/> Event Gallery</h3>
          
          {/* Image Previews */}
          {eventImages.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mb-4">
              <AnimatePresence>
                {eventImages.map((file, idx) => (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-200">
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute inset-0 bg-rose-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"><Trash2 className="text-white" size={16}/></button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Upload Dropzone */}
          <div className="relative border-2 border-dashed border-slate-200 hover:border-[#0A7294] hover:bg-[#F0F9FF] bg-slate-50 rounded-2xl p-6 flex flex-col items-center justify-center transition-all cursor-pointer group">
            <input type="file" multiple accept="image/*" onChange={handleImageSelect} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <UploadCloud size={20} className="text-slate-400 group-hover:text-[#0A7294]"/>
            </div>
            <span className="text-xs font-bold text-slate-600">Click or Drop Images Here</span>
          </div>
        </div>

        {/* Speakers Section */}
        <div className={`${cardClass} flex-1`}>
          <div className="flex justify-between items-center mb-5 border-b border-slate-50 pb-3">
            <h3 className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase"><Users size={16} className="text-[#FF9A3D]"/> Speaker Lineup</h3>
            <button type="button" onClick={addSpeaker} className="flex items-center gap-1 text-[10px] font-bold text-[#0A7294] bg-[#F0F9FF] px-2.5 py-1.5 rounded-lg border border-[#0A7294]/20 hover:bg-[#E0F2FE] transition-colors"><Plus size={12}/> ADD</button>
          </div>
          
          <div className="space-y-3">
            {speakers.map((s, idx) => (
              <div key={idx} className="p-3 sm:p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3 sm:gap-4 relative group">
                <button type="button" onClick={() => removeSpeaker(idx)} className="absolute right-2 top-2 p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors z-20"><Trash2 size={14}/></button>
                
                {/* Speaker Photo Upload */}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-sm self-start">
                  {(s.imageFile || s.speaker_Image_Url) ? (
                    <img src={s.imageFile ? URL.createObjectURL(s.imageFile) : s.speaker_Image_Url} className="w-full h-full object-cover" alt="speaker" />
                  ) : (
                    <Camera size={18} className="text-slate-300" />
                  )}
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => updateSpeaker(idx, 'imageFile', e.target.files[0])} />
                </div>
                
                {/* Speaker Details */}
                <div className="flex-1 space-y-2 pr-6 sm:pr-8">
                  <input required placeholder="Speaker Name" className="w-full bg-transparent border-b border-slate-200 focus:border-[#0A7294] pb-1 text-sm font-bold outline-none text-slate-800 transition-colors" value={s.name} onChange={e => updateSpeaker(idx, 'name', e.target.value)} />
                  <input placeholder="Role / Bio" className="w-full bg-transparent border-b border-slate-200 focus:border-[#0A7294] pb-1 text-[12px] font-medium outline-none text-slate-600 transition-colors" value={s.bio} onChange={e => updateSpeaker(idx, 'bio', e.target.value)} />
                  <input placeholder="LinkedIn URL" className="w-full bg-transparent border-b border-slate-200 focus:border-[#0A7294] pb-1 text-[11px] outline-none text-[#0A7294] transition-colors" value={s.linkedIn_Profile} onChange={e => updateSpeaker(idx, 'linkedIn_Profile', e.target.value)} />
                </div>
              </div>
            ))}
            {speakers.length === 0 && (
              <div className="text-center py-6 text-slate-400 text-xs font-medium border-2 border-dashed border-slate-100 rounded-2xl">No speakers added yet.</div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-[#0A7294] to-[#22B3AD] hover:shadow-lg hover:shadow-[#0A7294]/30 text-white py-4 sm:py-5 rounded-2xl font-black uppercase tracking-widest text-[12px] transition-all disabled:opacity-50 active:scale-95 mt-4 xl:mt-auto">
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Processing...</span>
          ) : buttonText}
        </button>
      </div>
    </form>
  );
};

export default EventForm;