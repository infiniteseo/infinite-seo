import React, { useState } from "react";
import { FAQ_DATA } from "../data";
import { ChevronDown, Plus, Minus, Search, HelpCircle, X } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  // Filter FAQs based on matching keywords in question or answer
  const filteredFAQs = FAQ_DATA.filter((faq) => {
    const text = (faq.question + " " + faq.answer).toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  return (
    <section id="faq" className="py-24 bg-white text-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#2563EB] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-3 tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="h-1 w-12 bg-[#F59E0B] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Live Search Component */}
        <div className="relative max-w-lg mx-auto mb-10">
          <input
            id="faq-search-box"
            type="text"
            placeholder="Search questions (e.g., certificate, freelancing)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-2xl text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Empty Search Feedback */}
        {filteredFAQs.length === 0 && (
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-500 font-light text-sm">No questions matched "{searchQuery}". Try another keyword!</p>
            <button 
              onClick={() => setSearchQuery("")}
              className="mt-3 text-xs text-[#2563EB] font-bold hover:underline cursor-pointer"
            >
              Show All Questions
            </button>
          </div>
        )}

        {/* Accordions mapping with keys */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={faq.id}
                className={`border rounded-2xl transition-all duration-300 ${
                  isOpen 
                    ? "border-slate-200 bg-slate-50/55 shadow-sm" 
                    : "border-slate-100 hover:border-slate-200 bg-white"
                }`}
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-[#0F172A] pr-4">
                    {faq.question}
                  </span>
                  <div className={`p-1.5 rounded-lg transition-colors ${isOpen ? "bg-[#2563EB]/15 text-[#2563EB]" : "bg-slate-50 text-slate-400"}`}>
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </div>
                </button>

                {/* Body content with transition animation */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-60 opacity-100 border-t border-slate-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-5 text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                    {faq.answer}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Micro Notice info */}
        <div className="text-center mt-12 bg-blue-50 border border-blue-100/50 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-left">
            <HelpCircle className="h-5 w-5 text-[#2563EB] shrink-0" />
            <span className="text-xs text-slate-600">
              Have another specialized query? Our counselors are active 24/7.
            </span>
          </div>
          <a
            href="#contact"
            className="text-xs font-bold text-[#2563EB] hover:underline"
          >
            Go to Contact Form &rarr;
          </a>
        </div>

      </div>
    </section>
  );
}
