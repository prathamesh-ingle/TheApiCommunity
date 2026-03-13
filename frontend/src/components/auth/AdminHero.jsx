import React from "react";
import { ShieldCheck, Sparkles, CalendarDays } from "lucide-react";

const AdminHero = () => (
  <section className="hidden md:flex flex-col justify-between p-10 rounded-3xl bg-slate-900 text-white relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/30 rounded-full blur-[100px] group-hover:bg-indigo-500/40 transition-all duration-700" />
    <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/20 rounded-full blur-[100px]" />

    <div className="relative z-10">
      <div className="inline-flex items-center gap-3 bg-white/10 border border-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-12">
        <ShieldCheck className="w-5 h-5 text-indigo-300" />
        <span className="text-sm font-semibold text-indigo-100 tracking-wide">Admin Command Center</span>
      </div>

      <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
        Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">events</span> with absolute precision.
      </h1>
      <p className="text-slate-400 text-lg max-w-md leading-relaxed">
        Access real-time analytics, manage speaker line-ups, and oversee campus activities from one secure dashboard.
      </p>
    </div>

    <div className="grid grid-cols-2 gap-4 relative z-10 mt-12">
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-sm hover:bg-white/10 transition-colors">
        <Sparkles className="w-6 h-6 text-indigo-400 mb-3" />
        <div className="text-3xl font-bold">System</div>
        <div className="text-sm text-slate-400 mt-1">Status: Operational</div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-indigo-600/40 to-violet-600/40 border border-indigo-500/30 p-5 backdrop-blur-sm">
        <CalendarDays className="w-6 h-6 text-indigo-200 mb-3" />
        <div className="text-3xl font-bold">Secured</div>
        <div className="text-sm text-indigo-200 mt-1">256-bit Encryption</div>
      </div>
    </div>
  </section>
);

export default AdminHero;