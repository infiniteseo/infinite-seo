import React from "react";
import { ArrowRight, Play, Sparkles, Shield, Compass, BookOpen } from "lucide-react";
import { motion } from "motion/react";

interface HeroProps {
  onStartLearning: () => void;
  onExploreTrainings: () => void;
  onJoinCommunity: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] // Premium ease-out curve
    }
  }
};

const rightColumnVariants = {
  hidden: { opacity: 0, scale: 0.95, x: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.3
    }
  }
};

export default function Hero({ onStartLearning, onExploreTrainings, onJoinCommunity }: HeroProps) {
  const skillTags = [
    "Digital Marketing", "Affiliate Marketing", "Social Media Marketing", 
    "Graphic Designing", "AI Tools", "Video Editing", "Performance Marketing", 
    "Personal Branding", "Content Creation", "Freelancing", "Communication", 
    "Sales Skills", "Money Management", "Time Management", "Personality Development",
    "Online Business"
  ];

  return (
    <section 
      id="home" 
      className="relative min-h-screen pt-28 pb-20 flex items-center bg-[#0F172A] text-white overflow-hidden"
    >
      {/* Background visual graphics - soft grid and radial lights */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35"></div>
      
      {/* Gradient glow nodes */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-[#2563EB]/15 rounded-full filter blur-3xl z-0"></div>
      <div className="absolute bottom-1/4 right-1/10 w-80 h-80 bg-[#F59E0B]/10 rounded-full filter blur-3xl z-0"></div>

      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Top Badges & Taglines */}
        <motion.div 
          className="flex flex-col md:flex-row items-center md:items-start gap-3 mb-6"
          variants={itemVariants}
        >
          <div className="inline-flex items-center space-x-2 bg-slate-800/80 border border-slate-700/60 px-4 py-1.5 rounded-full text-[#F59E0B] text-xs font-semibold uppercase tracking-wider backdrop-blur">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span id="hero-tagline-1">Build. Brand. Grow.</span>
          </div>
          <div className="inline-flex items-center space-x-2 bg-blue-900/40 border border-blue-800/40 px-4 py-1.5 rounded-full text-blue-400 text-xs font-semibold uppercase tracking-wider backdrop-blur">
            <span id="hero-tagline-2">Your Digital Success Starts Here.</span>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Left Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <motion.h1 
              id="hero-main-title"
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight"
              variants={itemVariants}
            >
              Become a Successful <br />
              <span className="bg-gradient-to-r from-[#F59E0B] via-amber-400 to-[#2563EB] bg-clip-text text-transparent">
                Digital Entrepreneur
              </span>
            </motion.h1>

            {/* Subtitle including list of skills */}
            <motion.p 
              className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light"
              variants={itemVariants}
            >
              Learn <span className="text-[#F59E0B] font-medium">digital marketing</span>, affiliate marketing, social media marketing, graphic designing, AI tools, editing, performance marketing, personal branding, content creation, freelancing, communication & sales, money & time management, personality development, and online business strategies with <span className="font-semibold text-white">Infinite SEO</span>.
            </motion.p>

            <motion.p 
              className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto lg:mx-0"
              variants={itemVariants}
            >
              Infinite SEO helps students, housewives, unexperienced, freelancers, creators, and business owners master digital skills and build profitable online brands.
            </motion.p>

            {/* Structured CTAs */}
            <motion.div 
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4"
              variants={itemVariants}
            >
              <button
                id="btn-start-learning-hero"
                onClick={onStartLearning}
                className="bg-[#F59E0B] hover:bg-amber-500 text-[#0F172A] font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-[#F59E0B]/20 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 flex items-center space-x-2 btn-font cursor-pointer"
              >
                <span>Start Learning</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                id="btn-explore-courses-hero"
                onClick={onExploreTrainings}
                className="bg-slate-800/90 hover:bg-slate-700 hover:text-white text-slate-200 border border-slate-700 px-6 py-4 rounded-xl transition-all duration-300 flex items-center space-x-2 btn-font cursor-pointer"
              >
                <BookOpen className="h-4 w-4 text-[#F59E0B]" />
                <span>Explore Trainings</span>
              </button>

              <button
                id="btn-join-community-hero"
                onClick={onJoinCommunity}
                className="bg-transparent hover:bg-blue-600/10 border-2 border-[#2563EB] hover:border-blue-500 text-white font-medium px-6 py-3.5 rounded-xl transition-all duration-300 flex items-center space-x-2 btn-font cursor-pointer"
              >
                <span>Join Community</span>
              </button>
            </motion.div>

            {/* Target Audience Bullet Highlight */}
            <motion.div 
              className="pt-6 border-t border-slate-800/80 mt-8"
              variants={itemVariants}
            >
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-3 text-center lg:text-left">
                Empowering Everyone Online
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 text-xs text-slate-400">
                <span className="flex items-center space-x-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]"></span>
                  <span>Students</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]"></span>
                  <span>Housewives</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]"></span>
                  <span>Unexperienced Beginners</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]"></span>
                  <span>Creators & Artists</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]"></span>
                  <span>Entrepreneurs</span>
                </span>
              </div>
            </motion.div>
          </div>

          {/* Graphical/Creative Right Column */}
          <motion.div 
            className="lg:col-span-5 relative flex justify-center lg:justify-end"
            variants={rightColumnVariants}
          >
            <div className="relative w-full max-w-md bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative">
              
              {/* Abs decoration circles */}
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-[#F59E0B]/20 rounded-full flex items-center justify-center animate-bounce duration-5000">
                <Sparkles className="h-5 w-5 text-[#F59E0B]" />
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <span className="text-xs text-[#F59E0B] uppercase tracking-wider font-bold">Skills Curriculum</span>
                  <span className="text-[10px] bg-[#2563EB]/20 text-[#2563EB] px-2 py-0.5 rounded-full font-semibold">16 Domains</span>
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 no-scrollbar">
                  {skillTags.map((tag, i) => (
                    <div 
                      key={tag}
                      className="p-2 sm:p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 transition-all duration-300 flex items-center space-x-1.5"
                    >
                      <span className="text-[10px] text-slate-500 font-mono">{(i+1).toString().padStart(2, '0')}</span>
                      <span className="text-xs text-slate-200 font-medium tracking-tight truncate">{tag}</span>
                    </div>
                  ))}
                </div>

                {/* Micro Placement Banner */}
                <div className="bg-gradient-to-r from-[#2563EB]/10 to-[#F59E0B]/5 border border-blue-950 p-3.5 rounded-2xl flex items-start space-x-3">
                  <div className="p-2 bg-blue-900/30 rounded-lg text-blue-400 shrink-0">
                    <Shield className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">Careers & Placements</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                      We provide direct hands-on Trainings & Career Placements in our company!
                    </p>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <p className="text-xs text-[#F59E0B] font-semibold animate-pulse hover:underline cursor-pointer" onClick={onExploreTrainings}>
                    Learn Digital Skills. Create Income. Scale Faster. &rarr;
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
