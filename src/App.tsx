/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Courses from "./components/Courses";
import LiveTrainingsSection from "./components/LiveTrainingsSection";
import Stats from "./components/Stats";
import WhyChooseUs from "./components/WhyChooseUs";
import Testimonials from "./components/Testimonials";
import SuccessStories from "./components/SuccessStories";
import Pricing from "./components/Pricing";
import EarningDashboard from "./components/EarningDashboard";
import BlogHub from "./components/BlogHub";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  const [selectedEnrollCourse, setSelectedEnrollCourse] = useState<string | null>(null);
  
  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80; // height of sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Strategic CTAs routing logic
  const handleStartLearning = () => {
    scrollToSection("courses");
  };

  const handleExploreCourses = () => {
    scrollToSection("courses");
  };

  const handleJoinCommunity = () => {
    scrollToSection("pricing");
  };

  const handleServiceSelect = (serviceName: string) => {
    // Fill subject line in contact form and scroll there
    const subjectField = document.querySelector('input[placeholder*="Placement opportunities"]') as HTMLInputElement;
    if (subjectField) {
      subjectField.value = `Inquiry regarding: ${serviceName}`;
      // Trigger native state update if needed, but since it's simple pre-population we scroll first:
      subjectField.focus();
    }
    scrollToSection("contact");
  };

  const handlePlanInquiry = (planName: string) => {
    scrollToSection("contact");
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-amber-400 selection:text-slate-950 flex flex-col justify-between overflow-x-hidden">
      
      {/* Sticky Navigation Overlay Header */}
      <Header 
        onContactClick={() => scrollToSection("contact")}
        onExploreClick={handleExploreCourses}
      />

      {/* Hero section */}
      <Hero 
        onStartLearning={handleStartLearning}
        onExploreCourses={handleExploreCourses}
        onJoinCommunity={handleJoinCommunity}
      />

      {/* Brand Stat Badges section */}
      <Stats />

      {/* About Us section */}
      <About onExploreCourses={handleExploreCourses} />

      {/* Services Grid ( Trainings & Placement emphasis ) */}
      <Services onServiceSelect={handleServiceSelect} />

      {/* Practical Courses with Search Filters */}
      <Courses onEnrollClick={(courseName) => {
        setSelectedEnrollCourse(courseName);
        setTimeout(() => {
          scrollToSection("earning-dashboard");
        }, 120);
      }} />

      {/* Live Trainings, Placements, Internships & Certificate program section */}
      <LiveTrainingsSection onInquireClick={() => handleServiceSelect("Live Trainings, Internships & Certificate")} />

      {/* Curated "Why Choose Us" Grid */}
      <WhyChooseUs />

      {/* Interactive alumni success reviews */}
      <Testimonials />

      {/* Detailed Student Case Studies & Alumnus Submission hub */}
      <SuccessStories />

      {/* Multi-tier member rate toggle panels */}
      <Pricing onPlanInquiry={handlePlanInquiry} />

      {/* Interactive Partner Referral & Commission Earning Dashboard */}
      <EarningDashboard 
        selectedEnrollCourse={selectedEnrollCourse}
        setSelectedEnrollCourse={setSelectedEnrollCourse}
      />

      {/* 8 educational articles / SEO blog lists hub */}
      <BlogHub />

      {/* Search-capable accordions FAQ */}
      <FAQ />

      {/* Contact Form & Handles Map */}
      <Contact />

      {/* Foot sitemaps and copyrights */}
      <Footer />

    </div>
  );
}
