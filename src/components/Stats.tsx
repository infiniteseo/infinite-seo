import React from "react";
import { STATS_DATA } from "../data";
import { GraduationCap, Users, Monitor, Star } from "lucide-react";

export default function Stats() {
  const getIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <GraduationCap className="h-6 w-6 text-amber-400" />;
      case 1:
        return <Users className="h-6 w-6 text-blue-400" />;
      case 2:
        return <Monitor className="h-6 w-6 text-emerald-400" />;
      case 3:
        return <Star className="h-6 w-6 text-[#F59E0B] fill-amber-500" />;
      default:
        return <GraduationCap className="h-6 w-6 text-amber-400" />;
    }
  };

  return (
    <section className="relative py-16 bg-[#0F172A] text-white overflow-hidden">
      {/* Absolute graphic filters */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner with tagline */}
        <p className="text-center text-xs font-bold text-[#F59E0B] tracking-widest uppercase mb-10">
          Our Impact Globally — Infinite SEO Performance
        </p>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS_DATA.map((stat, idx) => (
            <div 
              key={stat.label}
              className="bg-slate-900/60 p-6 sm:p-8 rounded-2xl border border-slate-800 backdrop-blur hover:border-slate-700 transition-all duration-300 flex flex-col items-center text-center group"
            >
              <div className="p-3 bg-slate-800 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                {getIcon(idx)}
              </div>
              
              <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {stat.value}
              </span>
              
              <h4 className="text-sm font-bold text-[#F59E0B] uppercase tracking-wide mt-2">
                {stat.label}
              </h4>
              
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
