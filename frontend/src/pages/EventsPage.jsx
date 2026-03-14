import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowRight, X, Share2, Image as ImageIcon } from 'lucide-react';
import { getPublicEvents } from '../api/userApi';
import AOS from 'aos';
import 'aos/dist/aos.css';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({ duration: 800, once: true, easing: 'ease-out-quartic' });
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
    <div className="min-h-screen bg-[#FDFDFE] font-sans pb-24 relative selection:bg-[#0A7294] selection:text-white">
      {/* Dynamic Subtle Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* --- HERO --- */}
      <section className="relative pt-32 pb-16 px-6 text-center z-10">
        <div data-aos="zoom-in" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0A7294] opacity-50"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0A7294]"></span>
          </span>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Live & Upcoming</span>
        </div>
        <h1 data-aos="fade-up" className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight mb-4">
          Discover Premium Experiences
        </h1>
        <p data-aos="fade-up" data-aos-delay="100" className="text-slate-500 max-w-lg mx-auto text-sm font-medium leading-relaxed">
          Curated masterclasses, workshops, and networking events designed for professional growth.
        </p>
      </section>

      {/* --- HORIZONTAL EVENT CARDS --- */}
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="flex flex-col gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-48 w-full bg-white rounded-3xl animate-pulse border border-slate-100 shadow-sm" />
            ))
          ) : (
            events.map((event, i) => (
              <motion.div 
                key={event._id} data-aos="fade-up" data-aos-delay={i * 50}
                className="group bg-white flex flex-col md:flex-row rounded-3xl border border-slate-100 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_-10px_rgba(10,114,148,0.08)] transition-all duration-500 overflow-hidden"
              >
                {/* Card Image */}
                <div className="w-full md:w-72 h-56 md:h-auto relative shrink-0 overflow-hidden bg-slate-50">
                  <img 
                    src={event.image_Urls?.[0]} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    alt={event.title} 
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-semibold tracking-wide text-slate-700 shadow-sm border border-white/20">
                      Upcoming
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 md:p-8 flex flex-col flex-1 justify-center">
                  <div className="flex flex-wrap items-center gap-4 text-slate-400 mb-3 text-xs font-medium tracking-wide">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-[#0A7294]"/> 
                      {new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-[#0A7294]"/> 
                      {event.event_Location}
                    </div>
                    {event.time && (
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-[#0A7294]"/> 
                        {event.time}
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-semibold text-slate-800 leading-snug mb-2 group-hover:text-[#0A7294] transition-colors">
                    {event.title}
                  </h3>
                  
                  <p className="text-sm text-slate-500 line-clamp-2 mb-6 leading-relaxed">
                    {event.detailed_Description}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                    {/* Speakers Preview */}
                    <div className="flex items-center gap-3">
                      {event.speakers?.length > 0 ? (
                        <div className="flex -space-x-2">
                          {event.speakers.slice(0, 3).map((s, idx) => (
                            <img key={idx} src={s.speaker_Image_Url} alt={s.name} className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm" />
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">General Event</span>
                      )}
                      {event.speakers?.length > 0 && <span className="text-xs text-slate-400 font-medium">Guest Speakers</span>}
                    </div>
                    
                    {/* Action Button */}
                    <button 
                      onClick={() => setSelectedEvent(event)} 
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-50 hover:bg-[#0A7294] text-slate-600 hover:text-white text-xs font-semibold tracking-wide transition-all duration-300"
                    >
                      View Details <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* --- PROFESSIONAL POPUP MODAL --- */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedEvent(null)} 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            />
            
            <motion.div 
              initial={{ y: 20, opacity: 0, scale: 0.95 }} 
              animate={{ y: 0, opacity: 1, scale: 1 }} 
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-10"
            >
              <button 
                onClick={() => setSelectedEvent(null)} 
                className="absolute top-5 right-5 z-50 w-10 h-10 bg-white/80 hover:bg-slate-100 backdrop-blur-md text-slate-600 rounded-full flex items-center justify-center transition-all shadow-sm"
              >
                <X size={20}/>
              </button>

              {/* Cover Header */}
              <div className="w-full h-56 relative bg-slate-900 shrink-0">
                <img src={selectedEvent.image_Urls?.[0]} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
                <div className="absolute bottom-6 left-8 right-8 flex items-end justify-between">
                   <div>
                     <span className="inline-block px-3 py-1 mb-3 rounded-full bg-[#0A7294]/20 backdrop-blur-md border border-[#0A7294]/30 text-[10px] font-semibold text-white tracking-widest uppercase">
                       Verified Event
                     </span>
                     <h2 className="text-3xl font-bold text-white leading-tight">{selectedEvent.title}</h2>
                   </div>
                   <button className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-colors shrink-0">
                     <Share2 size={16}/>
                   </button>
                </div>
              </div>

              {/* Modal Content Scroll Area */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/50">
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 pb-8 border-b border-slate-100">
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Date</p>
                    <p className="text-sm font-semibold text-slate-800">{new Date(selectedEvent.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Time</p>
                    <p className="text-sm font-semibold text-slate-800">{selectedEvent.time || '10:00 AM'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Location</p>
                    <p className="text-sm font-semibold text-slate-800">{selectedEvent.event_Location}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Registration</p>
                    <p className="text-sm font-semibold text-[#0A7294]">Open Now</p>
                  </div>
                </div>

                {/* About Section */}
                <div className="mb-10">
                   <h4 className="text-slate-800 font-semibold text-xs uppercase tracking-wider mb-3">About The Event</h4>
                   <p className="text-slate-500 text-sm font-medium leading-relaxed whitespace-pre-wrap">
                     {selectedEvent.detailed_Description}
                   </p>
                </div>

                {/* Image Gallery (All Uploaded Photos) */}
                {selectedEvent.image_Urls?.length > 1 && (
                  <div className="mb-10">
                    <h4 className="text-slate-800 font-semibold text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                      <ImageIcon size={14} className="text-slate-400" /> Event Gallery
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedEvent.image_Urls.slice(1).map((imgUrl, idx) => (
                        <div key={idx} className="aspect-video rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                          <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Speakers Section */}
                {selectedEvent.speakers?.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-slate-800 font-semibold text-xs uppercase tracking-wider mb-4">Speakers & Leads</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedEvent.speakers.map((s, idx) => (
                        <div key={idx} className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                          <img src={s.speaker_Image_Url} className="w-12 h-12 rounded-full object-cover border border-slate-50" alt={s.name} />
                          <div>
                            <p className="text-sm font-semibold text-slate-800 leading-none mb-1">{s.name}</p>
                            <p className="text-[11px] font-medium text-slate-500">{s.bio || 'Guest Speaker'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Fixed Footer Action */}
              <div className="p-5 border-t border-slate-100 bg-white shrink-0">
                <button className="w-full bg-[#0A7294] text-white text-sm font-semibold py-4 rounded-2xl hover:bg-[#085a75] hover:shadow-lg hover:shadow-[#0A7294]/20 transition-all flex items-center justify-center gap-2">
                  Confirm Attendance <ArrowRight size={16} />
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventsPage;