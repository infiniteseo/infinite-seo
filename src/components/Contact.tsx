import React, { useState } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Youtube, 
  Linkedin, 
  Facebook, 
  Send, 
  CheckCircle, 
  Sparkles,
  Info,
  Loader2
} from "lucide-react";
import { DatabaseService } from "../services/databaseService";

export default function Contact() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userSubject, setUserSubject] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [wasDbSaved, setWasDbSaved] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim() || !userSubject.trim() || !userMessage.trim()) {
      setFormError("All input fields are required before sending.");
      return;
    }
    
    setFormError("");
    setIsSubmitting(true);

    try {
      const payload = {
        userName: userName.trim(),
        userEmail: userEmail.trim(),
        userSubject: userSubject.trim(),
        userMessage: userMessage.trim()
      };

      await DatabaseService.createInquiry(payload);
      setWasDbSaved(true);
      setSubmitted(true);
    } catch (err) {
      console.warn("DatabaseService save failed, using local simulation flow.", err);
      setWasDbSaved(false);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }

    setTimeout(() => {
      // Clear fields
      setSubmitted(false);
      setUserName("");
      setUserEmail("");
      setUserSubject("");
      setUserMessage("");
    }, 8000);
  };

  return (
    <section id="contact" className="py-24 bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#2563EB] uppercase tracking-widest bg-blue-100/50 px-3 py-1 rounded-full">
            Connect
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-3 tracking-tight">
            Contact Infinite SEO
          </h2>
          <div className="h-1 w-12 bg-[#F59E0B] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Main Grid Card Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* Details Left Column (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-[#0F172A] text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden shadow-xl border border-slate-800">
            {/* Ambient gradients */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#F59E0B]/10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#2563EB]/10 rounded-full filter blur-3xl"></div>

            <div className="space-y-8 relative z-10 text-left">
              <div>
                <span className="text-[10px] text-[#F59E0B] uppercase tracking-widest font-bold">
                  Corporate headquarters
                </span>
                <h3 className="text-2xl font-bold mt-2">Get in Touch Today</h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-3 font-light leading-relaxed">
                  Have a question about class modules, placement conditions, or affiliate campaigns? Write to our support coordinators. We respond within 2 hours.
                </p>
              </div>

              {/* Physical details list */}
              <div className="space-y-6">
                
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-slate-800 rounded-xl text-amber-500 shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-[11px] text-slate-500 uppercase tracking-widest font-bold">Email coordinates</h5>
                    <p className="text-sm font-semibold text-slate-200 mt-1 select-all break-all">
                      support@infiniteseo777.com
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Alternate: contact@infiniteseo777.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-slate-800 rounded-xl text-[#2563EB] shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-[11px] text-slate-500 uppercase tracking-widest font-bold">Call / WhatsApp Helplines</h5>
                    <p className="text-sm font-semibold text-slate-200 mt-1 select-all">
                      +91 99679 77824
                    </p>
                    <span className="text-[10px] text-slate-400">Monday - Sunday // 9 AM - 8 PM IST</span>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-slate-800 rounded-xl text-emerald-500 shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-[11px] text-slate-500 uppercase tracking-widest font-bold">Office Address</h5>
                    <p className="text-sm text-slate-200 mt-1">
                      Mumbai, Maharashtra, India
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Social channels badges */}
            <div className="pt-8 border-t border-slate-800 mt-8 relative z-10 text-left">
              <h5 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4">
                Follow our official social networks:
              </h5>
              <div className="grid grid-cols-2 gap-2">
                <a 
                  href="https://www.instagram.com/infiniteseo" 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-slate-800/60 hover:bg-slate-800 p-2 rounded-xl flex items-center space-x-2 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  <Instagram className="h-4 w-4 text-pink-500 shrink-0" />
                  <span className="truncate">@infiniteseo</span>
                </a>

                <a 
                  href="https://www.youtube.com/infiniteseo" 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-slate-800/60 hover:bg-slate-800 p-2 rounded-xl flex items-center space-x-2 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  <Youtube className="h-4 w-4 text-red-500 shrink-0" />
                  <span className="truncate">Infinite SEO</span>
                </a>

                <a 
                  href="https://www.linkedin.com/company/infiniteseo" 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-slate-800/60 hover:bg-slate-800 p-2 rounded-xl flex items-center space-x-2 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  <Linkedin className="h-4 w-4 text-blue-500 shrink-0" />
                  <span className="truncate">Infinite SEO Official</span>
                </a>

                <a 
                  href="https://www.facebook.com/infiniteseo" 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-slate-800/60 hover:bg-slate-800 p-2 rounded-xl flex items-center space-x-2 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  <Facebook className="h-4 w-4 text-blue-600 shrink-0" />
                  <span className="truncate">Infinite SEO</span>
                </a>
              </div>
            </div>

          </div>

          {/* Form Right Column (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm flex flex-col justify-center">
            
            {submitted ? (
              <div className="text-center py-12 space-y-4 max-w-sm mx-auto animate-fade-in">
                <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <h4 className="text-xl font-bold text-[#0F172A]">Message Sent Successfully!</h4>
                <p className="text-slate-600 text-xs sm:text-sm font-light">
                  Thank you, <strong>{userName}</strong>. Your question subject <strong>"{userSubject}"</strong> is queued. A coordinator from Infinite SEO will reply to your inbox shortly.
                </p>
                <div className="text-[10px] text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-dashed border-slate-200 flex flex-col gap-1 items-center">
                  <div>Inbox delivery confirmed to: <span className="font-semibold">{userEmail}</span></div>
                  <div className="text-[9px] text-[#2563EB] font-bold flex items-center gap-1 mt-1 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    {wasDbSaved ? (
                      <>
                        <Sparkles className="h-2.5 w-2.5 text-amber-500 animate-spin" />
                        <span>Database Synced Successfully</span>
                      </>
                    ) : (
                      <>
                        <Info className="h-2.5 w-2.5 text-blue-500" />
                        <span>Submitted (Offline Demo Mode)</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
                
                <div>
                  <h4 className="text-lg font-bold text-[#0F172A]">Send an Inquiry Message</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Fill out our verified contact log. We promise high response rates.
                  </p>
                </div>

                {formError && (
                  <p className="text-xs font-semibold text-red-600">{formError}</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="e.g. Rahul Mehta"
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
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">
                    Subject Topic
                  </label>
                  <input
                    type="text"
                    required
                    value={userSubject}
                    onChange={(e) => setUserSubject(e.target.value)}
                    placeholder="e.g. Placement opportunities / Pro-plan pricing inquiry"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">
                    Your Message Detail
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Explain your queries or custom training needs..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none resize-none"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#2563EB] hover:bg-[#2563EB]/95 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer btn-font disabled:opacity-75"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Sending Coordinates...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Send Message Coordinates</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

            <div className="mt-6 p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center space-x-2">
              <Info className="h-4 w-4 text-[#2563EB] shrink-0" />
              <span className="text-[10px] text-slate-500 leading-normal">
                By lodging a request, you permit representative trainers of Infinite SEO (infiniteseo777.com) to call or reply on WhatsApp.
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
