import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, Clock, ArrowRight, X, 
  Image as ImageIcon, Users, CheckCircle2 
} from 'lucide-react';
import { getPublicEvents } from '../api/userApi';
import AOS from 'aos';
import 'aos/dist/aos.css';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });
    const fetchEvents = async () => {
      try {
        const res = await getPublicEvents();
        const rawEvents = res.data?.events || res.data?.data || (Array.isArray(res.data) ? res.data : []);
        setEvents(rawEvents.sort((a, b) => new Date(b.date) - new Date(a.date)));
      } catch (error) { 
        console.error("Error:", error); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedEvent ? 'hidden' : 'unset';
  }, [selectedEvent]);

  return (
    // FIX: Removed 'z-0' from this root div so it doesn't trap the popup
    <div className="min-h-screen bg-[#FDFDFD] font-sans pb-24 relative selection:bg-[#0A7294] selection:text-white">
      
      {/* --- MATCHING THEME BACKGROUND --- */}
      {/* FIX: Changed z-[-1] to z-0 so they render naturally on top of the white background */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[#F0F9FF]/60 to-transparent pointer-events-none z-0" />

      {/* --- HERO SECTION --- */}
      {/* Content sits safely at z-10, above the background grid */}
      <section className="relative pt-32 pb-16 px-6 text-center z-10">
        <div data-aos="zoom-in" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0A7294] opacity-50"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0A7294]"></span>
          </span>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Live & Upcoming</span>
        </div>
        <h1 data-aos="fade-up" className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight mb-4">
          Discover Events
        </h1>
        <p data-aos="fade-up" data-aos-delay="100" className="text-slate-500 max-w-lg mx-auto text-sm font-medium leading-relaxed">
          Curated masterclasses, workshops, and networking events designed for professional growth.
        </p>
      </section>

      {/* --- PREMIUM LOW-PROFILE CARDS (2 per row) --- */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[280px] w-full bg-slate-100/50 rounded-3xl animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event, i) => (
              <motion.div 
                key={event._id} 
                data-aos="fade-up" 
                data-aos-delay={i * 50}
                className="group flex flex-col bg-white rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-[#0A7294]/5 hover:border-[#BAE6FD] transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => setSelectedEvent(event)}
              >
                {/* Image Section - Very little height (h-40) */}
                <div className="w-full h-40 relative overflow-hidden bg-slate-100 shrink-0">
                  <img 
                    src={event.image_Urls?.[0] || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop"} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    alt={event.title} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-60" />
                  
                  {/* Floating Date */}
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-md text-[9px] font-black uppercase tracking-widest text-[#0A7294] shadow-sm">
                      {new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Content Section - Compact and clean */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-black text-slate-800 leading-tight mb-2 group-hover:text-[#0A7294] transition-colors line-clamp-1">
                    {event.title}
                  </h3>
                  
                  <p className="text-[13px] font-medium text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {event.short_Description || event.detailed_Description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-slate-400 text-[11px] font-bold tracking-wider uppercase">
                       <span className="flex items-center gap-1"><MapPin size={12} className="text-[#22B3AD]"/> <span className="truncate max-w-[100px]">{event.event_Location}</span></span>
                    </div>
                    
                    <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#0A7294] group-hover:translate-x-1 transition-transform">
                      Explore <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* --- PROFESSIONAL READ-ONLY MODAL --- */}
      <AnimatePresence>
        {selectedEvent && (
          // FIX: z-[9999] now successfully places the modal above the navbar because the parent container is no longer trapping it.
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setSelectedEvent(null)} 
              className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" 
            />
            
            <motion.div 
              initial={{ y: 20, opacity: 0, scale: 0.98 }} 
              animate={{ y: 0, opacity: 1, scale: 1 }} 
              exit={{ y: 20, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden h-[90vh] sm:h-[80vh] flex flex-col md:flex-row z-10 border border-slate-100"
            >
              {/* Floating Close Button */}
              <button 
                onClick={() => setSelectedEvent(null)} 
                className="absolute top-4 right-4 md:top-5 md:right-5 z-50 w-10 h-10 bg-white/50 hover:bg-white backdrop-blur-md border border-slate-200/50 text-slate-800 rounded-full flex items-center justify-center transition-all shadow-sm"
              >
                <X size={18} strokeWidth={2.5}/>
              </button>

              {/* Left Side: Editorial Image Cover */}
              <div className="w-full md:w-2/5 h-64 md:h-full relative shrink-0 bg-slate-900">
                <img src={selectedEvent.image_Urls?.[0] || "https://via.placeholder.com/800"} className="absolute inset-0 w-full h-full object-cover opacity-80" alt="Cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6">
                   <div className="flex items-center gap-2 mb-3">
                     <span className="px-2.5 py-1 rounded bg-white/20 backdrop-blur-md border border-white/30 text-[9px] font-black text-white uppercase tracking-widest shadow-sm">
                       {new Date(selectedEvent.date) < new Date() ? 'Past Event' : 'Upcoming Event'}
                     </span>
                   </div>
                   <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2">{selectedEvent.title}</h2>
                </div>
              </div>

              {/* Right Side: Elegant Scrollable Details (No Buttons) */}
              <div className="w-full md:w-3/5 flex flex-col h-full bg-white relative">
                <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                  
                  {/* Clean Minimalist Stats */}
                  <div className="flex flex-wrap gap-x-8 gap-y-4 mb-10 pb-6 border-b border-slate-100">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Calendar size={12}/> Date</p>
                      <p className="text-[13px] font-bold text-slate-800">{new Date(selectedEvent.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Clock size={12}/> Time</p>
                      <p className="text-[13px] font-bold text-slate-800">{selectedEvent.time || 'TBD'}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><MapPin size={12}/> Location</p>
                      <p className="text-[13px] font-bold text-slate-800">{selectedEvent.event_Location}</p>
                    </div>
                  </div>

                  {/* Editorial Description */}
                  <div className="mb-10">
                     <p className="text-slate-700 text-[14px] font-medium leading-relaxed whitespace-pre-wrap">
                       {selectedEvent.detailed_Description}
                     </p>
                  </div>

                  {/* Elegant Speaker Cards */}
                  {selectedEvent.speakers?.length > 0 && (
                    <div className="mb-10">
                      <h4 className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-4">Featuring</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedEvent.speakers.map((s, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                            <img src={s.speaker_Image_Url || "https://via.placeholder.com/150"} className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm" alt={s.name} />
                            <div>
                              <p className="text-[13px] font-black text-slate-800 leading-none mb-1">{s.name}</p>
                              <p className="text-[10px] font-bold text-[#0A7294] uppercase tracking-wider">{s.bio || 'Guest Speaker'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Secondary Gallery */}
                  {selectedEvent.image_Urls?.length > 1 && (
                    <div className="pb-6">
                      <h4 className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-4">Event Gallery</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedEvent.image_Urls.slice(1, 5).map((imgUrl, idx) => (
                          <div key={idx} className="aspect-video rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                            <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventsPage;