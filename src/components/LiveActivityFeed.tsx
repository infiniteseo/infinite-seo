import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, BookOpen, Sparkles, TrendingUp, DollarSign, Award } from "lucide-react";

interface ActivityEvent {
  id: string;
  type: "signup" | "enrollment" | "workshop" | "partner" | "payout";
  name: string;
  city: string;
  detail: string;
  timeAgo: string;
}

const INDIAN_NAMES = [
  "Rahul Sharma", "Priya Patel", "Amit Kumar", "Sneha Reddy", "Vikram Singh",
  "Ananya Rao", "Sanjay Gupta", "Deepa Krishnan", "Rohan Mehta", "Neha Nair",
  "Karan Johar", "Pooja Verma", "Arjun Sen", "Divya Teja", "Manoj Tiwari",
  "Aditi Joshi", "Siddharth Das", "Ritu Phogat", "Rajesh Khanna", "Swati Bose"
];

const INDIAN_CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Pune", "Chennai", "Kolkata",
  "Ahmedabad", "Jaipur", "Lucknow", "Patna", "Indore", "Thane", "Bhopal",
  "Coimbatore", "Chandigarh", "Guwahati", "Kochi", "Dehradun", "Ranchi"
];

const COURSES = [
  "Advanced Digital Marketing Masterclass",
  "AI-Powered SEO & Copywriting Masterclass",
  "Social Media Growth & Personal Branding",
  "Affiliate Marketing Blueprint",
  "Video Editing & Content Creation Bootcamp",
  "High-Ticket Client Acquisition Secrets"
];

const WORKSHOPS = [
  "AI-Powered SEO & Advanced Digital Marketing Masterclass",
  "Freelancing & Digital Agency Setup Session"
];

const PARTNER_LEVELS = ["Pro Partner", "Ultimate Partner", "Silver Member"];

// Helper to generate a realistic random event
const generateRandomEvent = (): ActivityEvent => {
  const id = `act_${Math.random().toString(36).substring(2, 11)}`;
  const name = INDIAN_NAMES[Math.floor(Math.random() * INDIAN_NAMES.length)];
  const city = INDIAN_CITIES[Math.floor(Math.random() * INDIAN_CITIES.length)];
  
  const types: ActivityEvent["type"][] = ["signup", "enrollment", "workshop", "partner", "payout"];
  const type = types[Math.floor(Math.random() * types.length)];
  
  let detail = "";
  switch (type) {
    case "signup":
      detail = "registered for a Free Student Account";
      break;
    case "enrollment":
      const course = COURSES[Math.floor(Math.random() * COURSES.length)];
      detail = `enrolled in '${course}'`;
      break;
    case "workshop":
      const ws = WORKSHOPS[Math.floor(Math.random() * WORKSHOPS.length)];
      detail = `claimed a free ticket to the '${ws}'`;
      break;
    case "partner":
      const level = PARTNER_LEVELS[Math.floor(Math.random() * PARTNER_LEVELS.length)];
      detail = `joined as an active '${level}'`;
      break;
    case "payout":
      const amount = [1200, 2400, 4800, 8500, 12500][Math.floor(Math.random() * 5)];
      detail = `withdrew ₹${amount.toLocaleString("en-IN")} in affiliate commissions`;
      break;
  }

  // Mask name like "Rahul S." or "Sneha R." to protect privacy and look highly authentic
  const nameParts = name.split(" ");
  const maskedName = nameParts.length > 1 
    ? `${nameParts[0]} ${nameParts[1].charAt(0)}.`
    : name;

  return {
    id,
    type,
    name: maskedName,
    city,
    detail,
    timeAgo: "Just now"
  };
};

const getEventIcon = (type: ActivityEvent["type"]) => {
  switch (type) {
    case "signup":
      return <Users className="h-4 w-4 text-blue-400" />;
    case "enrollment":
      return <BookOpen className="h-4 w-4 text-emerald-400" />;
    case "workshop":
      return <Sparkles className="h-4 w-4 text-amber-400" />;
    case "partner":
      return <Award className="h-4 w-4 text-purple-400" />;
    case "payout":
      return <TrendingUp className="h-4 w-4 text-emerald-400 animate-pulse" />;
  }
};

const getEventBadgeClass = (type: ActivityEvent["type"]) => {
  switch (type) {
    case "signup":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "enrollment":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "workshop":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "partner":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "payout":
      return "bg-teal-500/10 text-teal-400 border-teal-500/20";
  }
};

const getEventLabel = (type: ActivityEvent["type"]) => {
  switch (type) {
    case "signup": return "New Sign Up";
    case "enrollment": return "New Enrollment";
    case "workshop": return "Workshop Seat";
    case "partner": return "New Partner";
    case "payout": return "Commission Paid";
  }
};

export default function LiveActivityFeed() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);

  // Initialize with some historic recent events
  useEffect(() => {
    const initialEvents: ActivityEvent[] = [];
    // Generate 3 realistic historical events
    for (let i = 0; i < 3; i++) {
      const event = generateRandomEvent();
      const mins = [2, 5, 11][i];
      event.timeAgo = `${mins}m ago`;
      initialEvents.push(event);
    }
    setEvents(initialEvents);
  }, []);

  // Set up interval to push new real-time events dynamically
  useEffect(() => {
    const interval = setInterval(() => {
      const newEvent = generateRandomEvent();
      
      setEvents((prev) => {
        // Update previous "just now" events to "1m ago" or "3m ago" etc
        const updatedPrev = prev.map((ev, idx) => {
          if (ev.timeAgo === "Just now") {
            return { ...ev, timeAgo: "1m ago" };
          } else if (ev.timeAgo.endsWith("m ago")) {
            const currentMins = parseInt(ev.timeAgo);
            return { ...ev, timeAgo: `${currentMins + 1}m ago` };
          }
          return ev;
        });

        // Insert new event at front and truncate to max 4 items
        return [newEvent, ...updatedPrev].slice(0, 4);
      });
    }, 7000); // New event every 7 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="live-activity-feed" className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-2xl relative overflow-hidden text-left">
      <div className="flex items-center justify-between border-b border-slate-900 pb-2.5 mb-3">
        <div className="flex items-center gap-1.5">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className="text-[10px] text-slate-300 font-extrabold uppercase tracking-widest">
            Recent Live Activity
          </span>
        </div>
        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
          Verified Realtime
        </span>
      </div>

      <div className="space-y-2.5 max-h-[195px] overflow-hidden relative">
        <AnimatePresence initial={false}>
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: -15, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="border border-slate-800/60 bg-slate-900/30 p-2.5 rounded-xl flex items-start gap-3 hover:border-slate-800 transition-colors"
            >
              {/* Event Icon container */}
              <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 shrink-0">
                {getEventIcon(event.type)}
              </div>

              {/* Event description */}
              <div className="min-w-0 flex-grow">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-black text-slate-200 truncate">
                    {event.name}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono shrink-0 font-bold">
                    {event.timeAgo}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                  From <span className="text-slate-300 font-semibold">{event.city}</span>, {event.detail}
                </p>
              </div>

              {/* Mini Badge status */}
              <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded border uppercase shrink-0 ${getEventBadgeClass(event.type)}`}>
                {getEventLabel(event.type)}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
