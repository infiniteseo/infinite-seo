import React, { useState, useEffect } from "react";
import { Calendar, Clock, Sparkles, Users, Video, CheckCircle2, ArrowRight, Loader2, PlayCircle, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { User, WorkshopRegistration } from "../types";
import { DatabaseService } from "../services/databaseService";

interface WorkshopBannerProps {
  currentUser: User | null;
  onLoginClick: () => void;
}

export default function WorkshopBanner({ currentUser, onLoginClick }: WorkshopBannerProps) {
  const [name, setName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [regDetails, setRegDetails] = useState<WorkshopRegistration | null>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [seatsLeft, setSeatsLeft] = useState(14); // Interactive mock state with gradual random drop

  const TIMING_OPTIONS = [
    "Saturday, 06:00 PM - 07:00 PM IST (Live Digital Marketing Workshop)",
    "Sunday, 11:00 AM - 12:00 PM IST (Live Digital Marketing Workshop)"
  ];
  const [selectedTiming, setSelectedTiming] = useState(TIMING_OPTIONS[1]); // Default to Sunday

  const workshopTitle = "AI-Powered SEO & Advanced Live Digital Marketing Workshop";

  // Calculate upcoming workshop date (whichever is sooner: Sat 6 PM or Sun 11 AM)
  const getNextWorkshopDate = () => {
    const now = new Date();
    
    // Saturday 6 PM (18:00)
    const sat = new Date(now.getTime());
    sat.setHours(18, 0, 0, 0);
    const daySat = now.getDay();
    let satDiff = 6 - daySat;
    if (satDiff < 0 || (satDiff === 0 && now.getHours() >= 18)) {
      satDiff += 7;
    }
    sat.setDate(now.getDate() + satDiff);
    
    // Sunday 11 AM (11:00)
    const sun = new Date(now.getTime());
    sun.setHours(11, 0, 0, 0);
    const daySun = now.getDay();
    let sunDiff = 0 - daySun;
    if (sunDiff < 0 || (sunDiff === 0 && now.getHours() >= 11)) {
      sunDiff += 7;
    }
    sun.setDate(now.getDate() + sunDiff);
    
    return sat.getTime() < sun.getTime() ? sat : sun;
  };

  // Live countdown timer ticking down to next Sunday 11 AM
  useEffect(() => {
    const targetDate = getNextWorkshopDate();
    
    const updateTimer = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        // Reset to next week if target passed
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdown({ days: d, hours: h, minutes: m, seconds: s });
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  // Simulating live seat updates for urgency (dropping slowly but never going below 3)
  useEffect(() => {
    const interval = setInterval(() => {
      setSeatsLeft((prev) => {
        if (prev <= 3) return 3;
        // 30% chance of dropping by 1
        return Math.random() < 0.3 ? prev - 1 : prev;
      });
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  // Check if user is already registered on mount or when currentUser changes
  useEffect(() => {
    const checkExistingRegistration = async () => {
      if (currentUser) {
        const list = await DatabaseService.getUserWorkshopRegistrations(currentUser.uid);
        const match = list.find(r => r.workshopTitle === workshopTitle);
        if (match) {
          setRegistered(true);
          setRegDetails(match);
        } else {
          setRegistered(false);
          setRegDetails(null);
        }
      } else {
        // Check guest registration in local storage
        const local = localStorage.getItem("infinite_seo_workshops_guest");
        if (local) {
          const list: WorkshopRegistration[] = JSON.parse(local);
          const match = list.find(r => r.workshopTitle === workshopTitle);
          if (match) {
            setRegistered(true);
            setRegDetails(match);
          } else {
            setRegistered(false);
            setRegDetails(null);
          }
        } else {
          setRegistered(false);
          setRegDetails(null);
        }
      }
    };
    checkExistingRegistration();
  }, [currentUser]);

  // Handle Free Registration
  const handleRegister = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!currentUser && (!name.trim() || !emailOrPhone.trim())) {
      return;
    }

    setLoading(true);
    try {
      const regId = `ws_${Math.random().toString(36).substring(2, 11)}`;
      const attendeeName = currentUser ? (currentUser.name || "Learner Partner") : name;
      const attendeeContact = currentUser ? (currentUser.email || currentUser.phone || "") : emailOrPhone;
      
      const isEmail = attendeeContact.includes("@");
      
      const payload: WorkshopRegistration = {
        id: regId,
        userId: currentUser?.uid || undefined,
        name: attendeeName,
        email: isEmail ? attendeeContact : `${attendeeContact.replace(/[^0-9]/g, "")}@phone.infiniteseo.com`,
        phone: !isEmail ? attendeeContact : undefined,
        workshopDate: selectedTiming,
        workshopTitle: workshopTitle,
        registeredAt: new Date().toISOString()
      };

      await DatabaseService.addWorkshopRegistration(payload);
      setRegistered(true);
      setRegDetails(payload);

      // Trigger celebration overlay with custom positive reinforcement message
      window.dispatchEvent(new CustomEvent("celebration-trigger", {
        detail: { message: `Free Workshop ticket reserved for ${attendeeName}! 🎉` }
      }));
    } catch (err) {
      console.error("Workshop registration error: ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="workshop-top-section" className="w-full bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-blue-900/40 relative overflow-hidden">
      {/* Visual background details */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950/0 to-slate-950/0 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Column 1: Workshop Information Details & Countdown */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black text-[10px] tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-4 w-fit shadow-sm">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>Free Live Training Program</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Unlock the Power of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-300">AI-Driven SEO</span>
            </h2>
            <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Accelerate your digital marketing career, rank websites on page #1 with Gemini, and unlock real commission earnings. Reserve your slot for our upcoming live sessions.
            </p>

            {/* Quick Specs Bullet grid */}
            <div className="grid sm:grid-cols-3 gap-3.5 mt-6 border-y border-slate-800/80 py-4.5">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Calendar className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Date</span>
                  <span className="text-xs font-semibold text-white">This Weekend</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Clock className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Timings</span>
                  <span className="text-[11px] font-semibold text-white block">Sat: 06:00 PM - 07:00 PM</span>
                  <span className="text-[11px] font-semibold text-white block">Sun: 11:00 AM - 12:00 PM</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Video className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Format</span>
                  <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                    Live Digital Marketing Workshop
                  </span>
                </div>
              </div>
            </div>

            {/* Countdown Clock Display */}
            <div className="mt-6">
              <span className="block text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2.5">Session Starts In:</span>
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 min-w-[75px] sm:min-w-[85px] shadow-lg">
                  <span className="text-xl sm:text-2xl font-black text-amber-400">{countdown.days || 5}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Days Left</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Dynamic Interactive Registration Panel */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/90 border border-slate-800 p-6 sm:p-7 rounded-2xl shadow-2xl relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              
              {/* Seats remaining visual feedback bar */}
              <div className="mb-5 bg-slate-950 border border-slate-800/60 p-3.5 rounded-xl">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-blue-400" />
                    Seats status
                  </span>
                  <span className="text-amber-400 font-extrabold animate-pulse">
                    Only {seatsLeft} free tickets left!
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "100%" }}
                    animate={{ width: `${(seatsLeft / 100) * 100}%` }}
                    transition={{ duration: 1 }}
                    className="bg-gradient-to-r from-blue-500 to-amber-500 h-full rounded-full"
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {!registered ? (
                  <motion.div
                    key="registration-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <h3 className="text-base font-black text-white text-left">
                      Secure Your Free Entry Ticket
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 text-left mb-4">
                      No payment required. Register now to save your credential link.
                    </p>

                    {currentUser ? (
                      /* LOGGED-IN: 1-Click Registration */
                      <div className="space-y-4">
                        <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl text-left text-xs text-slate-300">
                          <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">REGISTERING AS PARTNER</span>
                          <span className="font-extrabold text-white block">{currentUser.name}</span>
                          <span className="text-slate-400 font-mono text-[11px] block">{currentUser.email || currentUser.phone}</span>
                        </div>

                        {/* Session Timing Selector */}
                        <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl">
                          <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                            Select Session Timing
                          </label>
                          <div className="space-y-1.5">
                            {TIMING_OPTIONS.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setSelectedTiming(opt)}
                                className={`w-full text-left p-2 rounded-lg text-[11px] border transition-all flex items-center justify-between ${
                                  selectedTiming === opt
                                    ? "bg-blue-600/15 border-blue-500 text-white font-bold"
                                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-750 hover:text-slate-300"
                                }`}
                              >
                                <span>{opt.replace(" (Live Digital Marketing Workshop)", "")}</span>
                                <div className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                                  selectedTiming === opt ? "border-blue-400 bg-blue-500" : "border-slate-700 bg-transparent"
                                }`}>
                                  {selectedTiming === opt && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => handleRegister()}
                          disabled={loading}
                          className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-50"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="h-4.5 w-4.5 animate-spin" />
                              <span>Reserving seat...</span>
                            </>
                          ) : (
                            <>
                              <span>Claim Free Spot Now</span>
                              <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </button>
                        <span className="block text-[9px] text-slate-500 text-center font-medium mt-2">
                          By clicking above, you claim your live session entry ticket instantly.
                        </span>
                      </div>
                    ) : (
                      /* GUEST: Simple Credentials Form */
                      <form onSubmit={handleRegister} className="space-y-4 text-left">
                        <div>
                          <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                            Your Full Name
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Rahul Sharma"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 px-3.5 py-2.5 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                            Email or Phone Number
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. rahul@example.com"
                            value={emailOrPhone}
                            onChange={(e) => setEmailOrPhone(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 px-3.5 py-2.5 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none transition-all"
                          />
                        </div>

                        {/* Session Timing Selector */}
                        <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl">
                          <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                            Select Session Timing
                          </label>
                          <div className="space-y-1.5">
                            {TIMING_OPTIONS.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setSelectedTiming(opt)}
                                className={`w-full text-left p-2 rounded-lg text-[11px] border transition-all flex items-center justify-between ${
                                  selectedTiming === opt
                                    ? "bg-blue-600/15 border-blue-500 text-white font-bold"
                                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-750 hover:text-slate-300"
                                }`}
                              >
                                <span>{opt.replace(" (Live Digital Marketing Workshop)", "")}</span>
                                <div className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                                  selectedTiming === opt ? "border-blue-400 bg-blue-500" : "border-slate-700 bg-transparent"
                                }`}>
                                  {selectedTiming === opt && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-[#2563EB] hover:bg-blue-500 text-white font-black py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-50"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="h-4.5 w-4.5 animate-spin" />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <span>Reserve My Spot</span>
                              <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </button>

                        <div className="flex items-center justify-center gap-2 mt-3 pt-2 border-t border-slate-800/60 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                          <span>or</span>
                          <button
                            type="button"
                            onClick={onLoginClick}
                            className="text-[#F59E0B] hover:underline cursor-pointer"
                          >
                            Sign in to reserve with 1-click
                          </button>
                        </div>
                      </form>
                    )}
                  </motion.div>
                ) : (
                  /* REGISTERED SUCCESS STATE */
                  <motion.div
                    key="success-screen"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-4"
                  >
                    <div className="inline-flex bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-full mb-3">
                      <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-black text-white">
                      Seat Reserved Successfully!
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                      Congratulations {regDetails?.name}! You have secured an entry ticket to the live training on <span className="text-white font-bold">{regDetails?.workshopDate || selectedTiming}</span>.
                    </p>

                    <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl mt-4 text-left text-xs space-y-2.5">
                      <div className="flex justify-between border-b border-slate-900 pb-1.5">
                        <span className="text-slate-400 font-medium">Session Topic:</span>
                        <span className="text-white font-bold text-right truncate max-w-[180px]" title={workshopTitle}>{workshopTitle}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-900 pb-1.5">
                        <span className="text-slate-400 font-medium">Ticket ID:</span>
                        <span className="text-amber-400 font-mono font-bold uppercase">{regDetails?.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Status:</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5" /> Fully Confirmed
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 space-y-2">
                      <a
                        href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(workshopTitle)}&dates=20260705T053000Z/20260705T073000Z&details=Live+Workshop+on+AI+SEO+by+Infinite+SEO.+Ticket+ID:+${regDetails?.id}&sf=true&output=xml`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-200 hover:text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <PlayCircle className="h-4 w-4 text-amber-400" />
                        <span>Add to Google Calendar</span>
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
