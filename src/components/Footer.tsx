import React from "react";
import { Sparkles, ArrowUp } from "lucide-react";

export default function Footer() {
  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer id="footer" className="bg-[#0F172A] text-slate-400 text-xs sm:text-sm border-t border-slate-800/80 pt-16 pb-8 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Upper grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Column 1 - Brand Description (3/12 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-[#2563EB] to-[#F59E0B] p-2 rounded-xl">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-white uppercase">
                  INFINITE SEO
                </span>
                <p className="text-[9px] text-[#F59E0B] tracking-wider font-bold uppercase -mt-0.5">
                  Build. Brand. Grow.
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              At Infinite SEO (infiniteseo777.com), we simplify digital entrepreneurship through affordable practical instruction, active live cohorts, and in-house placement pipelines.
            </p>
          </div>

          {/* Column 2 - Core Links (2/12 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-[#F59E0B] pl-2">
              Directory
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#home" className="hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">About</a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">Services</a>
              </li>
              <li>
                <a href="#courses" className="hover:text-white transition-colors">Courses</a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Additional Links (2/12 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-[#2563EB] pl-2">
              Resources
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#blog" className="hover:text-white transition-colors">Blog / Learning Hub</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">Contact Log</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">Frequently Asked</a>
              </li>
            </ul>
          </div>

          {/* Column 4 - Legal Links (2/12 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-emerald-500 pl-2">
              Legal Terms
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#contact" className="hover:text-white transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">Terms & Conditions</a>
              </li>
            </ul>
          </div>

          {/* Column 5 - Micro Newsletter/Action (2/12 cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h5 className="text-xs font-bold text-white uppercase tracking-widest">
              Digital Careers
            </h5>
            <p className="text-[11px] text-slate-400 font-light leading-normal">
              Master the top 16 high-income digital domains under expert mentorship. 
            </p>
            <button
              onClick={handleScrollTop}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl flex items-center justify-center space-x-1 w-full transition-colors cursor-pointer text-xs font-bold font-button"
            >
              <ArrowUp className="h-4 w-4" />
              <span>Back to Top</span>
            </button>
          </div>

        </div>

        {/* Lower row */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          
          {/* Target copyright statement strictly requested in the kit */}
          <p className="text-[11px] text-slate-500 font-medium">
            © 2026 Infinite SEO. All Rights Reserved. Operating under infiniteseo777.com corporate guidelines.
          </p>

          <p className="text-[10px] text-slate-600 font-mono">
            Designed with Desktop-First & Mobile-First High Fidelity Precision // Mumbai, IND.
          </p>

        </div>

      </div>
    </footer>
  );
}
