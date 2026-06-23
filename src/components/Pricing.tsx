import React, { useState } from "react";
import { PRICING_DATA } from "../data";
import { Check, Sparkles, X, CheckCircle } from "lucide-react";

interface PricingProps {
  onPlanInquiry: (planName: string) => void;
}

export default function Pricing({ onPlanInquiry }: PricingProps) {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedInquiryPlan, setSelectedInquiryPlan] = useState<string | null>(null);
  
  // Dialog state
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const calculatePrice = (monthlyPrice: number) => {
    if (isAnnual) {
      // Apply 20% discount on yearly commitment
      const discountedMonth = Math.round(monthlyPrice * 0.8);
      return { price: discountedMonth, label: "/month" };
    }
    return { price: monthlyPrice, label: "/month" };
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryEmail.trim() || !inquiryPhone.trim()) {
      setErrorMsg("Please fill out all fields.");
      return;
    }
    setErrorMsg("");
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquirySubmitted(false);
      setSelectedInquiryPlan(null);
      setInquiryName("");
      setInquiryEmail("");
      setInquiryPhone("");
    }, 4000);
  };

  return (
    <section id="pricing" className="py-24 bg-slate-50 text-slate-900 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#2563EB] uppercase tracking-widest bg-blue-100/50 px-3 py-1 rounded-full">
            Pricing Plans
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-3 tracking-tight">
            Comprehensive Membership Plans
          </h2>
          <p className="text-slate-600 text-sm mt-3 font-light">
            Invest in your long-term skill acquisition. High-utility intelligence at a sustainable budget.
          </p>
          <div className="h-1 w-12 bg-[#F59E0B] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Billing Duration Switcher Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-16">
          <span className={`text-xs sm:text-sm font-semibold uppercase tracking-wider ${!isAnnual ? "text-[#0F172A] font-bold" : "text-slate-400"}`}>
            Billed Monthly
          </span>
          <button 
            id="billing-duration-toggle"
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-14 h-8 bg-slate-200 hover:bg-slate-300 rounded-full p-1 transition-all duration-300 relative cursor-pointer focus:outline-none"
          >
            <div className={`w-6 h-6 bg-[#2563EB] rounded-full transition-all duration-300 absolute ${isAnnual ? "left-7 bg-[#F59E0B]" : "left-1"}`}></div>
          </button>
          <span className={`text-xs sm:text-sm font-semibold uppercase tracking-wider ${isAnnual ? "text-[#0F172A] font-bold" : "text-slate-400"} flex items-center space-x-1.5`}>
            <span>Billed Annually</span>
            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Save 20%
            </span>
          </span>
        </div>

        {/* 3 Grid pricing models */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PRICING_DATA.map((plan) => {
            const { price, label } = calculatePrice(plan.price);
            
            return (
              <div 
                key={plan.id}
                className={`bg-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between border transition-all duration-300 relative ${
                  plan.popular 
                    ? "border-[#2563EB] shadow-lg scale-105 z-10 lg:-translate-y-2 ring-4 ring-blue-50" 
                    : "border-slate-200 shadow-sm hover:border-slate-300 hover:shadow"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-[#2563EB] text-white text-[10px] uppercase font-bold tracking-widest px-4 py-1.5 rounded-full shadow z-10 flex items-center space-x-1">
                    <Sparkles className="h-3 w-3" />
                    <span>Highly Recommended</span>
                  </div>
                )}

                {/* Details Top */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#0F172A] tracking-wider uppercase">
                      {plan.name}
                    </h3>
                    <p className="text-slate-500 text-xs mt-1.5 font-light leading-relaxed min-h-[40px]">
                      {plan.description}
                    </p>
                  </div>

                  {/* Pricing details */}
                  <div className="pt-4 border-t border-slate-100">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
                      ₹{price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-slate-400 font-mono italic ml-1">
                      {label}
                    </span>
                    {isAnnual && (
                      <span className="block text-[10px] text-slate-500 font-medium">
                        (₹{(price * 12).toLocaleString("en-IN")} billed yearly)
                      </span>
                    )}
                  </div>

                  {/* Bullet features */}
                  <ul className="space-y-3.5 pt-6 border-t border-slate-100 text-xs text-slate-700">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start space-x-2.5">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action button */}
                <div className="pt-8">
                  <button
                    onClick={() => setSelectedInquiryPlan(plan.name)}
                    className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${
                      plan.popular
                        ? "bg-[#2563EB] hover:bg-[#2563EB]/90 text-white shadow-md"
                        : "bg-slate-800 hover:bg-slate-900 text-white"
                    }`}
                  >
                    Select Plan
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Plan Choice Dialog Form */}
      {selectedInquiryPlan && (
        <div id="pricing-popup-overlay" className="fixed inset-0 z-100 bg-[#0F172A]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-slate-100 animated zoomIn">
            
            <button 
              onClick={() => setSelectedInquiryPlan(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {inquirySubmitted ? (
              <div className="text-center py-6 space-y-4">
                <div className="mx-auto h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-2">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <h4 className="text-xl font-bold text-[#0F172A]">Membership Scheduled!</h4>
                <p className="text-slate-600 text-xs sm:text-sm font-light">
                  Your registration strategy pipeline for the <strong>{selectedInquiryPlan}</strong> has been secured. Our team will contact you to unlock your learning credentials within 2 hours.
                </p>
                <div className="text-[10px] text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-dashed border-slate-200">
                  Confirmation sent to <span className="font-semibold">{inquiryEmail}</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div className="mb-2">
                  <span className="text-[10px] bg-amber-100 text-[#F59E0B] px-2.5 py-1 rounded-full uppercase tracking-wider font-bold">
                    Membership Registration
                  </span>
                  <h4 className="text-lg font-bold text-[#0F172A] mt-2">
                    Requesting: {selectedInquiryPlan}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Provide your contact endpoints below to review discount tiers, access modules, and verify syllabus terms.
                  </p>
                </div>

                {errorMsg && (
                  <p className="text-xs font-semibold text-red-600">{errorMsg}</p>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    placeholder="e.g. support@infiniteseo777.com"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">
                    WhatsApp or Phone (+91)
                  </label>
                  <input
                    type="tel"
                    required
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    placeholder="e.g. +91 99679 77824"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#F59E0B] hover:bg-slate-900 hover:text-white text-[#0F172A] font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-all duration-200 cursor-pointer"
                  >
                    Confirm Strategic Access Call
                  </button>
                </div>
              </form>
            )}

            <div className="mt-4 pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400">
              Payments processed securely. 14-day refund guarantee if unsatisfied.
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
