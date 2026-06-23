import React, { useState } from "react";
import { TESTIMONIALS_DATA } from "../data";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

export default function Testimonials() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const prevTestimonial = () => {
    setActiveIdx((prev) => (prev === 0 ? TESTIMONIALS_DATA.length - 1 : prev - 1));
  };

  const nextTestimonial = () => {
    setActiveIdx((prev) => (prev === TESTIMONIALS_DATA.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-24 bg-white text-slate-900 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fadeIn">
          <span className="text-xs font-bold text-[#2563EB] uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100/50">
            Success Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-3 tracking-tight">
            What Our Students Say
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-3 font-light">
            Read through {TESTIMONIALS_DATA.length} genuine reviews from Indian housewife graduates, career swappers, college students, and active digital freelancers.
          </p>
          <div className="h-1 w-12 bg-[#F59E0B] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Testimonials layout Grid/Carousel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-100 relative overflow-hidden">
          
          <div className="absolute top-10 right-10 opacity-10 text-slate-300 pointer-events-none">
            <Quote className="h-40 w-40" />
          </div>

          {/* Left Column - Graphic/Info (lg:col-span-4) */}
          <div className="col-span-1 lg:col-span-4 space-y-4 relative z-10 text-center lg:text-left">
            <span className="text-[10px] font-bold text-[#2563EB] font-mono tracking-wider uppercase bg-blue-100/50 px-2.5 py-1 rounded">
              STUDENTS // ALUMNI REVIEWS
            </span>
            <h3 className="text-2xl font-extrabold text-[#0F172A] leading-tight font-sans">
              Real Skills. <br />
              Genuine Outcomes.
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-light">
              We have helped support thousands of local and remote graduates transition from theoretical learning to high-earning in-house and global marketplace specialists.
            </p>
            
            {/* Control buttons */}
            <div className="flex items-center justify-center lg:justify-start space-x-3 pt-4">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-xl bg-white hover:bg-[#0F172A] hover:text-white text-[#0F172A] border border-slate-200 transition-colors cursor-pointer shadow-sm"
                aria-label="Previous Review"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-xs font-mono text-slate-400 font-bold">
                {(activeIdx + 1)} / {TESTIMONIALS_DATA.length}
              </span>
              <button
                onClick={nextTestimonial}
                className="p-2 rounded-xl bg-white hover:bg-[#0F172A] hover:text-white text-[#0F172A] border border-slate-200 transition-colors cursor-pointer shadow-sm"
                aria-label="Next Review"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Right Column - Card content (lg:col-span-8) */}
          <div className="col-span-1 lg:col-span-8 relative z-10">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm transition-all duration-300 relative min-h-[220px] flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* Ratings */}
                <div className="flex items-center space-x-1">
                  {[...Array(TESTIMONIALS_DATA[activeIdx].rating)].map((_, i) => (
                    <Star key={i} className="h-4.5 w-4.5 text-amber-500 fill-amber-500" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-light italic">
                  “{TESTIMONIALS_DATA[activeIdx].quote}”
                </p>

                {/* Profile detail */}
                <div className="flex items-center space-x-4 pt-4 border-t border-slate-100">
                  
                  {/* Mock beautiful circular avatar seed */}
                  <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-blue-100 flex items-center justify-center text-[#2563EB] font-bold text-sm sm:text-base select-none">
                    {TESTIMONIALS_DATA[activeIdx].name[0]}
                  </div>

                  <div>
                    <h4 className="font-extrabold text-[#0F172A] text-xs sm:text-sm">
                      {TESTIMONIALS_DATA[activeIdx].name}
                    </h4>
                    <p className="text-slate-500 text-[10px] sm:text-[11px] font-semibold">
                      {TESTIMONIALS_DATA[activeIdx].role}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Display all in mini cards below on desktop / mobile with a gorgeous see-more panel */}
        <div className="mt-14 space-y-8">
          <div className="text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
              Interactive Reviews Hub ({TESTIMONIALS_DATA.length} Verified Records)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS_DATA.slice(0, showAll ? TESTIMONIALS_DATA.length : 6).map((test, index) => (
              <div
                key={test.id}
                onClick={() => {
                  setActiveIdx(index);
                  // Scroll to main display card if user is on mobile
                  const el = document.querySelector(".lg:col-span-8");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
                  }
                }}
                className={`p-6 bg-white rounded-2xl border transition-all duration-300 cursor-pointer text-left ${
                  activeIdx === index 
                    ? "border-amber-400 bg-amber-50/10 shadow scale-[1.01]" 
                    : "border-slate-100 bg-slate-50/40 hover:bg-slate-50/80"
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="h-9 w-9 text-xs rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-extrabold shrink-0">
                    {test.name[0]}
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-bold text-[#0F172A] text-xs leading-none truncate">{test.name}</h5>
                    <span className="text-[10px] text-slate-400 font-semibold leading-none truncate block mt-1.5">{test.role}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-0.5 mb-2">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-slate-600 text-xs font-light italic leading-relaxed line-clamp-3">
                  “{test.quote}”
                </p>
              </div>
            ))}
          </div>

          {/* Show More toggle button */}
          <div className="text-center pt-2">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-3 bg-[#0F172A] hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow cursor-pointer inline-flex items-center space-x-2"
            >
              <span>{showAll ? "Show Less Reviews" : `Show More Genuine Reviews (+${TESTIMONIALS_DATA.length - 6})`}</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
