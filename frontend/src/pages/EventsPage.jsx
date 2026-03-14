// frontend/src/pages/EventsPage.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, ArrowRight } from 'lucide-react';
import { getPublicEvents } from '../api/userApi'; // Using the API call from Step 1!

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchEvents = async () => {
      try {
        const res = await getPublicEvents();
        // Sort: Newest first
        const sorted = (res.data.events || []).sort((a, b) => new Date(b.date) - new Date(a.date));
        setEvents(sorted);
      } catch (error) {
        console.error("Failed to fetch public events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans pb-24">
      {/* Soft Header */}
      <div className="relative pt-32 pb-20 px-6 text-center bg-white overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F0F9FF] border border-[#BAE6FD]/50 mb-6">
            <Calendar className="w-3.5 h-3.5 text-[#0A7294]" />
            <span className="text-[10px] font-black text-[#0A7294] tracking-[0.2em] uppercase mt-[1px]">Community Hub</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A7294] to-[#22B3AD]">Events.</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Join our hackathons, masterclasses, and networking sessions designed to elevate your developer journey.
          </p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[1, 2, 3].map(n => <div key={n} className="h-[400px] bg-white rounded-[2rem] animate-pulse shadow-sm" />)}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-slate-400 font-bold text-lg">No public events listed yet. Check back soon!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, i) => {
              const eventDate = new Date(event.date);
              const isPast = eventDate < new Date(new Date().setHours(0,0,0,0));

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  key={event._id} 
                  className="bg-white rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(10,114,148,0.08)] transition-all duration-300 overflow-hidden flex flex-col group border border-slate-100"
                >
                  {/* Cover Image */}
                  <div className="h-56 w-full relative bg-slate-100 overflow-hidden shrink-0">
                    <div className="absolute top-4 left-4 z-20">
                      <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg shadow-sm uppercase tracking-widest ${isPast ? 'bg-white text-slate-500' : 'bg-gradient-to-r from-[#0A7294] to-[#22B3AD] text-white'}`}>
                        {isPast ? 'Past Event' : 'Upcoming'}
                      </span>
                    </div>
                    {event.image_Urls && event.image_Urls.length > 0 ? (
                      <img src={event.image_Urls[0]} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={40}/></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                  </div>

                  {/* Body */}
                  <div className="p-6 sm:p-8 flex flex-col flex-1">
                    <h3 className="text-xl font-black text-slate-900 mb-2 line-clamp-2 group-hover:text-[#0A7294] transition-colors">{event.title}</h3>
                    <p className="text-sm text-slate-500 font-medium mb-6 line-clamp-2">{event.short_Description}</p>

                    <div className="space-y-3 mb-6 mt-auto">
                      <div className="flex items-center gap-3 text-[13px] text-slate-700 font-bold">
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center"><Calendar size={14} className="text-[#22B3AD]" /></div>
                        {eventDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} • {event.time}
                      </div>
                      <div className="flex items-center gap-3 text-[13px] text-slate-700 font-bold">
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center"><MapPin size={14} className="text-[#22B3AD]" /></div>
                        <span className="truncate pr-4">{event.event_Location}</span>
                      </div>
                    </div>

                    <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {event.speakers?.slice(0,3).map((s, idx) => (
                             <img key={idx} src={s.speaker_Image_Url} alt={s.name} className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                          ))}
                        </div>
                        {event.speakers?.length > 0 && <span className="text-[11px] font-bold text-slate-400 ml-1">Speakers</span>}
                      </div>
                      <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#0A7294] group-hover:text-white transition-colors">
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;