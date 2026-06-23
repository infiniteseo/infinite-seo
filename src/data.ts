import { Course, Service, StatItem, Testimonial, PricingPlan, faqItem, BlogPost, SuccessStory } from "./types";

export const SERVICES_DATA: Service[] = [
  {
    id: "service-1",
    number: "01",
    name: "Digital Marketing Training",
    description: "Learn SEO, search rankings, social media marketing, paid advertisement campaigns, and high-conversion email marketing from scratch.",
    badge: "Most Popular",
    benefits: ["SEO & Blog Ranking", "Meta & Google Ad Setup", "Email Automation", "Retargeting Campaigns"]
  },
  {
    id: "service-2",
    number: "02",
    name: "Personal Branding",
    description: "Build an authoritative, recognizable online identity across social networks. Stand out to attract premium employers and premium enterprise clients.",
    badge: "Exclusive",
    benefits: ["Profile Optimization", "LinkedIn Strategy", "Thought Leadership Content", "Audience Retainer Funnels"]
  },
  {
    id: "service-3",
    number: "03",
    name: "Freelancing Guidance",
    description: "Identify global opportunities. Draft winning proposals, finalize freelance contracts, set optimal high-income rates, and withdraw local currency easily.",
    badge: "Hot Choice",
    benefits: ["Upwork & Fiverr Profiles", "Proposal Writing Blueprints", "Client Pitch Scripting", "International Payment Gateways"]
  },
  {
    id: "service-4",
    number: "04",
    name: "Content Creation",
    description: "Master viral video recording, editing on smartphones/desktops, scripting, thumbnails, and organic distribution for Instagram Reels and YouTube.",
    badge: "Trending",
    benefits: ["Mobile Video Editing", "Viral Script frameworks", "Instagram Algorithm Mastery", "YouTube SEO & Analytics"]
  },
  {
    id: "service-5",
    number: "05",
    name: "Affiliate Marketing Mastery",
    description: "Promote world-class digital products and software tools sustainably. Earn high-income passive royalties and commissions with minimal setup assets.",
    benefits: ["Niche Selection Criteria", "Landing Page Funnels", "Paid Traffic vs Free Traffic", "High-Paying Networks Check"]
  },
  {
    id: "service-6",
    number: "06",
    name: "Business Consulting",
    description: "Customized frameworks to scale brick-and-mortar startups, e-commerce stores, or SaaS projects with SEO-driven client acquisition architectures.",
    badge: "1-on-1 Guidance",
    benefits: ["Funnel Architecture", "Conversion Optimization", "Sales Team Handbooks", "Tech Stack Integration"]
  }
];

export const COURSES_DATA: Course[] = [
  {
    id: "course-basic",
    name: "Basic Course",
    duration: "1-2 Weeks with Internship",
    price: 4999,
    originalPrice: 12000,
    description: "In our Basic Course, we teach in detailings. Launch your journey into digital commerce. Learn absolute essentials of brand presence, campaign setup, and initial organic marketing loops alongside a guaranteed internship.",
    category: "marketing",
    iconName: "Megaphone",
    popular: false
  },
  {
    id: "course-advance",
    name: "Advance Course",
    duration: "2 Weeks with Internship",
    price: 14999,
    originalPrice: 25000,
    description: "In our Advance Course, we teach in detailings. Master high-yield outreach pipelines and social growth frameworks. Dive deep into targeted SEO systems, conversion-driven campaigns, and an interactive industry internship.",
    category: "branding",
    iconName: "Briefcase",
    popular: true
  },
  {
    id: "course-mastery",
    name: "Mastery Course",
    duration: "1 Month Course with Internship",
    price: 29999,
    originalPrice: 50000,
    description: "In our Mastery Course, we teach in detailings. Our elite tier standard. 1-on-1 personalized advisory, advanced funnel builds, complete high-income automation architectures, and immersive agency workspace integration with active placement pathways.",
    category: "ai",
    iconName: "Cpu",
    popular: false
  }
];

export const STATS_DATA: StatItem[] = [
  { value: "10,000+", label: "Students Trained", description: "Empowered in high-income digital domains." },
  { value: "7000+", label: "Guaranteed Placements", description: "Secured excellent high-earning project roles within our company." },
  { value: "5000+", label: "Housewives Placed", description: "Hired based on skills to generate great monthly earnings directly from home." },
  { value: "4.8/5", label: "Average Rating", description: "Highly rated by our trained graduates who got placed and are earning good money." }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: "test-1",
    name: "Priya Sharma",
    avatarSeed: "priya",
    role: "Placed SMM Specialist (Delhi)",
    quote: "Before joining this company, my life was completely stuck and not what I wanted. I was struggling without a clear path. Once I joined, they trained me beautifully. Based on my work and skills, I earned my internship certificate and a good placement. Now, I am doing great, achieving my goals, and earning good money!",
    rating: 5
  },
  {
    id: "test-2",
    name: "Rahul Mehta",
    avatarSeed: "rahul",
    role: "Placed SEO Expert (Mumbai)",
    quote: "My life before this was very difficult and empty. I was desperately trying to build a career but kept failing. Joining this company changed my destiny. Through my hard work and skills, I secured my internship certificate and got a good placement. I am achieving all my goals and my earnings are fantastic!",
    rating: 5
  },
  {
    id: "test-3",
    name: "Anjali Verma",
    avatarSeed: "anjali",
    role: "Placed Digital Specialist & Homemaker (Pune)",
    quote: "Before this program, my life as a housewife was filled with financial dependency and was definitely not what I wanted. Joining this company gave me a fresh start. They evaluated my skills, gave me an internship certificate, and a secure placement. I am doing great now, achieving my goals and earning good money right from home!",
    rating: 5
  },
  {
    id: "test-4",
    name: "Sandeep Deshmukh",
    avatarSeed: "sandeep",
    role: "Placed SEO Specialist (Pune)",
    quote: "I was struggling in low-paying roles and my life wasn't going where I wanted. This company changed my career entirely. Based on my dedication and skills, I earned my internship certificate and a high-value placement. Today, I am doing incredibly well, achieving my life goals, and my monthly earnings are amazing!",
    rating: 5
  },
  {
    id: "test-5",
    name: "Sneha Iyer",
    avatarSeed: "sneha",
    role: "Placed Content Specialist & Homemaker (Bengaluru)",
    quote: "Life before was hard and stressful, with no career direction in sight. This company recognized my hidden skills. After training, I earned my certified internship certificate and got a direct layout placement. I am finally doing great, achieving my personal goals, and generating great monthly earnings directly from my home!",
    rating: 5
  },
  {
    id: "test-6",
    name: "Kunal Sen",
    avatarSeed: "kunal",
    role: "Placed Marketing Specialist (Kolkata)",
    quote: "I was highly directionless before, and my life was not what I wanted it to be. The training program here gave me a solid identity. Based on my work and skills, I got my internship certificate and a lovely placement. I am now doing great, achieving my career goals, and earning excellent money!",
    rating: 5
  },
  {
    id: "test-7",
    name: "Neha Patel",
    avatarSeed: "neha",
    role: "Placed Campaign Specialist (Ahmedabad)",
    quote: "I had completed theoretical courses elsewhere but my life was still stuck and unfulfilled. Joining this company was the best decision. Based on my practical skills, I got my internship certificate and secured a great placement. I am doing fantastic, achieving continuous milestones, and earning great money!",
    rating: 5
  },
  {
    id: "test-8",
    name: "Varun Malhotra",
    avatarSeed: "varun",
    role: "Placed Search Analyst (New Delhi)",
    quote: "Before discovering this program, my routine was demotivating and far from what I had planned for my life. Thanks to my skills during training, they gave me an internship certificate and a good placement directly. I am achieving my long-term goals and earning good money now!",
    rating: 5
  },
  {
    id: "test-9",
    name: "Rohit Bansal",
    avatarSeed: "rohit",
    role: "Placed Media Buyer (Mumbai)",
    quote: "My professional life had hit a rock-bottom phase before this. After joining and showing my dedication, the mentors valued my skills. I got my internship certificate and a good placement. I am doing exceptionally great, achieving my goals, and my earnings are scaling regularly!",
    rating: 5
  },
  {
    id: "test-10",
    name: "Aditi Joshi",
    avatarSeed: "aditi",
    role: "Placed Content Writer (Indore)",
    quote: "My life before joining was quite rough and full of doubt about the future. Earning my verified internship certificate here was a game-changer. They placed me based on my skills, and now my digital earnings are superb. I am achieving my dreams and doing great!",
    rating: 5
  },
  {
    id: "test-11",
    name: "Vikram Gupta",
    avatarSeed: "vikram",
    role: "Placed SEO Associate (Chennai)",
    quote: "I was unhappy with my daily routine and my financial life was definitely not what I wanted. After joining, they evaluated my skills and work, awarded me an internship certificate, and provided a highly secure placement. I am doing great, achieving my standard of living, and earning excellent money!",
    rating: 5
  },
  {
    id: "test-12",
    name: "Kiran Reddy",
    avatarSeed: "kiran",
    role: "Placed Social Media Executive (Hyderabad)",
    quote: "Before this, my life was completely stagnant and unsatisfying. Once I joined this company, they trained me perfectly with live tasks. Because of my performance and skills, I got my internship certificate and a good placement. Today I'm doing great, achieving all my goals and earning high money!",
    rating: 5
  },
  {
    id: "test-13",
    name: "Meera Nair",
    avatarSeed: "meera",
    role: "Placed Campaign Associate (Kochi)",
    quote: "Life before joining was a series of rejections and not what I wanted. But here, they focus entirely on your work and skills. I was awarded my internship certificate and received a good placement. I am now doing great, achieving my life targets, and earning a highly rewarding monthly income!",
    rating: 5
  },
  {
    id: "test-14",
    name: "Rajesh Nair",
    avatarSeed: "rajesh",
    role: "Placed SEO Specialist (Jaipur)",
    quote: "My career was going nowhere and my life was full of uncertainty beforehand. Getting trained here and showing my skills changed my trajectory. I received my internship certificate and a great placement. I am achieving my ambitions, doing great, and my earnings are fantastic!",
    rating: 5
  },
  {
    id: "test-15",
    name: "Farha Khan",
    avatarSeed: "farha",
    role: "Placed SMM Specialist & Homemaker (Hyderabad)",
    quote: "As a busy homemaker, my daily life felt uninspired and was not what I wanted. Joining this company opened a door for me. I worked hard on my skills, earned my internship certificate, and got a good placement. Now I am earning good money right from home and doing great!",
    rating: 5
  },
  {
    id: "test-16",
    name: "Faisal Qureshi",
    avatarSeed: "faisal",
    role: "Placed SEO Specialist (Lucknow)",
    quote: "Before joining, my life was a constant struggle for financial independence and was not what I wanted. This company trained me in search optimization perfectly. Based on my work and skills, I earned my internship certificate and got a placement. I am doing great, achieving my goals, and earning good money!",
    rating: 5
  },
  {
    id: "test-17",
    name: "Zainab Sheikh",
    avatarSeed: "zainab",
    role: "Placed Content Specialist (Mumbai)",
    quote: "I was extremely anxious about my empty future and life before this was demotivating. This team guided me step-by-step. I got my internship certificate based on my work and received an immediate good placement here. I am doing great, achieving my milestones, and earning great money!",
    rating: 5
  },
  {
    id: "test-18",
    name: "Imran Ahmed",
    avatarSeed: "imran",
    role: "Placed Digital operations Lead (Bengaluru)",
    quote: "My professional life before this course was very disappointing and not what I envisioned. Joining was a complete life-changer. Thanks to my skills and evaluation, I received my internship certificate and secured a great placement. I am achieving my goals, doing great, and my earnings have scaled beautifully!",
    rating: 5
  }
];

export const WHY_CHOOSE_US_DATA: { id: string; title: string, description: string }[] = [
  { id: "why-1", title: "Practical Learning", description: "No theoretical filler lectures. We build real campaigns, write real copy, optimize real sites, and run real ads alongside you." },
  { id: "why-2", title: "Industry Experts", description: "Our elite trainers have years of hands-on digital agency experience managing seven-figure marketing spend and global organic brands." },
  { id: "why-3", title: "Affordable Courses", description: "Premium, agency-grade strategies packaged into budget-friendly curriculums. High-utility intelligence accessible for everyone." },
  { id: "why-4", title: "Live Mentorship", description: "Interactive live review sessions, doubt clearance, and screenshare mentorship so you never feel lost or stuck along your journey." },
  { id: "why-5", title: "Real Case Studies", description: "Deconstruct exactly how top international brands scaled their SEO, social influence, and organic sales conversion loops." },
  { id: "why-6", title: "Community Support", description: "Lifetime placement resources, masterminds, peer study channels, and instant feedback loops within our active student community." },
  { id: "why-7", title: "Career Guidance", description: "Draft optimized resumes, set up portfolios, practice technical mock interviews, and receive placement opportunities in Infinite SEO." }
];

export const PRICING_DATA: PricingPlan[] = [
  {
    id: "pricing-starter",
    name: "Starter Plan",
    price: 999,
    period: "month",
    popular: false,
    tier: "starter",
    description: "Begin learning basic high-income digital skills at a minimal recurring entry cost.",
    features: ["Access to all Basic Digital Skill courses", "Member-only general community forums", "Weekly practical review Webinars", "Self-paced progress tracker", "Standard digital certificate of study"]
  },
  {
    id: "pricing-pro",
    name: "Pro Plan",
    price: 2999,
    period: "month",
    popular: true,
    tier: "pro",
    description: "Perfect for active creators and freelancers looking to turn skills into active income.",
    features: ["Unlock ALL elite advanced training programs", "Live Q&A cohort screenshare mentorship", "Downloadable contract contracts & proposal templates", "Complete Freelancing blueprint and guidance client-kit", "High-Priority Telegram mastermind access"]
  },
  {
    id: "pricing-premium",
    name: "Premium Plan",
    price: 5999,
    period: "month",
    popular: false,
    tier: "premium",
    description: "Comprehensive customized support designed for startups, brands, and premium agency owners.",
    features: ["Dedicated 1-on-1 direct coaching sessions monthly", "Custom brand & SEO business consultation", "Premium high-capital private networking group", "Verified reference verification & Infinite SEO placement priority", "Unrestricted 24/7 dedicated Slack/WhatsApp priority VIP support"]
  }
];

export const FAQ_DATA: faqItem[] = [
  {
    id: "faq-1",
    question: "Do I need prior experience or technical backgrounds?",
    answer: "Absolutely not! Every single training at Infinite SEO is crafted meticulously with a zero-experience starting point in mind. We teach the basic vocabulary first, then guide you incrementally toward technical or advanced digital execution."
  },
  {
    id: "faq-2",
    question: "Are the classes live or recorded?",
    answer: "You get the ultimate combination of both worlds! Deep-dive concept guides are recorded inside your user portal so you can study at your own convenience, while live weekly cohorts, screenshares, and mentorship reviews run live online."
  },
  {
    id: "faq-3",
    question: "Will I receive a verified certificate upon completion?",
    answer: "Yes! Every single student gets a course-specific digital certificate showcasing their credentials. You can easily embed this validated credential directly onto your LinkedIn profile, portfolio website, or Upwork profile to reassure clients."
  },
  {
    id: "faq-4",
    question: "Can I learn freelancing and secure clients here?",
    answer: "Yes, this is our core specialty. We don't just teach visual theory; we provide verified templates, sample pitch transcripts, guide you through site registrations, and provide real placement pipelines as an digital services company."
  }
];

export const SEO_KEYWORDS = [
  "Digital Marketing Course",
  "Freelancing Training",
  "Online Business Coaching",
  "Personal Branding",
  "Social Media Marketing",
  "Entrepreneur Training",
  "AI for Business",
  "Website Development"
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-1",
    title: "How to Start Freelancing in 2026",
    summary: "Discover the exact client-acquisition methodology to launch a sustainable, highly-profitable freelancing business starting with no professional experience.",
    readTime: "6 min read",
    category: "Freelancing",
    content: `Starting a freelance career in 2026 demands more than just registering a basic profile. It requires presenting a hyper-specialized solution. The gig economy has expanded, and clients are willing to pay a premium for specialists who solve specific pains.

    To start, select one narrow domain of mastery (like 'Instagram Content Writing' or 'Shopify Speed Optimization') rather than a general phrase like 'Digital Assistant'. Next, build high-fidelity interactive proof-of-work items. You don't need real previous clients to do this—invent visual mockup briefs and solve them beautifully.
    
    Finally, leverage cold social audits. Direct message prospective clients showing them exact issues on their landing page or content, along with your bespoke video showing how to fix it. This creates immediate trust and bypasses bidding queues entirely!`,
    keyLessons: [
      "Specialize early in high-value sub-skills",
      "Build realistic 'mock proof-of-work' items",
      "Send custom loom audit videos for high-converting outreach"
    ],
    seoKeywords: ["Freelancing Training", "How to Get Your First Client", "Online Business Coaching"]
  },
  {
    id: "blog-2",
    title: "Best AI Tools for Entrepreneurs",
    summary: "Supercharge your daily marketing productivity, content templates, and email client flows by utilizing these free and premium AI tools safely.",
    readTime: "5 min read",
    category: "AI & Productivity",
    content: `Artificial intelligence is no longer a luxury—it is the ultimate equalizer for lean solo entrepreneurs. By integrating AI into your workflow, a team of one can scale output to mimic a 10-person digital agency!
    
    For content generation, tools like Gemini and ChatGPT allow you to draft structured email campaigns and interactive social captions when fed with detailed customer personas. For graphics, Midjourney and Canva AI generate custom banners in seconds.
    
    Additionally, tools like ElevenLabs or automated transcription services let you convert text to speech for premium short videos quickly, reducing editing overhead significantly!`,
    keyLessons: [
      "Use custom persona prompts for personalized text outputs",
      "Leverage modern image generation to bypass stock photos",
      "Save 15+ hours weekly by automating content scripting with AI"
    ],
    seoKeywords: ["AI for Business", "Entrepreneur Training", "Digital Marketing Course"]
  },
  {
    id: "blog-3",
    title: "Instagram Growth Tips for Beginners",
    summary: "A practical guide to mastering the Instagram algorithm, capturing viewer retention, and converting casual video views into loyal organic leads.",
    readTime: "4 min read",
    category: "Social Media",
    content: `Instagram is the world's most interactive billboard. Growth in 2026 is governed entirely by viewer watch-time retention. If viewers scroll past your reel within 2 seconds, the algorithm flags it as low-quality.
    
    To grow organically, start with a high-impact hook. The hook could be visual, or a bold text statement on screen like "The biggest mistake I made in Google SEO...". 
    
    Always use clear fonts and call actions that drive comments, as comments cue Instagram to push your post to broader explore feeds. Keep your videos brief and packed with punchy, actionable value points!`,
    keyLessons: [
      "Capture immediate visual attention in the first 2 seconds",
      "Prompt discussions in the comments section to boost algorithmic weight",
      "Maintain strict visual consistency in your feed templates"
    ],
    seoKeywords: ["Personal Branding", "Social Media Marketing", "Digital Marketing Course"]
  },
  {
    id: "blog-4",
    title: "How to Build a Personal Brand",
    summary: "Stop chasing clients like a hunter. Build an authoritative, high-value personal brand that pulls ideal opportunities directly into your inbox.",
    readTime: "7 min read",
    category: "Branding",
    content: `Your personal brand is what people say about you when you leave the digital room. If you do not define your online representation, the market will define it for you or ignore you entirely.
    
    Begin by picking a hero topic—something you are deeply interested in learning and mastering. Post consistent lesson logs daily on LinkedIn or Instagram detailing what you learned, what failed, and how you fixed it. 
    
    This raw transparency acts like a community-magnet. People don't buy flawless corporate logos; they buy authentic humans sharing real-world struggles with consistent optimism. Over time, you build authority, turning premium clients from active visual targets into inbound leads.`,
    keyLessons: [
      "Define a coherent hero theme and document your daily insights",
      "Embrace authentic sharing of failures and solutions",
      "Commit to persistent posting for at least 6 months"
    ],
    seoKeywords: ["Personal Branding", "Digital Marketing Course", "Online Business Coaching"]
  },
  {
    id: "blog-5",
    title: "Digital Marketing Trends in 2026",
    summary: "Stay ahead of the curve by understanding the major paradigm shifts in search, short form video, and performance ads.",
    readTime: "6 min read",
    category: "Digital Marketing",
    content: `The electronic landscape is changing faster than ever. Standard traditional keyword stuffing is dead. Today, search is highly semantic and conversation-driven with AI Search Grounding.
    
    To rank sustainably in 2026, content must address specific user intents thoroughly. Additionally, short video channels remain the absolute best source of traffic, with TikTok, Instagram Reels, and YouTube Shorts maintaining dominance.
    
    Performance marketing is also shifting layout—automated bid parameters do the heavy lifting, meaning success depends heavily on the quality, visual clarity, and raw emotional hook of your graphic creative rather than simple technical settings.`,
    keyLessons: [
      "Optimize web content for direct, conversation-like questions",
      "Prioritize visual ad creativity over minor dashboard settings",
      "Direct user pathways into private newsletter ownership"
    ],
    seoKeywords: ["Digital Marketing Course", "Social Media Marketing", "Website Development"]
  },
  {
    id: "blog-6",
    title: "Passive Income Ideas Online",
    summary: "Uncover real systems to write, package, and sell digital assets that earn revenue for you while you are spending time elsewhere.",
    readTime: "5 min read",
    category: "Entrepreneurship",
    content: `True freedom comes from untethering your limited time from your incoming revenue. Passive income online is not a magical trick; it is simply front-loaded value creation that pays digital royalties over time.
    
    One excellent method is Affiliate Marketing—recommending software products you actively use. Every time new users subscribe using your link, you get passive monthly recurring pay. 
    
    Another strategy is writing useful e-books, micro-templates, or guides and automating payment deliveries through digital checkout platforms. This lets you serve users worldwide around the clock.`,
    keyLessons: [
      "Target recurring software affiliate royalties",
      "Create high-value micro-templates once and list them for sale",
      "Automate email follow-up sequences for automated lead nurturing"
    ],
    seoKeywords: ["Online Business Coaching", "Personal Branding", "Entrepreneur Training"]
  },
  {
    id: "blog-7",
    title: "Best Skills to Learn Online",
    summary: "Invest your focus in high-income digital disciplines that are resistant to automation and highly valued globally.",
    readTime: "5 min read",
    category: "Skills",
    content: `Not all digital skills are created equal. In a world with prompt tools, skills that combine personal empathy, technical depth, and strategic thinking are highly resilient and command premium pricing.
    
    The top high-income skills include Visual Directing and Content Scripting, SEO Semantic funnels, and Customer Acquisition optimization. Learning how to translate user behaviors into conversion pipelines is always incredibly lucrative.
    
    Finally, learning how to present, speak, and sell—otherwise known as communication and persuasion skills—acts as a multiplier for all other technical skills you acquire!`,
    keyLessons: [
      "Combine copy skills and analytical data to form growth systems",
      "Master high-conversion user-design principles",
      "Always pair your technical expertise with active Sales skills"
    ],
    seoKeywords: ["Entrepreneur Training", "Digital Marketing Course", "Freelancing Training"]
  },
  {
    id: "blog-8",
    title: "How to Get Your First Client",
    summary: "Step-by-step breakdown on sending highly targeted pitch emails that convert cold contacts into high-paying freelance clients.",
    readTime: "6 min read",
    category: "Freelancing",
    content: `The hardest part of any enterprise is getting that initial dollar. Most beginners fail, not because they are bad at work, but because they send copy-paste spam pitches that resemble junk mail.
    
    To land your first customer, first research a targeted business niche (e.g., local dental clinics in your province). Look at their online representation, find their gaps (such as laggy mobile layouts or missing pixels), and write a polite, non-pushy message.
    
    Briefly outline the exact problem, explain how it hurts their patient bookings, show they are losing out, and give them the code changes for free, or invite them on a brief 10-minute strategy call. This makes you a valued consultant, not a salesperson!`,
    keyLessons: [
      "Select a hyper-local, high-margin business vertical to query",
      "Identify real operational errors before communicating with owners",
      "Provide immediate upfront value to remove risk for the prospect"
    ],
    seoKeywords: ["Freelancing Training", "How to Get Your First Client", "Personal Branding"]
  }
];

export const SUCCESS_STORIES_DATA: SuccessStory[] = [
  {
    id: "story-1",
    name: "Aarav Singhania",
    tag: "College Dropout",
    background: "Disillusioned engineering dropout from Bhopal with no prior connection to digital marketing or business ecosystems.",
    courseTaken: "Mastery Course (1 Month Course with Internship)",
    skillsLearned: [
      "In-depth Technical SEO Auditing",
      "Client Pitching & High-Value Proposal Structuring",
      "Advanced Search Intent Keyword Research"
    ],
    achievements: [
      "Secured a monthly remote retainer of $1,800 USD with an e-commerce brand based in Austin, Texas.",
      "Identified and fixed 45 critical crawling and dynamic index errors during his active internship.",
      "Graduated and received immediate full-time corporate appointment as a Junior Project Lead in our core team."
    ],
    highlightMetric: "$1,800/mo US Remote Retainer",
    testimonialQuote: "I was extremely anxious when I left college, feeling like a failure. Joining Infinite SEO provided the direct, action-oriented, hands-on path I needed. Within 4 weeks of my guaranteed internship, I was auditing global stores and landed a premium remote US client. I've now scaled my monthly earnings and got placed in the core company!",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&h=600&q=80"
  },
  {
    id: "story-2",
    name: "Kavita Krishnan",
    tag: "Homemaker & Mother",
    background: "Full-time homemaker and mother of two in Coimbatore looking to build a remote business from her laptop with completely zero experience.",
    courseTaken: "Advance Course (2 Weeks with Internship)",
    skillsLearned: [
      "Social Media Management & Strategy (SMM)",
      "Pinterest Aesthetic Organic Growth Funnels",
      "Meta Business Manager & Paid Ad Setup"
    ],
    achievements: [
      "Launched 'Krishnan Digital'—a high-end freelance social media management agency from home.",
      "Acquired 3 local retail and boutique clients within Coimbatore within 6 weeks.",
      "Successfully scaled her home-based revenue past ₹45,000 per month."
    ],
    highlightMetric: "₹45K+/mo From Home Studio",
    testimonialQuote: "As a homemaker, I felt financially dependent and isolated from the active workforce. The mentorship team didn't just teach theory; they walked me through setting up client retainers step-by-step. Now, I balance managing social campaigns for three amazing local brands with parenting, generating great monthly income under my own name!",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&h=600&q=80"
  },
  {
    id: "story-3",
    name: "Manish Bansal",
    tag: "Career Changer",
    background: "Former retail branch manager in Ludhiana who was laid off and wanted a high-opportunity digital path.",
    courseTaken: "Mastery Course (1 Month Course with Internship)",
    skillsLearned: [
      "High-Conversion SEO Content Strategy",
      "Automated WhatsApp & Email Lead Funnels",
      "Team Management & Agency Operations"
    ],
    achievements: [
      "Signed 3 manufacturing firms in Ludhiana to long-term SEO and lead generation retainers.",
      "Earned ₹90,000 in total project fees in his second month post-certification.",
      "Expanded his scope and hired two assistant writers to automate content delivery."
    ],
    highlightMetric: "₹90K/mo Agency Growth",
    testimonialQuote: "Getting laid off in my mid-30s was terrifying. I knew nothing about search engine rankings. During the Mastery Course internship, I audited real industrial websites. I pitched exactly what I learned to local manufacturing founders. The value is immediate—I signed three ₹30K/month retainers and have started hiring my own team!",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&h=600&q=80"
  },
  {
    id: "story-4",
    name: "Nisha Deshpande",
    tag: "Graphic Designer",
    background: "Struggling freelance graphic designer in Pune facing price-undercutting on traditional gig sites.",
    courseTaken: "Basic Course (1-2 Weeks with Internship)",
    skillsLearned: [
      "LinkedIn Authority Profiling & Outbound Pitching",
      "Conversion Rate Optimization (CRO) for Landing Pages",
      "Affiliate and Passive Product Setups"
    ],
    achievements: [
      "Repositioned her freelancing from 'cheap logos' to 'high-converting conversion design'.",
      "Secured 3 incoming high-value client deals purely from LinkedIn inbound requests.",
      "Increased her average contract size from ₹5,000 to over ₹30,000 per asset package."
    ],
    highlightMetric: "300% Boost in Contract Value",
    testimonialQuote: "I was competing with people selling logos for ₹500. It was a race to the bottom. Infinite SEO taught me how to bundle my graphic designs with SEO keyword strategy and conversion auditing. By showing clients how my layout choices boost actual sales, I can charge premium rates. My clients now come directly to me!",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&h=600&q=80"
  }
];

