import React from "react";
import { Compass, Target, HelpCircle, GraduationCap, ArrowUpRight } from "lucide-react";

interface AboutProps {
  onExploreCourses: () => void;
}

export default function About({ onExploreCourses }: AboutProps) {
  return (
    <section id="about" className="py-24 bg-white text-slate-900 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#2563EB] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
            Who We Are
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-3 tracking-tight">
            About Infinite SEO
          </h2>
          <div className="h-1 w-12 bg-[#F59E0B] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Story Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Summary Left */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-2xl font-bold text-[#0F172A] leading-tight">
              Empowering Minds, Simplifying Entrepreneurship
            </h3>
            
            <p className="text-slate-600 text-lg leading-relaxed font-light">
              At <strong className="font-semibold text-slate-800">Infinite SEO</strong>, we believe anyone—regardless of background, past experience, or resume status—can build a successful, independent, and high-paying online career if given the proper visual training and guidance.
            </p>

            <blockquote className="border-l-4 border-[#F59E0B] pl-4 italic text-slate-700 bg-slate-50 py-3 pr-2 rounded-r-lg">
              "Our primary mission is to simplify digital entrepreneurship through practical, step-by-step learning, direct mentorship, and real-world execution."
            </blockquote>

            <p className="text-slate-600 text-sm leading-relaxed">
              We focus purely on skills that convert into economic opportunity. Whether you are a student, homemaker, creator, or small company operator, our structured educational curriculum has been engineered from the ground up to support modern digital business builders.
            </p>

            <div className="pt-4">
              <button
                id="btn-about-explore"
                onClick={onExploreCourses}
                className="inline-flex items-center space-x-2 text-[#2563EB] hover:text-blue-700 font-bold text-sm transition-colors cursor-pointer"
              >
                <span>Read curriculum pathways</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Cards Right (Vision & Mission) */}
          <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
            
            {/* Vision Panel */}
            <div className="bg-slate-50 hover:bg-slate-100/60 transition-all duration-300 p-8 rounded-2xl border border-slate-100 shadow-sm flex items-start space-x-5 group">
              <div className="p-4 bg-amber-50 group-hover:bg-[#F59E0B]/20 rounded-xl text-[#F59E0B] transition-colors shrink-0">
                <Compass className="h-7 w-7" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-[#0F172A] uppercase tracking-wide">Our Vision</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  To empower millions of aspiring digital specialists, students, and entrepreneurs globally to generate consistent income, control their schedules, and create ultimate professional freedom through modern digital skills.
                </p>
              </div>
            </div>

            {/* Mission Panel */}
            <div className="bg-slate-50 hover:bg-slate-100/60 transition-all duration-300 p-8 rounded-2xl border border-slate-100 shadow-sm flex items-start space-x-5 group">
              <div className="p-4 bg-blue-50 group-hover:bg-[#2563EB]/20 rounded-xl text-[#2563EB] transition-colors shrink-0">
                <Target className="h-7 w-7" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-[#0F172A] uppercase tracking-wide">Our Mission</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Provide highly affordable, pragmatic, and high-utility education in digital marketing, freelancing, branding, and online business strategies while backing our students with career opportunities and active communities.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
