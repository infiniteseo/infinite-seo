import React, { useState } from "react";
import { SUCCESS_STORIES_DATA } from "../data";
import { SuccessStory } from "../types";
import { 
  BookOpen, 
  Award, 
  TrendingUp, 
  Briefcase, 
  Sparkles, 
  ChevronRight, 
  CheckCircle,
  Quote,
  GraduationCap,
  PlusCircle,
  X,
  Target,
  MessageSquareHeart,
  User,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect } from "react";
import { DatabaseService } from "../services/databaseService";

export default function SuccessStories() {
  const [stories, setStories] = useState<SuccessStory[]>(SUCCESS_STORIES_DATA);
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(SUCCESS_STORIES_DATA[0]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  
  // Custom submission form states
  const [formData, setFormData] = useState({
    name: "",
    tag: "Young Professional",
    background: "",
    courseTaken: "Mastery Course (1 Month Course with Internship)",
    skillsLearned: "",
    achievements: "",
    highlightMetric: "",
    testimonialQuote: ""
  });
  
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await DatabaseService.getSuccessStories();
        if (data && data.length > 0) {
          setStories(data);
          // Set selected to the loaded data's first item or match previously selected item
          setSelectedStory(prev => {
            if (prev) {
              const matched = data.find(s => s.id === prev.id);
              return matched || data[0];
            }
            return data[0];
          });
        }
      } catch (err) {
        console.error("Failed to load success stories from database service:", err);
      }
    }
    loadData();
  }, []);

  const allStories = stories;

  const handleSelectStory = (story: SuccessStory) => {
    setSelectedStory(story);
    // Smooth scroll back to case study detail area on mobile
    const el = document.getElementById("success-story-viewer");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.background || !formData.testimonialQuote || !formData.highlightMetric) {
      alert("Please fill in all required fields to share your success.");
      return;
    }

    const newStoryItem: SuccessStory = {
      id: `custom-story-${Date.now()}`,
      name: formData.name,
      tag: formData.tag,
      background: formData.background,
      courseTaken: formData.courseTaken,
      skillsLearned: formData.skillsLearned ? formData.skillsLearned.split(",").map(s => s.trim()) : ["Search Optimization", "Digital Campaigns", "Client Communication"],
      achievements: formData.achievements ? formData.achievements.split(",").map(a => a.trim()) : ["Landed remote client contract", "Boosted freelance monthly rates", "Received digital competency badge"],
      highlightMetric: formData.highlightMetric,
      testimonialQuote: formData.testimonialQuote,
      // Random professional portrait preset from Unsplash based on name length
      imageUrl: formData.name.length % 2 === 0 
        ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&h=600&q=80"
        : "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&h=600&q=80",
    };

    try {
      await DatabaseService.addSuccessStory(newStoryItem);
      const updatedStories = await DatabaseService.getSuccessStories();
      setStories(updatedStories);
      setSelectedStory(newStoryItem);
      setSubmitSuccess(true);
    } catch (err) {
      console.error("Failed to add success story strictly to database:", err);
    }
    
    // Clear form
    setFormData({
      name: "",
      tag: "Young Professional",
      background: "",
      courseTaken: "Mastery Course (1 Month Course with Internship)",
      skillsLearned: "",
      achievements: "",
      highlightMetric: "",
      testimonialQuote: ""
    });

    setTimeout(() => {
      setShowSubmitModal(false);
      setSubmitSuccess(false);
    }, 2500);
  };

  return (
    <section id="success-stories" className="py-24 bg-gradient-to-b from-white via-slate-50 to-white text-slate-900 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title and Subtitle area */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center space-x-1.5 bg-amber-500/10 text-amber-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-500/20">
            <GraduationCap className="h-4 w-4 text-amber-500" />
            <span>Graduate Case Studies</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-4 tracking-tight leading-tight">
            Our Elite Student Success Stories
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-3 font-light leading-relaxed">
            Deconstruct the real backgrounds, courses taken, technical skills mastered, and specific financial achievements of real students who scaled to corporate placements and premium freelance retainers.
          </p>
          <div className="h-1 w-12 bg-amber-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Dynamic Bento & Navigation Tab Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (lg:col-span-4) - Interactive Alumnus Sidebar Selector */}
          <div className="col-span-1 lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Select Graduate Case Study
              </span>
              <button
                id="share-your-success-story-btn"
                onClick={() => setShowSubmitModal(true)}
                className="inline-flex items-center space-x-1 text-xs text-blue-600 font-extrabold hover:text-blue-700 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Share Yours</span>
              </button>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto no-scrollbar pr-1">
              {allStories.map((story) => {
                const isSelected = selectedStory ? selectedStory.id === story.id : false;
                return (
                  <button
                    key={story.id}
                    id={`student-story-tab-${story.id}`}
                    onClick={() => handleSelectStory(story)}
                    className={`w-full text-left p-4 rounded-2xl transition-all duration-300 border flex items-center space-x-4 cursor-pointer relative ${
                      isSelected 
                        ? "bg-white border-amber-400 shadow-md scale-[1.01]" 
                        : "bg-slate-50/50 border-slate-100 hover:bg-slate-50 hover:border-slate-200"
                    }`}
                  >
                    {/* Student Mini Avatar */}
                    <div className="relative shrink-0">
                      <img 
                        src={story.imageUrl} 
                        alt={story.name} 
                        referrerPolicy="no-referrer"
                        className="h-12 w-12 rounded-xl object-cover border border-slate-100 shadow-sm"
                      />
                      {isSelected ? (
                        <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                        </span>
                      ) : null}
                    </div>

                    {/* Name & Tagline */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-slate-900 text-sm truncate">
                          {story.name}
                        </h4>
                        <span className="text-[9px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-500/10">
                          {story.tag}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] font-semibold mt-1 truncate">
                        {story.courseTaken.split("(")[0]}
                      </p>
                      <div className="flex items-center space-x-1.5 mt-1.5">
                        <TrendingUp className="h-3 w-3 text-emerald-500" />
                        <span className="text-[10px] font-bold text-emerald-600 font-mono">
                          {story.highlightMetric}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className={`h-4 w-4 transition-transform ${isSelected ? "text-amber-500 translate-x-0.5" : "text-slate-300"}`} />
                  </button>
                );
              })}
            </div>

            {/* Quick stats box for the alumni */}
            <div className="bg-[#0F172A] text-white rounded-2xl p-5 border border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <Briefcase className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <h5 className="text-xs font-black tracking-wider uppercase text-slate-400">Our Alumni Ecosystem</h5>
                  <p className="text-xs text-white font-medium mt-0.5">₹30K - ₹70K / month placed income</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 font-light leading-relaxed">
                92% of our certification graduates secure remote retainer agreements or local business assignments within forty-five days.
              </p>
              <div className="flex items-center justify-between text-[11px] font-mono font-bold text-amber-400 pt-2 border-t border-slate-800">
                <span>Total Stories: {allStories.length}</span>
                <span>Placement Rate: 92%</span>
              </div>
            </div>
          </div>

          {/* Right Column (lg:col-span-8) - Interactive Case Study Workspace Viewer */}
          <div id="success-story-viewer" className="col-span-1 lg:col-span-8">
            <AnimatePresence mode="wait">
              {!selectedStory ? (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-12 text-center h-[500px] flex flex-col items-center justify-center space-y-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
                  <p className="text-slate-400 font-medium text-xs font-mono">Loading case study database...</p>
                </div>
              ) : (
                <motion.div
                  key={selectedStory.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl border border-slate-100 shadow-lg p-6 sm:p-8 space-y-8 relative overflow-hidden"
                >
                  
                  {/* Decorative background watermark */}
                  <div className="absolute top-8 right-8 text-slate-50 opacity-[0.06] pointer-events-none z-0">
                    <GraduationCap className="h-64 w-64" />
                  </div>

                  {/* Case Study Top Header Board */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 relative z-10">
                    <div className="flex items-center space-x-5">
                      <img 
                        src={selectedStory.imageUrl} 
                        alt={selectedStory.name} 
                        referrerPolicy="no-referrer"
                        className="h-16 w-16 md:h-20 md:w-20 rounded-2xl object-cover border-2 border-amber-400 shadow-sm shrink-0"
                      />
                      <div>
                        <div className="flex items-center space-x-2.5">
                          <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-none">
                            {selectedStory.name}
                          </h3>
                          <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-500/10">
                            {selectedStory.tag}
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs mt-2 font-medium flex items-center space-x-1">
                          <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                          <span>{selectedStory.courseTaken}</span>
                        </p>
                      </div>
                    </div>

                    {/* Highlights Banner Box */}
                    <div className="bg-emerald-50 text-emerald-800 border-2 border-emerald-500/15 py-3 px-5 rounded-2xl md:text-right flex md:flex-col items-center justify-between md:justify-center gap-2 shrink-0 self-start md:self-center shadow-sm w-full md:w-auto">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 block leading-none">
                        Verified Achievement
                      </span>
                      <span className="text-base font-black font-mono leading-none md:mt-1 bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                        {selectedStory.highlightMetric}
                      </span>
                    </div>
                  </div>

                  {/* Bento Grid Content Sections */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    
                    {/* Left Column of Grid */}
                    <div className="space-y-6">
                      {/* Background Summary */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-black tracking-wider uppercase text-slate-400 flex items-center space-x-1.5">
                          <User className="h-4 w-4 text-slate-400" />
                          <span>Professional Background</span>
                        </h4>
                        <p className="text-slate-700 text-xs sm:text-sm font-light leading-relaxed">
                          {selectedStory.background}
                        </p>
                      </div>

                      {/* Testimonial Quote Form */}
                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 relative">
                        <div className="absolute top-3 left-3 opacity-10 text-slate-400 pointer-events-none">
                          <Quote className="h-10 w-10" />
                        </div>
                        <h4 className="text-[11px] font-black tracking-wider uppercase text-slate-400 mb-2.5 flex items-center space-x-1.5">
                          <MessageSquareHeart className="h-3.5 w-3.5 text-pink-500" />
                          <span>Personal Alumnus Statement</span>
                        </h4>
                        <p className="text-slate-600 text-xs italic font-light leading-relaxed pl-1 relative z-10">
                          “{selectedStory.testimonialQuote}”
                        </p>
                      </div>
                    </div>

                    {/* Right Column of Grid */}
                    <div className="space-y-6">
                      
                      {/* Skills Learned Badge Layout */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-black tracking-wider uppercase text-slate-400 flex items-center space-x-1.5">
                          <Award className="h-4 w-4 text-slate-400" />
                          <span>Mastered Digital Skills</span>
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedStory.skillsLearned.map((skill, index) => (
                            <span 
                              key={index}
                              className="text-xs font-extrabold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs inline-flex items-center space-x-1.5"
                            >
                              <CheckCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                              <span>{skill}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Specific Achievements Bullets */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-black tracking-wider uppercase text-slate-400 flex items-center space-x-1.5">
                          <Target className="h-4 w-4 text-slate-400" />
                          <span>Key Career Achievements</span>
                        </h4>
                        <ul className="space-y-3">
                          {selectedStory.achievements.map((achievement, index) => (
                            <li 
                              key={index} 
                              className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-start space-x-2.5 transition-colors"
                            >
                              <span className="p-1 bg-amber-500/10 text-amber-600 rounded mt-0.5 shrink-0">
                                <TrendingUp className="h-3 w-3" />
                              </span>
                              <span className="text-xs text-slate-700 leading-normal font-light">
                                {achievement}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>

                  </div>

                  {/* Bottom Trust Badge Row */}
                  <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono relative z-10">
                    <div className="flex items-center space-x-2 text-slate-400">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      <span>Verified case study of an active In-House / Freelance Graduate</span>
                    </div>
                    <a 
                      href="#contact"
                      className="text-blue-600 hover:text-blue-700 font-extrabold flex items-center space-x-1 group"
                    >
                      <span>Achieve Similar Results</span>
                      <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>

      {/* Share Success Modal Popup Overlay */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            
            {/* Dark background overlay */}
            <div 
              onClick={() => setShowSubmitModal(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
              aria-hidden="true"
            ></div>

            {/* Trick code to center modal content visually to the screen */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full border border-slate-100">
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Modal Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-black text-slate-900" id="modal-title">
                      Share Your Success Story
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-light">
                      Let us document your incredible achievements under Infinite SEO programs to inspire thousands!
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowSubmitModal(false)}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {submitSuccess ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <GraduationCap className="h-8 w-8 animate-bounce" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900">Successfully Submitted!</h4>
                    <p className="text-xs text-emerald-700 font-medium max-w-sm mx-auto">
                      Congratulations on your achievements! Your success story has been compiled and pinned directly to the graduate database viewer.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitStory} className="space-y-4">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">
                          Full Name *
                        </label>
                        <input 
                          type="text" 
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g. Ramesh Patel"
                          className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none"
                        />
                      </div>

                      {/* Tag */}
                      <div>
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">
                          Professional Tag *
                        </label>
                        <select 
                          name="tag"
                          value={formData.tag}
                          onChange={handleInputChange}
                          className="w-full text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2.5 bg-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none"
                        >
                          <option value="Young Professional">Young Professional</option>
                          <option value="Freelancer">Freelancer</option>
                          <option value="Agency Owner">Agency Owner</option>
                          <option value="Mother & Homemaker">Mother & Homemaker</option>
                          <option value="College Dropout">College Dropout</option>
                          <option value="Career Changer">Career Changer</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Course */}
                      <div>
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">
                          Course Enrolled *
                        </label>
                        <select 
                          name="courseTaken"
                          value={formData.courseTaken}
                          onChange={handleInputChange}
                          className="w-full text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2.5 bg-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none"
                        >
                          <option value="Basic Course (1-2 Weeks with Internship)">Basic Course</option>
                          <option value="Advance Course (2 Weeks with Internship)">Advance Course</option>
                          <option value="Mastery Course (1 Month Course with Internship)">Mastery Course</option>
                        </select>
                      </div>

                      {/* Highlight Metric */}
                      <div>
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">
                          Major Outcome Metric *
                        </label>
                        <input 
                          type="text" 
                          name="highlightMetric"
                          required
                          value={formData.highlightMetric}
                          onChange={handleInputChange}
                          placeholder="e.g. ₹50K/mo Contract or $1,200/mo"
                          className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Background */}
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">
                        Your Background Challenge *
                      </label>
                      <textarea 
                        name="background"
                        required
                        rows={2}
                        value={formData.background}
                        onChange={handleInputChange}
                        placeholder="Explain briefly where you started (e.g., Unemployed college graduate from Pune with zero guidance)."
                        className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none"
                      />
                    </div>

                    {/* Testimonial Quote */}
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">
                        Alumnus Personal Statement *
                      </label>
                      <textarea 
                        name="testimonialQuote"
                        required
                        rows={2}
                        value={formData.testimonialQuote}
                        onChange={handleInputChange}
                        placeholder="Write a heartfelt quote detailing how Infinite SEO's live workshops, internship context, or placements helped you."
                        className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Skills Learned */}
                      <div>
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">
                          Skills Learned (Comma Separated)
                        </label>
                        <input 
                          type="text" 
                          name="skillsLearned"
                          value={formData.skillsLearned}
                          onChange={handleInputChange}
                          placeholder="SEO Audit, LinkedIn Strategy, Client Closing"
                          className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none"
                        />
                      </div>

                      {/* Achievements */}
                      <div>
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">
                          Achievements (Comma Separated)
                        </label>
                        <input 
                          type="text" 
                          name="achievements"
                          value={formData.achievements}
                          onChange={handleInputChange}
                          placeholder="Landed US client, Received experience cert, Placed"
                          className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Submit and Cancel Buttons */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowSubmitModal(false)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black uppercase tracking-widest rounded-lg transition-colors shadow-sm cursor-pointer"
                      >
                        Submit Alumnus Record
                      </button>
                    </div>

                  </form>
                )}

              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
