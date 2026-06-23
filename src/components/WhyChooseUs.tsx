import React from "react";
import { WHY_CHOOSE_US_DATA } from "../data";
import { 
  Sparkles, 
  Lightbulb, 
  Clock, 
  Award, 
  ShieldCheck, 
  Compass, 
  BookOpen, 
  MessageSquare, 
  Tv 
} from "lucide-react";

export default function WhyChooseUs() {
  const getIcon = (id: string) => {
    switch (id) {
      case "why-1":
        return <Lightbulb className="h-5 w-5 text-amber-500" />;
      case "why-2":
        return <Award className="h-5 w-5 text-blue-500" />;
      case "why-3":
        return <ShieldCheck className="h-5 w-5 text-emerald-500" />;
      case "why-4":
        return <Tv className="h-5 w-5 text-pink-500" />;
      case "why-5":
        return <Compass className="h-5 w-5 text-[#F59E0B]" />;
      case "why-6":
        return <MessageSquare className="h-5 w-5 text-indigo-500" />;
      case "why-7":
        return <BookOpen className="h-5 w-5 text-violet-500" />;
      default:
        return <Sparkles className="h-5 w-5 text-[#F59E0B]" />;
    }
  };

  return (
    <section id="why-us" className="py-24 bg-white text-slate-900 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#2563EB] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
            Our Key Edge
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-3 tracking-tight">
            Why Choose Infinite SEO?
          </h2>
          <p className="text-slate-600 text-sm mt-3 font-light">
            We structure complex online business workflows into accessible micro-modules backed by dynamic in-classroom guidance.
          </p>
          <div className="h-1 w-12 bg-[#F59E0B] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {/* Main Hero Card inside the Grid */}
          <div className="md:col-span-2 bg-gradient-to-br from-[#0F172A] via-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-lg flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-lg">
                The Learning Equation
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Empowering You Beyond Simple Lectures.
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed">
                Most platforms sell loose recordings and walk away. Infinite SEO is an active Digital Services Agency—we operate in-house campaigns daily. Our students learn the identical systems we use to get and retain high-paying international clients.
              </p>
            </div>
            <div className="pt-8 border-t border-slate-800 mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500 font-mono block">OUR VALUES</span>
                <span className="text-sm font-semibold text-slate-200">Pragmatic. Affordable. Supportive.</span>
              </div>
              <a 
                href="#courses"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#F59E0B] hover:underline"
              >
                <span>Browse our training curricula</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>

          {/* Cards map */}
          {WHY_CHOOSE_US_DATA.map((item) => (
            <div 
              key={item.id}
              className="bg-slate-50 hover:bg-slate-100/50 rounded-2xl border border-slate-100 p-6 flex flex-col justify-between transition-all duration-300 group hover:shadow-sm"
            >
              <div className="space-y-4">
                <div className="p-3 bg-white w-fit rounded-xl border border-slate-100 group-hover:scale-105 transition-transform">
                  {getIcon(item.id)}
                </div>
                <h4 className="text-lg font-bold text-[#0F172A]">
                  {item.title}
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
              <div className="pt-4 text-left">
                <span className="text-[10px] uppercase tracking-widest text-[#2563EB] font-bold">
                  Infinite seo style
                </span>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
