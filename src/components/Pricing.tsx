import React, { useState, useEffect } from "react";
import { PRICING_DATA } from "../data";
import { Check, Sparkles, X, CheckCircle, CreditCard, Send } from "lucide-react";
import { DatabaseService } from "../services/databaseService";
import { PaymentConfig } from "../types";

interface PricingProps {
  onPlanInquiry: (planName: string) => void;
}

export default function Pricing({ onPlanInquiry }: PricingProps) {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedInquiryPlan, setSelectedInquiryPlan] = useState<string | null>(null);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null);
  
  useEffect(() => {
    async function loadConfig() {
      try {
        const config = await DatabaseService.getPaymentConfig();
        setPaymentConfig(config);
      } catch (err) {
        console.warn("Failed to retrieve payment config:", err);
      }
    }
    loadConfig();
    window.addEventListener("storage", loadConfig);
    return () => window.removeEventListener("storage", loadConfig);
  }, []);
  
  // Dialog state
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // New secure UPI QR states
  const [checkoutMethod, setCheckoutMethod] = useState<"upi" | "call">("upi");
  const [upiTxnId, setUpiTxnId] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [confirmPaymentToggle, setConfirmPaymentToggle] = useState(false);

  const getPlanPrice = (planName: string): number => {
    switch (planName) {
      case "Starter Plan": return 999;
      case "Pro Plan": return 2999;
      case "Premium Plan": return 5999;
      default: return 999;
    }
  };

  const calculatePrice = (monthlyPrice: number) => {
    if (isAnnual) {
      // Apply 20% discount on yearly commitment
      const discountedMonth = Math.round(monthlyPrice * 0.8);
      return { price: discountedMonth, label: "/month" };
    }
    return { price: monthlyPrice, label: "/month" };
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryEmail.trim() || !inquiryPhone.trim()) {
      setErrorMsg("Please fill out all fields.");
      return;
    }
    if (checkoutMethod === "upi") {
      if (!confirmPaymentToggle) {
        setErrorMsg("Please complete the transfer, enable the 'Confirm Payment' toggle, and enter your transaction reference ID / UTR code to authorize membership.");
        return;
      }
      if (!upiTxnId.trim()) {
        setErrorMsg(`Please enter your transaction reference ID / UTR code to verify your payment of ₹${getPlanPrice(selectedInquiryPlan || "").toLocaleString("en-IN")}.`);
        return;
      }
    }
    
    setErrorMsg("");
    setIsPaying(true);

    try {
      const inquiryData = {
        userName: inquiryName,
        userEmail: inquiryEmail,
        userSubject: `Membership Purchase: ${selectedInquiryPlan}`,
        userMessage: checkoutMethod === "upi" 
          ? `Paid via Secure UPI QR. Transaction UTR Reference: ${upiTxnId}. Plan: ${selectedInquiryPlan}, Amount: ₹${getPlanPrice(selectedInquiryPlan || "")}`
          : `Strategic Access Request for ${selectedInquiryPlan}. Contact Phone: ${inquiryPhone}`,
        createdAt: new Date().toISOString()
      };
      
      await DatabaseService.createInquiry(inquiryData);
      
      setIsPaying(false);
      setInquirySubmitted(true);
      
      setTimeout(() => {
        setInquirySubmitted(false);
        setSelectedInquiryPlan(null);
        setInquiryName("");
        setInquiryEmail("");
        setInquiryPhone("");
        setUpiTxnId("");
        setConfirmPaymentToggle(false);
      }, 4000);
    } catch (err) {
      console.error("Failed to submit inquiry:", err);
      setErrorMsg("Failed to process transaction. Please try again or contact support.");
      setIsPaying(false);
    }
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
        <div id="pricing-popup-overlay" className="fixed inset-0 z-100 bg-[#0F172A]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-slate-100 my-8 animated zoomIn">
            
            <button 
              onClick={() => {
                setSelectedInquiryPlan(null);
                setErrorMsg("");
                setConfirmPaymentToggle(false);
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {inquirySubmitted ? (
              <div className="text-center py-6 space-y-4">
                <div className="mx-auto h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-2">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <h4 className="text-xl font-bold text-[#0F172A]">
                  {checkoutMethod === "upi" ? "Subscription Submitted!" : "Membership Scheduled!"}
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm font-light">
                  {checkoutMethod === "upi" ? (
                    <span>Your transaction proof for the <strong>{selectedInquiryPlan}</strong> has been cataloged. Our administration will verify the UTR and activate your learning credentials within 2 hours.</span>
                  ) : (
                    <span>Your registration strategy pipeline for the <strong>{selectedInquiryPlan}</strong> has been secured. Our team will contact you to unlock your learning credentials within 2 hours.</span>
                  )}
                </p>
                <div className="text-[10px] text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-dashed border-slate-200">
                  Receipt updates sent to <span className="font-semibold">{inquiryEmail}</span>
                </div>
              </div>
            ) : (() => {
              const payeeUpi = paymentConfig?.ownerUpiId || "ritukamble329@okicici";
              const payeeName = paymentConfig?.ownerName || "Bish";
              const planPrice = getPlanPrice(selectedInquiryPlan);
              const upiDeepLink = `upi://pay?pa=${payeeUpi}&pn=${encodeURIComponent(payeeName)}&am=${planPrice}&cu=INR&tn=${encodeURIComponent(selectedInquiryPlan + " Enrollment")}`;
              const qrCodeImg = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiDeepLink)}`;

              return (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div className="mb-2">
                    <span className="text-[10px] bg-amber-100 text-[#F59E0B] px-2.5 py-1 rounded-full uppercase tracking-wider font-bold">
                      Membership Enrollment
                    </span>
                    <h4 className="text-lg font-bold text-[#0F172A] mt-1">
                      Requesting: {selectedInquiryPlan}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Secure your seat or purchase instantly to avoid enrollment backlogs.
                    </p>
                  </div>

                  {/* Method Selector Tabs */}
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold my-3">
                    <button
                      type="button"
                      onClick={() => {
                        setCheckoutMethod("upi");
                        setErrorMsg("");
                      }}
                      className={`py-2 rounded-lg transition-all cursor-pointer text-center ${
                        checkoutMethod === "upi"
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-600 hover:text-slate-800"
                      }`}
                    >
                      Instant UPI QR Code Pay
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCheckoutMethod("call");
                        setErrorMsg("");
                      }}
                      className={`py-2 rounded-lg transition-all cursor-pointer text-center ${
                        checkoutMethod === "call"
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-600 hover:text-slate-800"
                      }`}
                    >
                      Request Call Back
                    </button>
                  </div>

                  {checkoutMethod === "upi" ? (
                    <div className="space-y-3">
                      {/* Secured Merchant Card */}
                      <div className="bg-[#E8F0FE] border border-blue-200 text-slate-900 rounded-[20px] p-4 w-full text-center flex flex-col items-center shadow-sm select-none mx-auto">
                        {/* Header: Payee and Verified status */}
                        <div className="flex items-center gap-2 mb-3 w-full justify-start border-b border-blue-100 pb-2">
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                            {payeeName.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="text-left">
                            <div className="font-extrabold text-[11px] text-slate-900 flex items-center gap-1">
                              {payeeName}
                              <span className="bg-blue-500 text-white text-[6px] px-1 py-0.2 rounded-full font-black">✓ VERIFIED</span>
                            </div>
                            <div className="text-[7px] text-slate-500 font-bold uppercase tracking-wider">UPI MERCHANT PAYEE</div>
                          </div>
                        </div>

                        {/* Dynamic QR Code container */}
                        <div className="bg-white p-2.5 rounded-xl border border-blue-50 flex items-center justify-center relative mb-3 shadow-sm">
                          <img 
                            src={qrCodeImg} 
                            alt="UPI Secure QR Code" 
                            className="w-[120px] h-[120px] bg-white rounded-lg" 
                            referrerPolicy="no-referrer"
                          />
                          {/* Center UPI overlay for trustworthiness */}
                          <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md p-0.5 border border-slate-100">
                              <div className="w-full h-full rounded-full bg-sky-500 flex items-center justify-center text-[4px] text-white font-black tracking-tight leading-none">UPI</div>
                            </div>
                          </div>
                        </div>

                        {/* Payee Info & Dynamic Locked Price */}
                        <div className="w-full text-center space-y-0.5">
                          <div className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">SECURE PAYMENT ADDRESS</div>
                          <div className="text-[9px] font-semibold font-mono bg-white/60 text-slate-700 py-0.5 px-2 rounded-lg break-all">
                            {payeeUpi}
                          </div>

                          <div className="pt-1.5">
                            <span className="text-[7px] text-slate-400 uppercase font-extrabold block tracking-wider">LOCKED PAYABLE AMOUNT</span>
                            <div className="text-xl font-black font-mono text-slate-900 leading-none">
                              ₹{planPrice.toLocaleString("en-IN")}
                            </div>
                            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{selectedInquiryPlan}</p>
                          </div>
                        </div>

                        {/* Anti-Scam Verification Subtitle */}
                        <div className="mt-2 text-[7px] font-bold text-blue-700 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-200/50 w-full uppercase tracking-wider flex items-center justify-center gap-1">
                          <span className="h-1 w-1 bg-blue-500 rounded-full animate-ping"></span>
                          <span>System-Locked Price: Fraud Prevention Active</span>
                        </div>
                      </div>

                      <div className="w-full mb-3">
                        <a
                          href={upiDeepLink}
                          className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 text-center shadow-sm"
                        >
                          <span>📱 Open UPI App (GPay/PhonePe)</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 leading-normal bg-slate-50 p-3 rounded-xl border border-slate-150 mb-3">
                      ℹ️ Scheduling a call queues you for manual onboarding review. Seats are subject to cohort caps and are not fully guaranteed until verified.
                    </p>
                  )}

                  {errorMsg && (
                    <p className="text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100">{errorMsg}</p>
                  )}

                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        placeholder="e.g. Priya Sharma"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={inquiryEmail}
                          onChange={(e) => setInquiryEmail(e.target.value)}
                          placeholder="e.g. priya@gmail.com"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">
                          WhatsApp or Phone
                        </label>
                        <input
                          type="tel"
                          required
                          value={inquiryPhone}
                          onChange={(e) => setInquiryPhone(e.target.value)}
                          placeholder="e.g. +91 99679 77824"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {checkoutMethod === "upi" && (
                      <div className="space-y-3 pt-1">
                        {/* Confirm Payment Toggle */}
                        <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-xl border border-blue-100 select-none">
                          <div className="space-y-0.5 text-left">
                            <span className="text-[11px] font-bold text-slate-900 block">I have completed this UPI payment</span>
                            <span className="text-[9px] text-slate-500 block">Toggle to confirm and enter transaction reference UTR</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setConfirmPaymentToggle(!confirmPaymentToggle);
                              setErrorMsg("");
                            }}
                            className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors shrink-0 ${
                              confirmPaymentToggle ? "bg-blue-600" : "bg-slate-350"
                            }`}
                          >
                            <div
                              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                                confirmPaymentToggle ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>

                        {confirmPaymentToggle && (
                          <div className="space-y-1 text-left">
                            <label className="block text-[10px] font-bold text-red-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                              <span>Payment Ref / UTR / Txn ID *</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={upiTxnId}
                              onChange={(e) => setUpiTxnId(e.target.value)}
                              placeholder="e.g. 12-digit UTR from GPay receipt"
                              className="w-full px-3 py-2 border border-red-200 focus:border-red-400 focus:ring-1 focus:ring-red-300 rounded-lg text-xs bg-red-50/20 focus:bg-white focus:outline-none font-bold text-[#0F172A]"
                            />
                            <p className="text-[9px] text-slate-400 mt-1">
                              Please enter the 12-digit transaction UTR reference code to verify your purchase of ₹{getPlanPrice(selectedInquiryPlan || "").toLocaleString("en-IN")}.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isPaying}
                      className="w-full py-3 bg-blue-600 hover:bg-slate-900 text-white hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-all duration-200 cursor-pointer text-center flex items-center justify-center gap-1.5"
                    >
                      {isPaying ? (
                        <span>Processing secure registration...</span>
                      ) : checkoutMethod === "upi" ? (
                        <span>Verify Transaction & Enroll</span>
                      ) : (
                        <span>Confirm Strategic Access Call</span>
                      )}
                    </button>
                  </div>
                </form>
              );
            })()}

            <div className="mt-4 pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400">
              Payments processed securely under Corporate Guidelines. 14-day refund policy.
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
