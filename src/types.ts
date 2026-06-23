export interface Course {
  id: string;
  name: string;
  duration: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: "all" | "marketing" | "branding" | "freelancing" | "ai";
  iconName: string;
  popular?: boolean;
}

export interface Service {
  id: string;
  number: string;
  name: string;
  description: string;
  badge?: string;
  benefits: string[];
}

export interface StatItem {
  value: string;
  label: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  avatarSeed: string; // Used to key unique avatar illustration presets
  role: string;
  rating: number;
}

export interface WhyChooseUsItem {
  title: string;
  description: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  popular?: boolean;
  tier: "starter" | "pro" | "premium";
  description: string;
  features: string[];
}

export interface faqItem {
  id: string;
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  readTime: string;
  category: string;
  content: string;
  keyLessons: string[];
  seoKeywords: string[];
}

export interface SuccessStory {
  id: string;
  name: string;
  background: string;
  courseTaken: string;
  skillsLearned: string[];
  achievements: string[];
  highlightMetric: string; // e.g. "₹45K/mo Earned" or "$1,800/mo Contract"
  testimonialQuote: string;
  imageUrl: string;
  tag: string; // e.g. "Career Swapper", "Mother & Homemaker", "College Dropout"
}

export interface User {
  uid: string;
  name?: string;
  email?: string;
  partnerLevel?: string;
  promoCode?: string;
  createdAt?: string | any;
  updatedAt?: string | any;
}

export interface Inquiry {
  userName: string;
  userEmail: string;
  userSubject?: string;
  userMessage: string;
  createdAt?: string | any;
}

export interface Referral {
  id: string;
  name: string;
  courseSelected: string;
  coursePrice: number;
  commissionEarned: number;
  date: string;
  status: "Completed" | "Pending" | "Lead Only";
  referrerUid?: string;
  createdAt?: string;
}

