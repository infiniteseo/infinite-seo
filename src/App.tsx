/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
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
import PaymentSettingsModal from "./components/PaymentSettingsModal";
import AuthModal from "./components/AuthModal";
import SavedItemsModal from "./components/SavedItemsModal";
import WorkshopBanner from "./components/WorkshopBanner";
import CelebrationOverlay from "./components/CelebrationOverlay";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { DatabaseService } from "./services/databaseService";
import { User } from "./types";

export default function App() {
  const [selectedEnrollCourse, setSelectedEnrollCourse] = useState<string | null>(null);
  const [fbUser, setFbUser] = useState<any | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);

  // Monitor Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFbUser(user);
        // Sync user profile from Firestore / Local Cache
        try {
          const profile = await DatabaseService.getUserProfile(user.uid);
          if (profile) {
            setCurrentUser(profile);
          } else {
            const initialProfile: User = {
              uid: user.uid,
              name: user.displayName || "Learner Partner",
              email: user.email || "",
              partnerLevel: "pro"
            };
            await DatabaseService.saveUserProfile(user.uid, initialProfile);
            setCurrentUser(initialProfile);
          }
        } catch (err) {
          console.warn("Error synchronizing profile: ", err);
          setCurrentUser({
            uid: user.uid,
            name: user.displayName || "Learner Partner",
            email: user.email || "",
            partnerLevel: "pro"
          });
        }
      } else {
        setFbUser(null);
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);
  
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

  const handleExploreTrainings = () => {
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
        onExploreClick={handleExploreTrainings}
        onLoginClick={() => setShowAuthModal(true)}
        onSavedItemsClick={() => setShowSavedModal(true)}
        currentUser={currentUser}
      />

      {/* Hero section */}
      <Hero 
        onStartLearning={handleStartLearning}
        onExploreTrainings={handleExploreTrainings}
        onJoinCommunity={handleJoinCommunity}
      />

      {/* Brand Stat Badges section */}
      <Stats />

      {/* About Us section */}
      <About onExploreTrainings={handleExploreTrainings} />

      {/* Free Live Digital Marketing Workshop Section */}
      <WorkshopBanner 
        currentUser={currentUser}
        onLoginClick={() => setShowAuthModal(true)}
      />

      {/* Services Grid ( Trainings & Placement emphasis ) */}
      <Services onServiceSelect={handleServiceSelect} />

      {/* Practical Trainings with Search Filters */}
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

      {/* Floating Owner Portal for Custom Payment Configurations */}
      <PaymentSettingsModal />

      {/* Cloud-backed Login / Signup System */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* Cloud-backed User Workspace Dashboard */}
      <SavedItemsModal 
        isOpen={showSavedModal}
        onClose={() => setShowSavedModal(false)}
        user={currentUser}
      />

      {/* Global subtle celebration overlay */}
      <CelebrationOverlay />

    </div>
  );
}
