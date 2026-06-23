import React from "react";
import { 
  Tv, 
  Briefcase, 
  Award, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Coins,
  ShieldCheck
} from "lucide-react";
// @ts-ignore
import mentorImg from "../assets/images/enhanced_mentor_pic_1779362555567.png";
// @ts-ignore
import handshakeImg from "../assets/images/placement_deal_1779293930061.png";
// @ts-ignore
import journeyImg from "../assets/images/success_journey_1779293945995.png";

interface LiveTrainingsSectionProps {
  onInquireClick: () => void;
}

export default function LiveTrainingsSection({ onInquireClick }: LiveTrainingsSectionProps) {
  const coreFeatures = [
    {
      id: "feat-live",
      icon: <Tv className="h-6 w-6 text-amber-500" />,
      title: "Interactive Live Trainings",
      badge: "Real-Time Cohorts",
      desc: "Attend weekly live webinars, screenshare doubt clearances, and participate in interactive Q&As where we explain in-depth concept detailings. Rest assured, all sessions are recorded for permanent review.",
      benefits: ["Weekly Live Workshops", "Continuous Doubt Clearance", "Dedicated WhatsApp Group Assist", "Free Source Files & Templates"]
    },
    {
      id: "feat-placement",
      icon: <Briefcase className="h-6 w-6 text-blue-500" />,
      title: "Direct In-Company Placement",
      badge: "Infinite SEO Careers",
      desc: "Top performers from our training batches are directly hired into the active Infinite SEO team! Get placed to build organic client-facing setups, write professional audits, or manage targeted marketing runs.",
      benefits: ["Priority In-House Selection", "Real Agency Employment", "Active Professional Sittings", "Global Partner Direct Referrals"]
    },
    {
      id: "feat-internship",
      icon: <Sparkles className="h-6 w-6 text-emerald-500" />,
      title: "Guaranteed Corporate Internships",
      badge: "Live Projects Scope",
      desc: "Every single student gets a guaranteed internship setup from day one! Work on live client websites, gain hands-on marketing experience, solve real bottlenecks, and earn an active experience letter.",
      benefits: ["100% Guaranteed Spot", "Live Industry Case-Studies", "Work Reference Letters", "Hands-on Practical Tasks"]
    },
    {
      id: "feat-certificate",
      icon: <Award className="h-6 w-6 text-purple-500" />,
      title: "Verified Skill Certification",
      badge: "Industry Accredited",
      desc: "Convert your dedication into verified proof. Receive an official certificate of completion signed by company directors, making it highly authoritative to embed on LinkedIn and secure premium freelance gigs.",
      benefits: ["Shareable LinkedIn Badge", "Printable High-Res Copy", "Direct Recruiter Validation", "Adds Standout Portfolio Power"]
    }
  ];

  return (
    <section id="live-trainings" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center space-x-1.5 bg-amber-500/15 text-amber-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-500/25">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Company Ecosystem</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
            We Provide Live Trainings & Placement in Our Company
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-3 font-light leading-relaxed">
            But that's not all—we also provide guaranteed <strong>Internships & Certificate</strong> programs with every enrollment path to make sure you start with solid, practical proof-of-work.
          </p>
          <div className="h-1 w-16 bg-amber-400 mx-auto mt-5 rounded-full"></div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {coreFeatures.map((item) => (
            <div 
              key={item.id}
              className="bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/60 hover:border-slate-600 rounded-3xl p-6 sm:p-8 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Icon & Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-slate-900 rounded-2xl group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/15">
                    {item.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-extrabold text-white mb-3 tracking-tight">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light mb-6">
                  {item.desc}
                </p>
              </div>

              {/* Benefits checklist */}
              <div className="pt-6 border-t border-slate-700/50 space-y-3">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block mb-1">
                  Highlights Include:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {item.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center space-x-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span className="truncate">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Dynamic Transition, Income & Placement Guarantee Section */}
        <div className="mt-24 border-t border-slate-800/85 pt-16">
          {/* Section Sub-Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center space-x-1.5 bg-blue-500/10 text-blue-400 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-500/25 animate-pulse">
              <Coins className="h-3.5 w-3.5 text-blue-400 animate-spin-slow" />
              <span>Career Income Blueprint</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-4 tracking-tight leading-tight">
              Earn ₹30K to ₹40K Part-Time & ₹60K to ₹70K Full-Time Every Month
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-3 font-normal max-w-2xl mx-auto leading-relaxed">
              We don't just teach conceptual detailings—we secure your professional livelihood. Once you achieve your verified digital certification, our guaranteed company placement unlocks your journey to active recurring monthly income.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
              <div className="flex items-center space-x-2 bg-slate-800/60 shadow-sm px-4 py-2 rounded-xl border border-slate-700/50">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-bold text-slate-200">Placement Guaranteed After Certification</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-800/60 shadow-sm px-4 py-2 rounded-xl border border-slate-700/50">
                <TrendingUp className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="text-xs font-bold text-slate-200">100% Practical In-House Projects</span>
              </div>
            </div>
          </div>

          {/* Three Column Media Cards Group */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Card 1: Mentorship */}
            <div className="bg-slate-800/30 rounded-3xl border border-slate-800/80 overflow-hidden group hover:border-[#F59E0B] transition-all duration-300 shadow-md">
              <div className="aspect-[3/4] overflow-hidden relative bg-slate-900 border-b border-slate-800">
                <img 
                  src={mentorImg} 
                  alt="In-depth Concept Detailings with Live Mentors" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur border border-slate-800/50 text-amber-400 text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md">
                  Phase 1 // Live Trainings
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-extrabold text-white text-base tracking-tight mb-2 group-hover:text-amber-400 transition-colors">
                  In-Depth Live Mentorship
                </h4>
                <p className="text-slate-400 text-xs font-light leading-relaxed">
                  Learn live directly under company founders who explain critical website audits, client pitches, search strategies, and daily campaign optimizations in comprehensive step-by-step detailings.
                </p>
              </div>
            </div>

            {/* Card 2: Student Transformation ($0 to $1000) */}
            <div className="bg-slate-800/30 rounded-3xl border border-slate-800/80 overflow-hidden group hover:border-[#10B981] transition-all duration-300 shadow-md">
              <div className="aspect-[3/4] overflow-hidden relative bg-slate-900 border-b border-slate-800">
                <img 
                  src={journeyImg} 
                  alt="Student Livelihood Transformation from $0 to $1000" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur border border-slate-800/50 text-emerald-400 text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md">
                  Phase 2 // Financial Freedom
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-extrabold text-white text-base tracking-tight mb-2 group-hover:text-emerald-400 transition-colors">
                  Laptop-Empowered Growth
                </h4>
                <p className="text-slate-400 text-xs font-light leading-relaxed">
                  Go from absolute zero background to a confident high-income digital operator. Unlock financial freedom, work from anywhere on your terms, and completely eliminate career stress.
                </p>
              </div>
            </div>

            {/* Card 3: In-Company Placement */}
            <div className="bg-slate-800/30 rounded-3xl border border-slate-800/80 overflow-hidden group hover:border-[#3B82F6] transition-all duration-300 shadow-md">
              <div className="aspect-[3/4] overflow-hidden relative bg-slate-900 border-b border-slate-800">
                <img 
                  src={handshakeImg} 
                  alt="Direct In-Company Placement Deal" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur border border-slate-800/50 text-blue-400 text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md">
                  Phase 3 // Corporate Placement
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-extrabold text-white text-base tracking-tight mb-2 group-hover:text-blue-400 transition-colors">
                  Guaranteed Company Selection
                </h4>
                <p className="text-slate-400 text-xs font-light leading-relaxed">
                  Receive guaranteed legal internship sittings and a direct legal appointment. Earn ₹30K-₹40K part-time or ₹60K-₹70K full-time every single month handling our real search campaigns.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Quick CTA box inside */}
        <div className="mt-16 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 rounded-3xl p-6 sm:p-10 max-w-4xl mx-auto shadow-xl text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              Ready to claim your internship & certificate?
            </h4>
            <p className="text-slate-800 text-xs sm:text-sm mt-1.5 font-medium max-w-xl">
              Get direct live mentorship, real commercial client access, in-house team placements, and accreditive qualifications right now with no prior experience needed.
            </p>
          </div>
          <button
            onClick={onInquireClick}
            className="px-6 py-4 bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow transition-all duration-300 shrink-0 inline-flex items-center space-x-2 hover:translate-x-1 cursor-pointer"
          >
            <span>Talk to an Expert Counselor</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
