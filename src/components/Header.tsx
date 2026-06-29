import React, { useState, useEffect } from "react";
import { Menu, X, Sparkles, BookOpen, LogOut, FolderSync, User as UserIcon } from "lucide-react";
import { User } from "../types";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

interface HeaderProps {
  onContactClick: () => void;
  onExploreClick: () => void;
  onLoginClick: () => void;
  onSavedItemsClick: () => void;
  currentUser: User | null;
}

export default function Header({ 
  onContactClick, 
  onExploreClick, 
  onLoginClick, 
  onSavedItemsClick, 
  currentUser 
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Track active section
      const sections = ["home", "about", "services", "courses", "why-us", "success-stories", "pricing", "earning-dashboard", "blog", "faq"];
      const current = sections.find((sect) => {
        const el = document.getElementById(sect);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 120 && rect.bottom >= 120;
        }
        return false;
      });
      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home", id: "home-link" },
    { name: "About Us", href: "#about", id: "about-link" },
    { name: "Services", href: "#services", id: "services-link" },
    { name: "Trainings", href: "#courses", id: "courses-link" },
    { name: "Why Us", href: "#why-us", id: "why-us-link" },
    { name: "Success Stories", href: "#success-stories", id: "success-stories-link" },
    { name: "Agency Pricing", href: "#pricing", id: "pricing-link" },
    { name: "Earnings 💰", href: "#earning-dashboard", id: "earning-link" },
    { name: "Learning Hub", href: "#blog", id: "blog-link" },
    { name: "FAQ", href: "#faq", id: "faq-link" },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      const offset = 80; // height of sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = targetElement.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <header
      id="main-navigation-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0F172A]/90 backdrop-blur-md shadow-lg border-b border-slate-800 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleNavClick("#home")}>
            <div className="bg-gradient-to-r from-[#2563EB] to-[#F59E0B] p-2 rounded-xl shadow-md">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-[#F59E0B] bg-clip-text text-transparent">
                INFINITE SEO
              </span>
              <p className="text-[9px] text-slate-400 tracking-widest font-bold -mt-1 uppercase">
                Digital Success
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                id={link.id}
                onClick={() => handleNavClick(link.href)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                  activeSection === link.href.replace("#", "")
                    ? "text-[#F59E0B] bg-slate-800/60 font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/40"
                }`}
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* User Call to Action Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <button
              id="desktop-explore-cta"
              onClick={onExploreClick}
              className="text-xs text-slate-300 hover:text-[#F59E0B] px-3 py-2 transition-colors cursor-pointer font-medium"
            >
              Explore Trainings
            </button>
            
            {currentUser ? (
              <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 p-1.5 pl-3 rounded-xl shadow-lg">
                <div className="flex flex-col text-left pr-2 border-r border-slate-800">
                  <span className="text-xs font-extrabold text-slate-200 truncate max-w-[120px]" title={currentUser.name}>
                    {currentUser.name}
                  </span>
                  <button
                    onClick={() => signOut(auth)}
                    className="text-[10px] text-red-400 hover:text-red-300 font-bold hover:underline text-left mt-0.5 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <LogOut className="h-2.5 w-2.5" />
                    <span>Logout</span>
                  </button>
                </div>
                
                <button
                  onClick={onSavedItemsClick}
                  className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 font-bold transition-all cursor-pointer"
                  title="My Saved Workspace"
                >
                  <FolderSync className="h-3.5 w-3.5" />
                  <span>My Saved Items</span>
                </button>
                
                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-amber-500 text-white font-extrabold text-[11px] flex items-center justify-center uppercase shadow-inner select-none shrink-0">
                  {currentUser.name ? currentUser.name.substring(0, 2) : "LP"}
                </div>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="bg-[#2563EB] hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform active:scale-95 cursor-pointer btn-font"
              >
                Login / Sign Up
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div id="mobile-navigation-dropdown" className="lg:hidden absolute top-full left-0 right-0 bg-[#0F172A] border-b border-slate-800 shadow-2xl animate-fade-in-down">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 cursor-pointer ${
                  activeSection === link.href.replace("#", "")
                    ? "text-[#F59E0B] bg-slate-800 font-bold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {link.name}
              </button>
            ))}
            <div className="pt-4 pb-2 border-t border-slate-800 px-4 flex flex-col space-y-3">
              {currentUser ? (
                <>
                  <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-3.5 rounded-xl mb-1 shadow-md">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-blue-600 to-amber-500 text-white font-extrabold text-sm flex items-center justify-center uppercase shadow-inner">
                      {currentUser.name ? currentUser.name.substring(0, 2) : "LP"}
                    </div>
                    <div className="min-w-0 flex-grow text-left">
                      <span className="text-sm font-black text-slate-100 truncate block">{currentUser.name}</span>
                      <span className="text-xs text-slate-400 truncate block font-mono">{currentUser.email || currentUser.phone}</span>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          signOut(auth);
                        }}
                        className="text-[11px] text-red-400 hover:text-red-300 font-bold hover:underline mt-1.5 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <LogOut className="h-3 w-3" />
                        <span>Logout / Sign Out</span>
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onSavedItemsClick();
                    }}
                    className="w-full text-center py-3 text-sm font-bold bg-amber-500/10 hover:bg-amber-500/20 text-[#F59E0B] border border-amber-500/20 rounded-lg shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <FolderSync className="h-4 w-4" />
                    <span>My Saved Items</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onLoginClick();
                  }}
                  className="w-full text-center py-3 text-sm font-bold bg-[#2563EB] hover:bg-blue-500 text-white rounded-lg shadow-md cursor-pointer"
                >
                  Login / Sign Up
                </button>
              )}
              
              <button
                id="mobile-explore-cta"
                onClick={() => {
                  setIsOpen(false);
                  onExploreClick();
                }}
                className="w-full text-center py-2.5 text-sm font-medium text-slate-300 hover:text-white border border-slate-700 rounded-lg cursor-pointer"
              >
                Browse Our Trainings
              </button>
              <button
                id="mobile-contact-cta"
                onClick={() => {
                  setIsOpen(false);
                  onContactClick();
                }}
                className="w-full text-center py-3 text-sm font-bold bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-[#0F172A] rounded-lg shadow-md cursor-pointer"
              >
                Register & Get Mentored
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
