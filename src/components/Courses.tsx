import React, { useState } from "react";
import { COURSES_DATA } from "../data";
import { Course } from "../types";
import { 
  Megaphone, 
  Briefcase, 
  Cpu, 
  Clock, 
  Sparkles,
  CheckCircle2,
  X,
  Award,
  BookOpen
} from "lucide-react";

interface CoursesProps {
  onEnrollClick: (courseName: string) => void;
}

export default function Courses({ onEnrollClick }: CoursesProps) {
  // Callback popup state
  const [callbackCourse, setCallbackCourse] = useState<string | null>(null);
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [enrollSubmitted, setEnrollSubmitted] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Local state to toggle between "topics" and "perks" on each course card
  const [cardTab, setCardTab] = useState<Record<string, "topics" | "perks">>({
    "course-basic": "topics",
    "course-advance": "topics",
    "course-mastery": "topics",
  });

  const getCourseTopics = (courseId: string) => {
    switch (courseId) {
      case "course-basic":
        return [
          "Digital Marketing",
          "Affiliate Marketing",
          "Social Media Marketing",
          "Content Creation",
          "Influencer Marketing",
          "Ads Campaigns",
          "Communication Skills & Sales Marketing"
        ];
      case "course-advance":
        return [
          "Digital Marketing",
          "Affiliate Marketing",
          "Social Media Marketing",
          "Content Creation",
          "Influencer Marketing",
          "Email Marketing",
          "Performance Marketing",
          "AI Tools",
          "Editing",
          "Ads Campaigns",
          "Poster Making",
          "Communication Skills & Sales Marketing"
        ];
      case "course-mastery":
        return [
          "Digital Marketing",
          "Affiliate Marketing",
          "Social Media Marketing",
          "Content Creation",
          "Influencer Marketing",
          "Email Marketing",
          "Performance Marketing",
          "AI Tools",
          "Editing",
          "Graphic Design",
          "Business Card Making",
          "Poster Making",
          "Ads Campaigns",
          "Communication Skills & Sales Marketing",
          "Personality Development"
        ];
      default:
        return [];
    }
  };

  const getCourseIcon = (iconName: string) => {
    switch (iconName) {
      case "Megaphone":
        return <Megaphone className="h-6 w-6 text-amber-500" />;
      case "Briefcase":
        return <Briefcase className="h-6 w-6 text-blue-500" />;
      case "Cpu":
        return <Cpu className="h-6 w-6 text-purple-500" />;
      default:
        return <Sparkles className="h-6 w-6 text-amber-500" />;
    }
  };

  const getCourseHighlights = (courseId: string) => {
    switch (courseId) {
      case "course-basic":
        return [
          "In-Depth Concepts (We Teach in Detailings)",
          "Digital Marketing Essentials",
          "Foundational Organic Funnels",
          "Guaranteed Internship Ticket",
          "Dedicated Live Query Support"
        ];
      case "course-advance":
        return [
          "In-Depth Concepts (We Teach in Detailings)",
          "High-Yield Ad Campaign Setup",
          "Personal Authoritative Brand Build",
          "Guaranteed Internship Experience",
          "Resume & Portfolio Polishing Checklist"
        ];
      case "course-mastery":
        return [
          "In-Depth Concepts (We Teach in Detailings)",
          "Exclusive Elite 1-on-1 Sessions",
          "High-Ticket Client Acquisition Frameworks",
          "Guaranteed Agency Workspace Internship",
          "Guaranteed Interview Sittings & Direct Referrals"
        ];
      default:
        return ["Hands-on Curriculum Modules", "Guaranteed Internship Allocation"];
    }
  };

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentEmail.trim() || !studentPhone.trim()) {
      setValidationError("Please fill out all contact fields.");
      return;
    }
    setValidationError("");
    setEnrollSubmitted(true);
    setTimeout(() => {
      // Clear up state
      setEnrollSubmitted(false);
      setCallbackCourse(null);
      setStudentName("");
      setStudentEmail("");
      setStudentPhone("");
    }, 4000);
  };

  return (
    <section id="courses" className="py-24 bg-white text-slate-900 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#2563EB] uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
            Guaranteed Internship Curriculums
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-4 tracking-tight">
            Our Premium Training Paths
          </h2>
          <p className="text-slate-600 text-sm mt-3 font-light leading-relaxed">
            Choose your learning tier. All our programs are structured meticulously with live instruction, practical industry modules, and an active guaranteed internship framework to help you monetize your digital specialization.
          </p>
          <div className="h-1.5 w-16 bg-[#F59E0B] mx-auto mt-5 rounded-full"></div>
        </div>

        {/* Limited Time Offer Ticker/Banner */}
        <div className="max-w-5xl mx-auto mb-10">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4 shadow-md text-center border border-amber-400/20">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 relative z-10 text-xs sm:text-sm font-bold tracking-wide">
              <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest text-white border border-white/10">
                🔥 Limited Time Offer
              </span>
              <span className="text-center font-extrabold">
                Enroll and grab it now!
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic 3-Column Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {COURSES_DATA.map((course) => (
            <div 
              key={course.id}
              className={`bg-white rounded-3xl border transition-all duration-300 flex flex-col h-full overflow-hidden relative ${
                course.popular 
                  ? "border-amber-400 shadow-md ring-1 ring-amber-400 ring-opacity-20 scale-102 md:scale-105 z-10 hover:shadow-xl" 
                  : "border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-lg"
              } group`}
            >
              {course.popular && (
                <div className="absolute top-4 right-4 bg-amber-400 text-slate-950 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-sm z-10 flex items-center space-x-1">
                  <Sparkles className="h-3 w-3" />
                  <span>Most Popular Choice</span>
                </div>
              )}

              {/* Header Visual Stripe */}
              <div className={`h-4 ${
                course.id === 'course-basic' 
                  ? 'bg-amber-400' 
                  : course.id === 'course-advance' 
                  ? 'bg-blue-500' 
                  : 'bg-purple-600'
              }`}></div>

              {/* Course Detail Core */}
              <div className="p-8 flex-grow flex flex-col">
                
                {/* Header Icon, ID Prefix & Duration */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-3 rounded-2xl ${
                    course.id === 'course-basic' 
                      ? 'bg-amber-50' 
                      : course.id === 'course-advance' 
                      ? 'bg-blue-50' 
                      : 'bg-purple-50'
                  }`}>
                    {getCourseIcon(course.iconName)}
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-500 font-mono text-xs font-medium bg-slate-100 px-3 py-1 rounded-full">
                    <Clock className="h-3.5 w-3.5 text-slate-500" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                {/* Course Name */}
                <h3 className="text-xl font-extrabold text-[#0F172A] tracking-tight group-hover:text-[#2563EB] transition-all mb-3">
                  {course.name}
                </h3>

                {/* Sub text */}
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-light min-h-[64px]">
                  {course.description}
                </p>

                {/* Curriculum Perks & Syllabus Toggle Tabs */}
                <div className="mb-6 flex-grow flex flex-col">
                  {/* Interactive Tab Switcher */}
                  <div className="flex p-1 bg-slate-100 rounded-xl mb-4 border border-slate-200/50">
                    <button
                      type="button"
                      onClick={() => setCardTab(prev => ({ ...prev, [course.id]: "topics" }))}
                      className={`flex-1 text-center py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-150 cursor-pointer ${
                        cardTab[course.id] === "topics"
                          ? "bg-white text-[#2563EB] shadow-sm font-semibold"
                          : "text-slate-500 hover:text-slate-700 font-medium"
                      }`}
                    >
                      Syllabus Modules
                    </button>
                    <button
                      type="button"
                      onClick={() => setCardTab(prev => ({ ...prev, [course.id]: "perks" }))}
                      className={`flex-1 text-center py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-150 cursor-pointer ${
                        cardTab[course.id] === "perks"
                          ? "bg-white text-[#2563EB] shadow-sm font-semibold"
                          : "text-slate-500 hover:text-slate-700 font-medium"
                      }`}
                    >
                      Internship Perks
                    </button>
                  </div>

                  {cardTab[course.id] === "topics" ? (
                    <div className="space-y-2 flex-grow">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5 text-[#2563EB]" />
                        <span>Syllabus Topics ({getCourseTopics(course.id).length})</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 max-h-[196px] overflow-y-auto pr-1">
                        {getCourseTopics(course.id).map((topic, keyIndex) => (
                          <span 
                            key={keyIndex}
                            className="text-[10px] sm:text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-50 text-slate-700 border border-slate-200/60 hover:border-blue-500/30 hover:bg-blue-50/40 transition-all duration-150"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5 flex-grow">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                        <span>Included Practical Perks</span>
                      </div>
                      <div className="space-y-2">
                        {getCourseHighlights(course.id).map((perk, idx) => (
                          <div key={idx} className="flex items-start space-x-2">
                            <Award className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="text-slate-700 text-xs sm:text-sm font-medium">{perk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>



                {/* Pricing detail */}
                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-3xl font-black text-[#0F172A]">
                        ₹{course.price.toLocaleString("en-IN")}
                      </span>
                      {course.originalPrice && (
                        <span className="text-xs sm:text-sm text-slate-400 line-through font-medium">
                          ₹{course.originalPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                    {course.originalPrice && (
                      <span className="inline-block text-[9px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-200/50 px-1.5 py-0.5 rounded-md mt-1 mb-0.5">
                        Save ₹{(course.originalPrice - course.price).toLocaleString("en-IN")} ({Math.round(((course.originalPrice - course.price) * 100) / course.originalPrice)}% OFF)
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-widest mt-0.5">
                      Total Course Fee
                    </span>
                  </div>
                  <button
                    onClick={() => onEnrollClick(course.name)}
                    className={`font-semibold text-xs px-5 py-3 rounded-xl transition-all duration-200 uppercase tracking-wider cursor-pointer shadow-sm shrink-0 ${
                      course.popular
                        ? "bg-[#2563EB] hover:bg-slate-900 text-white"
                        : "bg-[#0F172A] hover:bg-slate-800 text-white"
                    }`}
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Enroll Interest Request Popup */}
      {callbackCourse && (
        <div id="enrollment-popup-overlay" className="fixed inset-0 z-100 bg-[#0F172A]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-slate-100 animated zoomIn">
            
            {/* Close */}
            <button 
              onClick={() => setCallbackCourse(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* If Submitted Success state */}
            {enrollSubmitted ? (
              <div className="text-center py-6 space-y-4">
                <div className="mx-auto h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-2">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h4 className="text-xl font-bold text-[#0F172A]">Callback Spot Reserved!</h4>
                <p className="text-slate-600 text-xs sm:text-sm font-light">
                  Thank you for your interest in <strong>{callbackCourse}</strong>. We have registered your inquiry details and a master counsellor from Infinite SEO will reach you via WhatsApp or phone within 2 hours.
                </p>
                <div className="text-[11px] text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-dashed border-slate-200">
                  Confirmation logged for <span className="font-semibold">{studentEmail}</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEnrollSubmit} className="space-y-4">
                <div className="mb-2">
                  <span className="text-[10px] bg-blue-100 text-[#2563EB] px-2.5 py-1 rounded-full uppercase tracking-wider font-bold">
                    Class Callback Registration
                  </span>
                  <h4 className="text-lg font-bold text-[#0F172A] mt-2">
                    Inquire: {callbackCourse}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter your active details to request curriculum modules, schedules, and active placement details.
                  </p>
                </div>

                {validationError && (
                  <p className="text-xs font-medium text-red-600">{validationError}</p>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="e.g. student@gmail.com"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">
                    WhatsApp or mobile Number (+91)
                  </label>
                  <input
                    type="tel"
                    required
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    placeholder="e.g. +91 99679 77824"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-[#0F172A] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all duration-200 cursor-pointer"
                  >
                    Request Instant Guidance Call
                  </button>
                </div>
              </form>
            )}

            <div className="mt-4 pt-4 border-t border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 font-medium">
                Live placement training. Certificate shared on completion.
              </span>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
