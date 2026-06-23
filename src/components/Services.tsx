import React from "react";
import { SERVICES_DATA } from "../data";
import { 
  Megaphone, 
  Award, 
  Briefcase, 
  Video, 
  TrendingUp, 
  PieChart, 
  Check, 
  Sparkles,
  ArrowRight
} from "lucide-react";

interface ServicesProps {
  onServiceSelect: (serviceName: string) => void;
}

export default function Services({ onServiceSelect }: ServicesProps) {
  // Map identifier string to appropriate React icons
  const getIcon = (id: string) => {
    switch(id) {
      case "service-1":
        return <Megaphone className="h-6 w-6 text-amber-500" />;
      case "service-2":
        return <Award className="h-6 w-6 text-blue-500" />;
      case "service-3":
        return <Briefcase className="h-6 w-6 text-emerald-500" />;
      case "service-4":
        return <Video className="h-6 w-6 text-pink-500" />;
      case "service-5":
        return <TrendingUp className="h-6 w-6 text-purple-500" />;
      case "service-6":
        return <PieChart className="h-6 w-6 text-indigo-500" />;
      default:
        return <Sparkles className="h-6 w-6 text-[#F59E0B]" />;
    }
  };

  return (
    <section id="services" className="py-24 bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#2563EB] uppercase tracking-widest bg-blue-100/50 px-3 py-1 rounded-full">
            What We Do
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-3 tracking-tight">
            Our Professional Services
          </h2>
          <div className="h-1 w-12 bg-[#F59E0B] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Highlight Placement Banner */}
        <div className="mb-14 bg-gradient-to-r from-[#0F172A] to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#2563EB]/10 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#F59E0B]/10 rounded-full filter blur-2xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center md:text-left">
              <span className="inline-flex items-center space-x-1 bg-[#F59E0B]/20 text-[#F59E0B] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-3 w-3 animate-spin duration-3000" />
                <span>Careers & Placement Guarantee</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                We provide Trainings & Placement in our company & we also provide Internships & Certificate
              </h3>
              <p className="text-slate-300 text-sm sm:text-base max-w-2xl font-light">
                We offer hands-on training coupled with real placement pipelines within the Infinite SEO team! Excel in our courses and secure active client-facing positions globally.
              </p>
            </div>
            <button
              onClick={() => onServiceSelect("In-house Placement Training")}
              className="bg-[#2563EB] hover:bg-blue-500 text-white font-bold px-6 py-3.5 rounded-xl text-xs sm:text-sm uppercase tracking-wide shadow-md transition-all duration-300 transform hover:-translate-y-0.5 shrink-0 btn-font cursor-pointer"
            >
              Inquire Placement Strategy
            </button>
          </div>
        </div>

        {/* 6 Grid items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES_DATA.map((service) => (
            <div 
              key={service.id}
              className="bg-white rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 p-6 sm:p-8 flex flex-col h-full relative group hover:-translate-y-1"
            >
              {service.badge && (
                <span className="absolute top-4 right-4 bg-slate-100 text-slate-800 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md">
                  {service.badge}
                </span>
              )}

              {/* Icon Container */}
              <div className="mb-6 p-3.5 bg-slate-50 group-hover:bg-slate-100 w-fit rounded-2xl transition-colors">
                {getIcon(service.id)}
              </div>

              {/* Detail list */}
              <div className="flex-grow space-y-3">
                <span className="text-xs text-slate-400 font-mono tracking-widest font-bold">
                  SERVICE // {service.number}
                </span>
                <h4 className="text-xl font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                  {service.name}
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-light">
                  {service.description}
                </p>

                {/* Sub benefits check */}
                <div className="pt-4 border-t border-slate-100 mt-4 space-y-2">
                  <p className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold">
                    Core Focus Area:
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {service.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <Check className="h-3.5 w-3.5 text-[#F59E0B] shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action */}
              <div className="pt-6 mt-6 border-t border-slate-100 text-right">
                <button
                  onClick={() => onServiceSelect(service.name)}
                  className="inline-flex items-center space-x-1.5 text-[#2563EB] hover:text-[#F59E0B] text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer"
                >
                  <span>Book Consultation</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
