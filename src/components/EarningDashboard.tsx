import React, { useState, useEffect } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Copy, 
  Plus, 
  Send, 
  Check, 
  Award, 
  Briefcase, 
  HelpCircle, 
  Sparkles,
  ArrowRight,
  UserPlus,
  RefreshCw,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Unlock,
  Mail,
  Phone,
  CreditCard,
  ArrowLeft,
  AlertCircle,
  LogOut,
  Database
} from "lucide-react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, writeBatch, serverTimestamp, deleteDoc } from "firebase/firestore";
import { DatabaseService } from "../services/databaseService";
import { PaymentConfig, UserPayment } from "../types";

interface ReferralLead {
  id: string;
  name: string;
  phone?: string;
  courseSelected: string;
  coursePrice: number;
  commissionEarned: number;
  date: string;
  status: "Completed" | "Pending" | "Lead Only";
}

interface EarningDashboardProps {
  selectedEnrollCourse: string | null;
  setSelectedEnrollCourse: (course: string | null) => void;
}

export default function EarningDashboard({ selectedEnrollCourse, setSelectedEnrollCourse }: EarningDashboardProps) {
  // Authentication & Access state
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [step, setStep] = useState(1); // 1: Account, 3: Simulated checkout
  
  // Firebase Auth states
  const [fbUser, setFbUser] = useState<any>(null);
  const [isSyncingDb, setIsSyncingDb] = useState(false);
  const [dbError, setDbError] = useState("");
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null);

  useEffect(() => {
    async function loadPaymentConfig() {
      try {
        const config = await DatabaseService.getPaymentConfig();
        setPaymentConfig(config);
      } catch (err) {
        console.warn("Failed to load payment config:", err);
      }
    }
    loadPaymentConfig();
    window.addEventListener("storage", loadPaymentConfig);
    return () => window.removeEventListener("storage", loadPaymentConfig);
  }, []);

  // Registration Form Values
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regCourse, setRegCourse] = useState("Advance Training");
  const [regUpiPayout, setRegUpiPayout] = useState("");
  const [referrerCode, setReferrerCode] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get("ref") || "";
    } catch {
      return "";
    }
  });

  // Checkout simulation
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card">("upi");
  const [upiPaymentId, setUpiPaymentId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [registrationError, setRegistrationError] = useState("");
  const [confirmPaymentToggle, setConfirmPaymentToggle] = useState(false);
  const [userPayments, setUserPayments] = useState<UserPayment[]>([]);

  // Sync props selectedCourse if it changes from our Course catalog
  useEffect(() => {
    if (selectedEnrollCourse) {
      setRegCourse(selectedEnrollCourse);
    }
  }, [selectedEnrollCourse]);

  // Dashboard configuration states (Once successfully unlocked)
  const [currentUser, setCurrentUser] = useState({
    name: "Saurabh Deshpande",
    email: "saurabh@sandbox.com",
    course: "Advance Training",
    payoutUpi: "saurabh@okaxis",
    promoCode: "SAURABH15"
  });

  const [partnerLevel, setPartnerLevel] = useState<"novice" | "pro" | "master">("pro");
  const [copiedCode, setCopiedCode] = useState(false);
  
  // Payout panel state
  const [payoutUpi, setPayoutUpi] = useState("");
  const [payoutAmount, setPayoutAmount] = useState("5000");
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState("");
  const [payoutLoading, setPayoutLoading] = useState(false);

  // Dynamic Referrals list
  const [referrals, setReferrals] = useState<ReferralLead[]>([
    { id: "REF-2901", name: "Kunal Pathak", courseSelected: "Mastery Training", coursePrice: 29999, commissionEarned: 5000, date: "2026-05-21", status: "Completed" },
    { id: "REF-2902", name: "Aarushi Sen", courseSelected: "Advance Training", coursePrice: 14999, commissionEarned: 3000, date: "2026-05-20", status: "Completed" },
    { id: "REF-2903", name: "Jatin More", courseSelected: "Basic Training", coursePrice: 4999, commissionEarned: 1500, date: "2026-05-20", status: "Completed" },
    { id: "REF-2911", name: "Megha Gupta", courseSelected: "Advance Training", coursePrice: 14999, commissionEarned: 3000, date: "2026-05-18", status: "Completed" },
    { id: "REF-2915", name: "Vikas Joshi", courseSelected: "Mastery Training", coursePrice: 29999, commissionEarned: 5000, date: "2026-05-17", status: "Completed" },
    { id: "REF-3001", name: "Tanmay Patil", courseSelected: "Advance Training", coursePrice: 14999, commissionEarned: 3000, date: "2026-05-16", status: "Pending" },
    { id: "REF-3004", name: "Pooja Hegde", courseSelected: "Basic Training", coursePrice: 4999, commissionEarned: 0, date: "2026-05-15", status: "Lead Only" }
  ]);

  // Firebase Real-time listeners & Profile synchronizer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFbUser(user);
        setIsSyncingDb(true);
        try {
          // Pre-fill fields from Google account details
          setRegName(user.displayName || "");
          setRegEmail(user.email || "");

          // Attempt to retrieve user profile document from Firestore
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            setCurrentUser({
              name: data.name || user.displayName || "Learner Partner",
              email: data.email || user.email || "",
              course: data.course || "Advance Training",
              payoutUpi: data.payoutUpi || "",
              promoCode: data.promoCode || "",
            });
            if (data.payoutUpi) {
              setPayoutUpi(data.payoutUpi);
            }
            if (data.partnerLevel) {
              setPartnerLevel(data.partnerLevel as any);
            }
            setIsUnlocked(true);

            // Dynamically load referrals from Firestore sub-collection
            const referralsCollectionRef = collection(db, "users", user.uid, "referrals");
            const referralsSnap = await getDocs(referralsCollectionRef);
            const loadedReferrals: ReferralLead[] = [];
            
            referralsSnap.forEach((docSnap) => {
              const rData = docSnap.data();
              loadedReferrals.push({
                id: rData.id,
                name: rData.name,
                phone: rData.phone || "",
                courseSelected: rData.courseSelected,
                coursePrice: rData.coursePrice,
                commissionEarned: rData.commissionEarned,
                date: rData.date,
                status: rData.status,
              });
            });

            if (loadedReferrals.length > 0) {
              setReferrals(loadedReferrals);
            }
            setDbError("");
          } else {
            // Profile doesn't exist yet, we keep locked and expect registration step
            setIsUnlocked(false);
          }
        } catch (err) {
          console.warn("Database sync active in mock developer sandboxed fallback.", err);
          setDbError("Database active in simulator fallback mode.");
        } finally {
          setIsSyncingDb(false);
        }
      } else {
        setFbUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load user payments list when unlocked or user logs in
  useEffect(() => {
    async function fetchPayments() {
      const uid = fbUser ? fbUser.uid : "sandbox_user";
      try {
        const list = await DatabaseService.getUserPayments(uid);
        if (list.length === 0) {
          // Pre-populate some historical payment records for transparency & realism
          const defaultPayments: UserPayment[] = [
            {
              id: "PAY-839212",
              courseOrPlanName: "Basic Training",
              amount: 4999,
              paymentMethod: "card",
              transactionId: "CARD-4242",
              status: "Completed",
              date: "2026-05-10",
              createdAt: new Date("2026-05-10").toISOString()
            }
          ];
          for (const pay of defaultPayments) {
            await DatabaseService.addUserPayment(uid, pay);
          }
          setUserPayments(defaultPayments);
        } else {
          setUserPayments(list);
        }
      } catch (err) {
        console.warn("Failed to load user payments:", err);
      }
    }
    if (isUnlocked) {
      fetchPayments();
    }
  }, [isUnlocked, fbUser]);

  const handleGoogleSignIn = async () => {
    setRegistrationError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.warn("Google credentials initialization skipped or pending setup in project console.", err);
      setRegistrationError("Google Authentication is initializing. Accept developer terms in Firebase Setup UI to log in.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setFbUser(null);
      setIsUnlocked(false);
      handleBypassLock();
    } catch (err) {
      console.error("Authentication signout failure:", err);
    }
  };

  // Lead injection variables
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadPhone, setNewLeadPhone] = useState("");
  const [newLeadCourse, setNewLeadCourse] = useState("Advance Training");
  const [newLeadStatus, setNewLeadStatus] = useState<"Completed" | "Pending">("Completed");
  const [leadInjectedError, setLeadInjectedError] = useState("");

  // Live simulator inputs
  const [calcCoursePrice, setCalcCoursePrice] = useState<number>(14999);
  const [calcRecruits, setCalcRecruits] = useState<number>(6);

  // Return course pricing details
  const getCoursePrice = (courseName: string): number => {
    if (courseName.includes("Basic")) return 4999;
    if (courseName.includes("Advance")) return 14999;
    if (courseName.includes("Mastery")) return 29999;
    if (courseName.includes("Starter")) return 999;
    if (courseName.includes("Pro")) return 2999;
    if (courseName.includes("Premium")) return 5999;
    if (courseName.includes("Digital Marketing")) return 9999;
    if (courseName.includes("Social Media Marketing")) return 7999;
    if (courseName.includes("Influencer Marketing")) return 12499;
    if (courseName.includes("Affiliate Marketing")) return 6999;
    if (courseName.includes("Performance Marketing")) return 14999;
    if (courseName.includes("AI Services")) return 11999;
    if (courseName.includes("Editing")) return 3999;
    if (courseName.includes("Followers")) return 2499;
    if (courseName.includes("Logo")) return 1999;
    if (courseName.includes("Poster")) return 1499;
    if (courseName.includes("Animations")) return 8999;
    if (courseName.includes("ADS")) return 9999;
    return 14999;
  };

  const currentOriginalPrice = getCoursePrice(regCourse);
  const calculatedSavings = 0;
  const currentPayablePrice = currentOriginalPrice;

  const getCommissionForCourse = (courseName: string, level: "novice" | "pro" | "master"): number => {
    if (courseName.includes("Basic")) {
      return 1500;
    }
    if (courseName.includes("Mastery")) {
      return 5000;
    }
    if (courseName.includes("Advance")) {
      return 3500;
    }

    let base = 3500; // default fallback
    if (courseName.includes("Starter")) {
      base = 300;
    } else if (courseName.includes("Pro")) {
      base = 900;
    } else if (courseName.includes("Premium")) {
      base = 1800;
    } else {
      const price = getCoursePrice(courseName);
      base = Math.round(price * 0.3); // 30% of price as base commission
    }

    switch (level) {
      case "novice":
        return Math.round(base * (10 / 15)); // Novice scale
      case "pro":
        return base;                         // Pro (Default base)
      case "master":
        return Math.round(base * (25 / 15)); // Master scale
      default:
        return base;
    }
  };

  // Synchronize dynamic commissions table with selected partner level
  useEffect(() => {
    setReferrals(prev => prev.map(item => {
      if (item.status === "Lead Only") return item;
      const earned = getCommissionForCourse(item.courseSelected, partnerLevel);
      return {
        ...item,
        commissionEarned: earned
      };
    }));
  }, [partnerLevel]);

  const getCommissionRate = () => {
    switch (partnerLevel) {
      case "novice": return 0.10; // 10%
      case "pro": return 0.15;    // 15%
      case "master": return 0.25; // 25%
    }
  };

  // Launch secure registration with simulated payment spinner
  const handleCheckoutPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrationError("");

    if (paymentMethod === "upi") {
      if (!confirmPaymentToggle) {
        setRegistrationError("Please complete the UPI transfer, enable the 'Confirm Payment' toggle, and provide your transaction reference ID / UTR to authorize enrollment.");
        return;
      }
      if (!upiPaymentId.trim()) {
        setRegistrationError(`Please enter the 12-digit payment transaction reference ID / UTR to verify your payment of ₹${currentPayablePrice.toLocaleString("en-IN")}.`);
        return;
      }
    }
    if (paymentMethod === "card" && (!cardNumber.trim() || !cardExpiry.trim() || !cardCVV.trim())) {
      setRegistrationError("Please provide simulated debit/credit card fields to authenticate.");
      return;
    }

    setProcessingPayment(true);
    
    // Generate clean referral code for the partner
    const userFirstName = regName.trim().split(" ")[0].toUpperCase() || "MEMBER";
    const userPromoCode = `${userFirstName}${Math.floor(10 + Math.random() * 89)}`;

    const newUserPayload = {
      name: regName.trim() || "Saurabh Deshpande",
      email: regEmail.trim() || "partner@sandbox.com",
      course: regCourse,
      payoutUpi: regUpiPayout.trim() || "member@okaxis",
      promoCode: userPromoCode
    };

    const paymentId = `PAY-${Math.floor(100000 + Math.random() * 900000)}`;
    const newPayment: UserPayment = {
      id: paymentId,
      courseOrPlanName: regCourse,
      amount: currentPayablePrice,
      paymentMethod: paymentMethod,
      transactionId: paymentMethod === "upi" ? upiPaymentId.trim() : `CARD-${cardNumber.slice(-4)}`,
      status: paymentMethod === "upi" ? "Verification Pending" : "Completed",
      date: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString()
    };

    // Firebase write if user is authenticated
    if (fbUser) {
      try {
        const userDocRef = doc(db, "users", fbUser.uid);
        await setDoc(userDocRef, {
          uid: fbUser.uid,
          name: newUserPayload.name,
          email: newUserPayload.email,
          phone: regPhone.trim(),
          course: newUserPayload.course,
          payoutUpi: newUserPayload.payoutUpi,
          promoCode: newUserPayload.promoCode,
          partnerLevel: partnerLevel,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        // Seed initial mock referrals to sub-collection
        const batch = writeBatch(db);
        for (const item of referrals) {
          const refDocRef = doc(db, "users", fbUser.uid, "referrals", item.id);
          batch.set(refDocRef, {
            ...item,
            referrerUid: fbUser.uid,
            createdAt: serverTimestamp()
          });
        }
        await batch.commit();

        // Save payment record to Firestore too
        await DatabaseService.addUserPayment(fbUser.uid, newPayment);
      } catch (err) {
        console.warn("Could not save profile to firestore, unlocking in local mode:", err);
      }
    } else {
      // Local/sandbox fallback
      await DatabaseService.addUserPayment("sandbox_user", newPayment);
    }

    setTimeout(() => {
      setProcessingPayment(false);
      setCurrentUser(newUserPayload);
      setPayoutUpi(regUpiPayout.trim() || "member@okaxis");
      // Add local state update
      setUserPayments(prev => [newPayment, ...prev]);
      setIsUnlocked(true);
    }, 1500);
  };

  // Direct fast preview simulation bypass
  const triggerBypassUnlock = async () => {
    const backupPayload = {
      name: "Priya Roy",
      email: "priya.roy@gmail.com",
      course: "Advance Training",
      payoutUpi: "priya@ybl",
      promoCode: "PRIYA25"
    };

    if (fbUser) {
      try {
        const userDocRef = doc(db, "users", fbUser.uid);
        await setDoc(userDocRef, {
          uid: fbUser.uid,
          name: backupPayload.name,
          email: backupPayload.email,
          phone: "+91 99679 xxxxx",
          course: backupPayload.course,
          payoutUpi: backupPayload.payoutUpi,
          promoCode: backupPayload.promoCode,
          partnerLevel: partnerLevel,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        const batch = writeBatch(db);
        for (const item of referrals) {
          const refDocRef = doc(db, "users", fbUser.uid, "referrals", item.id);
          batch.set(refDocRef, {
            ...item,
            referrerUid: fbUser.uid,
            createdAt: serverTimestamp()
          });
        }
        await batch.commit();
      } catch (err) {
        console.warn("Bypass firestore sync failed:", err);
      }
    }

    setCurrentUser(backupPayload);
    setPayoutUpi("priya@ybl");
    setIsUnlocked(true);
  };

  const copyPartnerLink = () => {
    const inviteLink = `https://infiniteseo.com/join?ref=${currentUser.promoCode}`;
    navigator.clipboard.writeText(inviteLink);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Live summaries calculated dynamically
  const totalReferralsCount = referrals.length;
  const activeEarningReferrals = referrals.filter(r => r.status !== "Lead Only").length;
  
  const cumulativeCommissions = referrals.reduce((acc, curr) => acc + curr.commissionEarned, 0);
  const pendingClearances = referrals.filter(r => r.status === "Pending").reduce((acc, curr) => acc + curr.commissionEarned, 0);
  const clearedCommissions = cumulativeCommissions - pendingClearances;

  // Handles adding a referral lead dynamically from agency desk
  const handleAddMockLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName.trim()) {
      setLeadInjectedError("Please provide a name to generate a referral partner.");
      return;
    }
    setLeadInjectedError("");

    const price = getCoursePrice(newLeadCourse);
    const earned = (newLeadStatus === "Completed" || newLeadStatus === "Pending") ? getCommissionForCourse(newLeadCourse, partnerLevel) : 0;

    const randomID = `REF-${Math.floor(4000 + Math.random() * 5999)}`;
    const freshLead: ReferralLead = {
      id: randomID,
      name: newLeadName,
      phone: newLeadPhone.trim() || "+91 99679 xxxxx",
      courseSelected: newLeadCourse,
      coursePrice: price,
      commissionEarned: earned,
      date: new Date().toISOString().split("T")[0],
      status: newLeadStatus
    };

    setReferrals([freshLead, ...referrals]);
    setNewLeadName("");
    setNewLeadPhone("");

    if (fbUser) {
      try {
        const refDocRef = doc(db, "users", fbUser.uid, "referrals", randomID);
        await setDoc(refDocRef, {
          ...freshLead,
          referrerUid: fbUser.uid,
          createdAt: serverTimestamp()
        });
      } catch (err) {
        console.error("Error creating referral in database:", err);
      }
    }
  };

  // Handles processing withdrawal settlements on UPI ID
  const handleTriggerWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payoutUpi.trim()) return;
    setPayoutLoading(true);

    if (fbUser) {
      try {
        const userDocRef = doc(db, "users", fbUser.uid);
        await updateDoc(userDocRef, {
          payoutUpi: payoutUpi,
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        console.error("Error updating payout UPI in database:", err);
      }
    }

    setTimeout(() => {
      setPayoutLoading(false);
      setPayoutSuccessMsg(`Withdrawal processed! ₹${Number(payoutAmount).toLocaleString("en-IN")} has been dispatched via IMPS to ${payoutUpi}.`);
      setPayoutUpi("");
    }, 1500);
  };

  // Return course name by price for calculator
  const getCourseNameByPrice = (price: number): string => {
    if (price === 4999) return "Basic Training";
    if (price === 29999) return "Mastery Training";
    return "Advance Training";
  };

  // Live calculator calculation using the precise course commissions
  const calculatedOutput = getCommissionForCourse(getCourseNameByPrice(calcCoursePrice), partnerLevel) * calcRecruits;

  // Reset the portal simulation to demonstrate layout again
  const handleBypassLock = () => {
    setIsUnlocked(false);
    setStep(1);
    setRegName("");
    setRegEmail("");
    setRegPhone("");
    setRegUpiPayout("");
    setSelectedEnrollCourse(null);
  };

  return (
    <section id="earning-dashboard" className="py-24 bg-slate-950 text-white relative overflow-hidden border-t border-b border-slate-900">
      
      {/* Decorative gradient overlay backgrounds */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-br from-blue-500/10 to-indigo-500/0 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-amber-500/5 to-amber-500/0 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Dynamic header branding section based on state */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/25 uppercase tracking-widest flex items-center justify-center gap-1.5 w-fit mx-auto">
            {isUnlocked ? <Unlock className="h-3 w-3 text-emerald-400" /> : <Lock className="h-3 w-3" />}
            <span>{isUnlocked ? "Unlocked Agency Desk" : "Secure Partnership Gate"}</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
            {isUnlocked ? "Your Partner Earning Control Panel" : "Register & Unlock Earning Dashboard"}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-3 font-light leading-relaxed">
            {isUnlocked 
              ? `Welcome back, ${currentUser.name}! Analyze real-time referral credits, configure custom referral URLs, compute revenue estimates, and trigger UPI instant cash-outs.`
              : "To access custom referral links, immediate client conversion tracking, and direct commissions, please complete your training registration and secure payment checkout below."
            }
          </p>
          <div className="h-1 w-16 bg-[#2563EB] mx-auto mt-5 rounded-full"></div>
        </div>

        {/* ========================================================================= */}
        {/* CASE 1: ACCESS IS LOCKED -> SHOW INTERACTIVE REGISTRY & CHECKOUT ENGINE */}
        {/* ========================================================================= */}
        {!isUnlocked ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left: Why Join benefits column */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-slate-900/40 p-6 sm:p-8 rounded-3xl border border-slate-900 relative">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-400" />
                    <span>How the Portal Works</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 font-light">
                    Our digital services agency drives active client placements and collaborative community programs. Once registered in your training path, you get full access to build passive royalty pathways.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="h-7 w-7 rounded-lg bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0 text-xs font-bold font-mono">1</div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-100">Step 1: Complete Enrollment Registration</h4>
                      <p className="text-xs text-slate-500 font-light mt-0.5">Secure your placement training slot in Basic, Advance, or Mastery modules.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="h-7 w-7 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 shrink-0 text-xs font-bold font-mono">2</div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-100">Step 2: Generate Customized Invite Codes</h4>
                      <p className="text-xs text-slate-500 font-light mt-0.5">Unlock a unique tag (e.g. ROHIT10) to grant prospective clients custom reductions.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="h-7 w-7 rounded-lg bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 shrink-0 text-xs font-bold font-mono">3</div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-100">Step 3: Collect Up To 25% Passive Dividends</h4>
                      <p className="text-xs text-slate-500 font-light mt-0.5">Track every successful lead sign-up and withdraw settled funds straight into your local UPI bank account securely.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fast Bypass visual action */}
              <div className="mt-8 pt-6 border-t border-slate-800/60 bg-gradient-to-r from-blue-950/20 to-purple-950/20 p-4 rounded-2xl border border-indigo-500/10">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block mb-1">EVALUATOR SHORTCUT</span>
                <p className="text-[10px] text-slate-400 font-light mb-3 leading-relaxed">Skip the checkout simulator step to immediately experience the fully reactive partner dashboard utilities with 1-click.</p>
                <button 
                  onClick={triggerBypassUnlock}
                  className="w-full py-2 bg-gradient-to-r from-[#2563EB] to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>⚡ Fast Demo Bypass Unlock</span>
                </button>
              </div>
            </div>

            {/* Right: Stateful Multi-Step Setup interactive form */}
            <div className="lg:col-span-7 bg-[#0F172A] rounded-3xl border border-slate-850 p-6 sm:p-8 flex flex-col justify-between">
              
              {/* Step indicator tracker top */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-[11px] font-bold text-[#c4b5fd] tracking-widest uppercase bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                  Step {step} of 3
                </span>
                <div className="flex items-center gap-1.5">
                  <div className={`h-2 w-10 rounded-full transition-all duration-300 ${step >= 1 ? "bg-amber-400" : "bg-slate-800"}`}></div>
                  <div className={`h-2 w-10 rounded-full transition-all duration-300 ${step >= 2 ? "bg-amber-400" : "bg-slate-800"}`}></div>
                  <div className={`h-2 w-10 rounded-full transition-all duration-300 ${step >= 3 ? "bg-amber-400" : "bg-slate-800"}`}></div>
                </div>
              </div>

              {/* STEP 1: ENTER INDIVIDUAL DETAILS */}
              {step === 1 && (
                <div className="space-y-5 flex-grow">
                  <div>
                    <h4 className="text-lg font-bold text-white">1. Account Credentials & Training Setup</h4>
                    <p className="text-xs text-slate-400 mt-1">Configure your personal profile keys and select the target study program.</p>
                  </div>

                  {/* Google Authentication Option */}
                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-[#2563EB] font-extrabold uppercase tracking-widest block mb-1">
                      Firebase Database Sync
                    </span>
                    <p className="text-[10px] text-slate-400 font-light mb-2">
                      Connect your Google Account to back up referrals, manage program payout channels, and keep profiles synced across live databases.
                    </p>
                    {fbUser ? (
                      <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-2">
                          {fbUser.photoURL ? (
                            <img src={fbUser.photoURL} alt="Profile" className="h-6 w-6 rounded-full border border-blue-500/50" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                              {fbUser.displayName?.charAt(0) || "U"}
                            </div>
                          )}
                          <div className="text-left">
                            <div className="text-[10px] font-semibold text-slate-100 max-w-[150px] truncate">{fbUser.displayName}</div>
                            <div className="text-[8px] text-emerald-400 font-mono flex items-center gap-1">
                              <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                              Connected to Cloud DB
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={handleSignOut}
                          className="px-2.5 py-1 text-[9px] font-bold text-slate-400 border border-slate-800 rounded-lg hover:bg-slate-900 transition-all cursor-pointer flex items-center gap-1"
                        >
                          <LogOut className="h-2.5 w-2.5" />
                          Sign Out
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={handleGoogleSignIn}
                        className="w-full py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer border border-slate-200"
                      >
                        <span className="w-4 h-4 mr-1 flex items-center justify-center">
                          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                          </svg>
                        </span>
                        Sync with Google Cloud Firestore
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Priya Roy"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 px-4 py-2.5 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                        <input 
                          type="email" 
                          required
                          placeholder="member@sandbox.com"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 px-4 py-2.5 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Phone Number</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. +91 98765xxxxx"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 px-4 py-2.5 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Your UPI payout address (For Instant Commission Receipts)</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. memberwallet@okaxis"
                        value={regUpiPayout}
                        onChange={(e) => setRegUpiPayout(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 px-4 py-2.5 rounded-xl text-xs sm:text-sm text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Package / Plan Selected for Enrollment</label>
                      <select 
                        value={regCourse}
                        onChange={(e) => setRegCourse(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium font-sans"
                      >
                        <option value="Starter Plan" className="text-white">Starter Plan (₹999)</option>
                        <option value="Pro Plan" className="text-white">Pro Plan (₹2,999)</option>
                        <option value="Premium Plan" className="text-white">Premium Plan (₹5,999)</option>
                        <option value="Basic Training" className="text-white">Basic Training (₹4,999)</option>
                        <option value="Advance Training" className="text-white">Advance Training (₹14,999)</option>
                        <option value="Mastery Training" className="text-white">Mastery Training (₹29,999)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Referral Partner Code or Link (Optional)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. SAURABH15 or paste referral URL"
                        value={referrerCode}
                        onChange={(e) => {
                          const val = e.target.value;
                          setReferrerCode(val);
                          // Extract code if a full URL is pasted
                          if (val.includes("ref=")) {
                            const extracted = val.split("ref=")[1]?.split("&")[0] || "";
                            if (extracted) {
                              setReferrerCode(extracted.toUpperCase());
                            }
                          }
                        }}
                        className="w-full bg-slate-950 border border-slate-850 px-4 py-2.5 rounded-xl text-xs sm:text-sm text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      {referrerCode && (
                        <p className="text-[10px] text-emerald-400 mt-1.5 font-medium flex items-center gap-1">
                          <Check className="h-3 w-3 shrink-0" />
                          <span>Referral Partner: <span className="font-bold font-mono text-white bg-emerald-500/15 px-1.5 py-0.5 rounded border border-emerald-500/20">{referrerCode.toUpperCase()}</span> applied (Pricing unaltered; commission tracks securely).</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-850 flex justify-end">
                    <button
                      onClick={() => {
                        if (!regName.trim() || !regEmail.trim() || !regUpiPayout.trim()) {
                          setRegistrationError("Please fill in your primary details to proceed.");
                          return;
                        }
                        setRegistrationError("");
                        setStep(3);
                      }}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1 z-10 cursor-pointer"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: SIMULATED OR REAL PAYMENT CHECKOUT */}
              {step === 3 && (() => {
                const customUrl = regCourse.includes("Basic") ? paymentConfig?.basicCourseUrl : regCourse.includes("Advance") ? paymentConfig?.advanceCourseUrl : paymentConfig?.masteryCourseUrl;
                const payeeUpi = paymentConfig?.ownerUpiId || "ritukamble329@okicici";
                const payeeName = paymentConfig?.ownerName || "Bish";
                const upiDeepLink = `upi://pay?pa=${payeeUpi}&pn=${encodeURIComponent(payeeName)}&am=${currentPayablePrice}&cu=INR&tn=${encodeURIComponent(regCourse + " Enrollment")}`;
                const qrCodeImg = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiDeepLink)}`;

                return (
                  <div className="space-y-5 flex-grow">
                    <div>
                      <h4 className="text-lg font-bold text-white">3. Secure Payment Gateway Checkout</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Enroll in <span className="text-amber-400 font-semibold">{regCourse}</span> for <span className="text-emerald-400 font-extrabold font-mono">₹{currentPayablePrice.toLocaleString("en-IN")}</span>
                        {referrerCode && (
                          <span> (Attributed to referral: <span className="text-emerald-400 font-mono font-bold">{referrerCode.toUpperCase()}</span>)</span>
                        )}
                        .
                      </p>
                    </div>

                    {/* Referral Session Card */}
                    <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-850 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Referral Link Session
                        </span>
                        {referrerCode ? (
                          <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                            <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                            Session Linked
                          </span>
                        ) : (
                          <span className="text-[9px] bg-slate-800 text-slate-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            Direct Session
                          </span>
                        )}
                      </div>

                      {referrerCode ? (
                        <div className="space-y-1 text-left">
                          <p className="text-xs text-slate-200">
                            Referrer Code: <span className="text-amber-400 font-mono font-bold">{referrerCode.toUpperCase()}</span>
                          </p>
                          <p className="text-[10px] text-slate-400 leading-normal font-light">
                            Attribution is secured. There is <span className="font-semibold text-white">no discount system</span> applied to this referral session to ensure standard pricing and direct commissions.
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full text-left">
                          <div className="w-full sm:w-1/2">
                            <input
                              type="text"
                              placeholder="Enter Referrer Code (Optional)"
                              value={referrerCode}
                              onChange={(e) => setReferrerCode(e.target.value.toUpperCase())}
                              className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-full placeholder-slate-600"
                            />
                          </div>
                          <span className="text-[9px] text-slate-400 font-medium">(No discount is applied; referral session is purely for partner commission tracking)</span>
                        </div>
                      )}
                    </div>

                    {/* Payment methods tabs */}
                    <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950 rounded-xl border border-slate-850 text-xs text-center font-bold">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("upi")}
                        className={`py-2 rounded-lg transition-colors cursor-pointer ${
                          paymentMethod === "upi" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        UPI / QR Payment
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`py-2 rounded-lg transition-colors cursor-pointer ${
                          paymentMethod === "card" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Card Payment (Simulated)
                      </button>
                    </div>

                    {registrationError && (
                      <div className="p-3 bg-red-500/10 border border-red-500/25 text-red-400 text-xs rounded-xl flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{registrationError}</span>
                      </div>
                    )}

                    <form onSubmit={handleCheckoutPayment} className="space-y-4">
                      {paymentMethod === "upi" ? (
                        <div className="space-y-4 bg-slate-950 p-4 rounded-2xl border border-slate-850">
                          {customUrl ? (
                            <div className="space-y-3 text-center py-2">
                              <span className="text-[10px] bg-blue-500/10 text-blue-400 font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-blue-500/20">
                                Real-Time Gateway Active
                              </span>
                              <p className="text-[11px] text-slate-400">
                                Click the button below to complete your payment securely on our gateway (Instamojo, Razorpay, or Stripe).
                              </p>
                              <a
                                href={customUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all items-center justify-center gap-1.5 shadow-lg cursor-pointer text-center"
                              >
                                <CreditCard className="h-4 w-4" />
                                <span>Proceed to Payment Page ↗</span>
                              </a>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center text-center space-y-4">
                              {/* Secured Merchant Card */}
                              <div className="bg-[#E8F0FE] border border-blue-200 text-slate-900 rounded-[24px] p-5 w-full max-w-sm text-center flex flex-col items-center shadow-lg select-none mx-auto">
                                {/* Header: Payee and Verified status */}
                                <div className="flex items-center gap-2.5 mb-4 w-full justify-start border-b border-blue-100 pb-3">
                                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                                    {payeeName.substring(0, 2).toUpperCase()}
                                  </div>
                                  <div className="text-left">
                                    <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1">
                                      {payeeName}
                                      <span className="bg-blue-500 text-white text-[7px] px-1 py-0.5 rounded-full font-black">✓ VERIFIED</span>
                                    </div>
                                    <div className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">UPI MERCHANT PAYEE</div>
                                  </div>
                                </div>

                                {/* Dynamic QR Code container */}
                                <div className="bg-white p-3 rounded-2xl border border-blue-50 flex items-center justify-center relative mb-4 shadow-sm">
                                  <img 
                                    src={qrCodeImg} 
                                    alt="UPI Secure QR Code" 
                                    className="w-[150px] h-[150px] bg-white rounded-lg" 
                                    referrerPolicy="no-referrer"
                                  />
                                  {/* Center UPI overlay for trustworthiness */}
                                  <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                                    <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md p-0.5 border border-slate-100">
                                      <div className="w-full h-full rounded-full bg-sky-500 flex items-center justify-center text-[5px] text-white font-black tracking-tight leading-none">UPI</div>
                                    </div>
                                  </div>
                                </div>

                                {/* Payee Info & Dynamic Locked Price */}
                                <div className="w-full text-center space-y-1">
                                  <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">SECURE PAYMENT ADDRESS</div>
                                  <div className="text-[10px] font-semibold font-mono bg-white/60 text-slate-700 py-1 px-2.5 rounded-lg break-all">
                                    {payeeUpi}
                                  </div>

                                  <div className="pt-2">
                                    <span className="text-[8px] text-slate-400 uppercase font-extrabold block tracking-wider">LOCKED PAYABLE AMOUNT</span>
                                    <div className="text-2xl font-black font-mono text-slate-900 leading-none">
                                      ₹{currentPayablePrice.toLocaleString("en-IN")}
                                    </div>
                                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{regCourse} Program</p>
                                  </div>
                                </div>

                                {/* Anti-Scam Verification Subtitle */}
                                <div className="mt-3.5 text-[8px] font-bold text-blue-700 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-200/50 w-full uppercase tracking-wider flex items-center justify-center gap-1">
                                  <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-ping"></span>
                                  <span>System-Locked Price: Fraud Prevention Active</span>
                                </div>
                              </div>

                              <div className="w-full">
                                <a
                                  href={upiDeepLink}
                                  className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 text-center shadow-md"
                                >
                                  <span>📱 Open UPI Mobile App (GPay/PhonePe)</span>
                                </a>
                                <p className="text-[9px] text-slate-500 mt-1 italic">
                                  Deep link autofills the exact locked amount on your mobile device.
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="h-px bg-slate-900 my-1"></div>

                          {/* Confirm Payment Toggle */}
                          <div className="flex items-center justify-between p-3.5 bg-slate-950/60 rounded-xl border border-slate-900 mb-1 select-none">
                            <div className="space-y-0.5 text-left">
                              <span className="text-xs font-bold text-slate-200 block">I have completed this UPI payment</span>
                              <span className="text-[10px] text-slate-400 block">Confirm to input verification transaction UTR reference</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setConfirmPaymentToggle(!confirmPaymentToggle);
                                setRegistrationError("");
                              }}
                              className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors shrink-0 ${
                                confirmPaymentToggle ? "bg-blue-600" : "bg-slate-800"
                              }`}
                            >
                              <div
                                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                                  confirmPaymentToggle ? "translate-x-4" : "translate-x-0"
                                }`}
                              />
                            </button>
                          </div>

                          {confirmPaymentToggle && (
                            <div className="space-y-1.5 pt-1.5 text-left">
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                <span>Payment Transaction Reference ID / UTR / Txn ID *</span>
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. 12-digit UPI UTR Number (e.g. 340912857412)"
                                value={upiPaymentId}
                                onChange={(e) => setUpiPaymentId(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold"
                              />
                              <p className="text-[9px] text-slate-500">
                                Enter the exact 12-digit numeric transaction reference code to avoid system enrollment rejection.
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-850">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">CARD NUMBER</label>
                            <input
                              type="text"
                              required
                              placeholder="4111 2222 3333 4444"
                              maxLength={19}
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">EXPIRY DATE</label>
                              <input
                                type="text"
                                required
                                placeholder="MM/YY"
                                maxLength={5}
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">CVV CODE</label>
                              <input
                                type="password"
                                required
                                placeholder="***"
                                maxLength={3}
                                value={cardCVV}
                                onChange={(e) => setCardCVV(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Submit checkout CTA */}
                      <div className="pt-4 border-t border-slate-850 flex justify-between items-center">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          disabled={processingPayment}
                          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" />
                          <span>Back</span>
                        </button>

                        <button
                          type="submit"
                          disabled={processingPayment}
                          className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5"
                        >
                          {processingPayment ? (
                            <>
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              <span>Validating Transaction...</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="h-4 w-4" />
                              <span>Submit Payment & Unlock</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                );
              })()}

              {/* Error list fallback print summary */}
              {registrationError && step !== 3 && (
                <p className="text-xs text-red-400 font-semibold mt-3">{registrationError}</p>
              )}
            </div>

          </div>
        ) : (
          
          // =========================================================================
          // CASE 2: ACCESS IS UNLOCKED -> SHOW UNLOCKED MEMBER PORTAL & REFERRAL LINKS
          // =========================================================================
          <div className="space-y-12">
            
            {/* Dashboard Student Masthead */}
            <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-slate-850 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-lg">
                  {currentUser.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-lg sm:text-xl text-white">{currentUser.name}</span>
                    <span className="bg-[#2563EB] text-white text-[9px] uppercase tracking-widest font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
                      Active Partner
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Registered Profile: <span className="text-slate-200 font-semibold">{currentUser.course}</span> • Earpdesk Level: <span className="text-amber-400 font-bold capitalize">{partnerLevel}</span>
                  </p>
                </div>
              </div>

              {/* Controls reset toggle links */}
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                {fbUser ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[10px] rounded-xl">
                    <Database className="h-3 w-3 animate-pulse" />
                    <span>DATABASE SYNCED</span>
                  </div>
                ) : (
                  <button
                    onClick={handleGoogleSignIn}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Database className="h-3 w-3" />
                    <span>Sync with Firestore</span>
                  </button>
                )}

                {fbUser && (
                  <button
                    onClick={handleSignOut}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-350 hover:text-white border border-slate-800 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1"
                  >
                    <LogOut className="h-3 w-3" />
                    <span>Sign Out</span>
                  </button>
                )}

                <button
                  onClick={handleBypassLock}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-350 hover:text-white border border-slate-800 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Switch Account / Reset Demo
                </button>
              </div>
            </div>

            {/* Level Pager Selector tab */}
            <div className="bg-slate-900/60 p-2 sm:p-3 rounded-2xl border border-slate-800 backdrop-blur-md max-w-2xl mx-auto mb-12 flex justify-between items-center text-xs sm:text-sm">
              <span className="hidden sm:inline font-bold text-slate-400 pl-3 uppercase tracking-wider text-xs">Commission Tier Selector:</span>
              <div className="flex gap-1.5 w-full sm:w-auto">
                <button
                  onClick={() => setPartnerLevel("novice")}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all cursor-pointer ${
                    partnerLevel === "novice"
                      ? "bg-[#2563EB] text-white shadow-md"
                      : "bg-slate-850 hover:bg-slate-800 text-slate-400"
                  }`}
                >
                  Novice (10%)
                </button>
                <button
                  onClick={() => setPartnerLevel("pro")}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all cursor-pointer ${
                    partnerLevel === "pro"
                      ? "bg-amber-500 text-slate-950 shadow-md"
                      : "bg-slate-850 hover:bg-slate-800 text-slate-400"
                  }`}
                >
                  Pro Partner (15%)
                </button>
                <button
                  onClick={() => setPartnerLevel("master")}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all cursor-pointer ${
                    partnerLevel === "master"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md font-extrabold"
                      : "bg-slate-850 hover:bg-slate-800 text-slate-400"
                  }`}
                >
                  Master Desk (25%)
                </button>
              </div>
            </div>

            {/* 4 Cards Stats layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              
              <div className="bg-[#0F172A] p-5 sm:p-6 rounded-2xl border border-slate-850 hover:border-slate-800 transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] uppercase font-bold tracking-widest text-[#2563EB]">CLEARED IN HAND</span>
                  <DollarSign className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono leading-none">
                    ₹{clearedCommissions.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                    <Check className="h-3 w-3 text-emerald-500" /> Direct IMPS Transfer Successful
                  </p>
                </div>
              </div>

              <div className="bg-[#0F172A] p-5 sm:p-6 rounded-2xl border border-slate-850 hover:border-slate-800 transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] uppercase font-bold tracking-widest text-amber-500">PENDING AUDIT</span>
                  <Clock className="h-5 w-5 text-slate-400 animate-pulse" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#F59E0B] font-mono leading-none">
                    ₹{pendingClearances.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-2">
                    Verification in active sequence queue
                  </p>
                </div>
              </div>

              <div className="bg-[#0F172A] p-5 sm:p-6 rounded-2xl border border-slate-850 hover:border-slate-800 transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] uppercase font-bold tracking-widest text-purple-400">PARTNER BASE</span>
                  <Users className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono leading-none">
                    {totalReferralsCount} <span className="text-xs text-slate-500 font-normal">leads</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-2 flex items-center justify-between">
                    <span>{activeEarningReferrals} Paid Members</span>
                    <span className="text-emerald-500 font-semibold">{Math.round((activeEarningReferrals / totalReferralsCount) * 100)}% Conv</span>
                  </p>
                </div>
              </div>

              <div className="bg-[#0F172A] p-5 sm:p-6 rounded-2xl border border-slate-850 hover:border-slate-800 transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] uppercase font-bold tracking-widest text-emerald-400">YOUR REFERRAL CODE</span>
                  <Award className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <div className="flex items-center justify-between bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg mt-1">
                    <span className="text-white font-mono text-sm uppercase tracking-widest font-extrabold">
                      {currentUser.promoCode}
                    </span>
                    <button 
                      onClick={copyPartnerLink}
                      aria-label="Copy partner referral link"
                      className="text-slate-400 hover:text-white transition-colors p-1"
                    >
                      {copiedCode ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-[9px] text-slate-500 mt-2">
                    Assigns {Math.round(getCommissionRate() * 100)}% passive royalty shares & attributes payouts to you.
                  </p>
                </div>
              </div>

            </div>

            {/* Main Grid: Interactive Widgets Side-by-Side */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
              
              {/* LEFT: Live Calculator & Withdrawal Gate */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Interactive Calculator widget */}
                <div className="bg-[#0F172A]/70 p-6 rounded-3xl border border-slate-850">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-amber-500" />
                    <h4 className="font-bold text-base text-white">Monthly Revenue Simulator</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                        <span>Target Referral Program:</span>
                        <span className="font-semibold text-amber-400 text-xs">
                          {calcCoursePrice === 4999 ? "Basic (₹4,999)" : calcCoursePrice === 14999 ? "Advance (₹14,999)" : "Mastery (₹29,999)"}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <button 
                          onClick={() => setCalcCoursePrice(4999)}
                          className={`py-1.5 text-[10px] font-bold rounded-lg border focus:outline-none transition-all ${
                            calcCoursePrice === 4999 ? "bg-blue-600 border-blue-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400"
                          }`}
                        >
                          Basic
                        </button>
                        <button 
                          onClick={() => setCalcCoursePrice(14999)}
                          className={`py-1.5 text-[10px] font-bold rounded-lg border focus:outline-none transition-all ${
                            calcCoursePrice === 14999 ? "bg-blue-600 border-blue-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400"
                          }`}
                        >
                          Advance
                        </button>
                        <button 
                          onClick={() => setCalcCoursePrice(29999)}
                          className={`py-1.5 text-[10px] font-bold rounded-lg border focus:outline-none transition-all ${
                            calcCoursePrice === 29999 ? "bg-blue-600 border-blue-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400"
                          }`}
                        >
                          Mastery
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>Referred Signups:</span>
                        <span className="font-mono font-bold text-white text-xs">{calcRecruits} Members / Mo</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="50" 
                        value={calcRecruits} 
                        onChange={(e) => setCalcRecruits(Number(e.target.value))}
                        className="w-full accent-amber-400 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-1">
                        <span>1 Signup</span>
                        <span>50 Signups</span>
                      </div>
                    </div>

                    <div className="h-px bg-slate-800/80 my-2"></div>

                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/60 text-center">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Estimated Commission Share</span>
                      <div className="text-2xl font-black text-amber-400 mt-1 font-mono">
                        ₹{calculatedOutput.toLocaleString("en-IN")}
                      </div>
                      <span className="text-[9px] text-slate-500 block mt-1 leading-normal font-light">
                        Guaranteed flat payout commission rate per enrollment signup
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct payout gateway simulated */}
                <div className="bg-[#0F172A]/70 p-6 rounded-3xl border border-slate-850">
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    <h4 className="font-bold text-base text-white">Instant IMPS Settlement</h4>
                  </div>

                  {payoutSuccessMsg ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-center space-y-3">
                      <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-400" />
                      <p className="text-xs font-semibold">{payoutSuccessMsg}</p>
                      <button 
                        onClick={() => {
                          setPayoutSuccessMsg("");
                          setPayoutAmount("5000");
                        }}
                        className="text-[10px] font-bold text-white hover:underline uppercase tracking-wide block mx-auto cursor-pointer"
                      >
                        Initiate Another Payout
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleTriggerWithdrawal} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">WITHDRAWABLE BALANCES</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-sm">₹</span>
                          <input 
                            type="number"
                            required
                            value={payoutAmount}
                            onChange={(e) => setPayoutAmount(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 pl-8 pr-4 py-2 rounded-xl text-sm font-semibold font-mono text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                            placeholder="Amount to draw"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">PAYOUT UPI ID (UPI ADDRESS)</label>
                        <input 
                          type="text"
                          required
                          value={payoutUpi}
                          onChange={(e) => setPayoutUpi(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                          placeholder="e.g. memberwallet@okaxis"
                        />
                      </div>

                      <button 
                        type="submit" 
                        disabled={payoutLoading || !payoutUpi}
                        className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer font-sans"
                      >
                        {payoutLoading ? (
                          <>
                            <RefreshCw className="h-3 w-3 animate-spin" />
                            <span>Processing IMPS Clearance...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-3 w-3" />
                            <span>Request Instant Payout</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>

                {/* Historical User Payment entries logs to provide transparency */}
                <div className="bg-[#0F172A]/70 p-6 rounded-3xl border border-slate-850 space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <div>
                      <h4 className="font-bold text-base text-white">Enrollment & Purchase History</h4>
                      <p className="text-[10px] text-slate-400">Audited logs of your secure membership transactions</p>
                    </div>
                  </div>

                  {userPayments.length === 0 ? (
                    <div className="text-center py-6 bg-slate-900/30 rounded-2xl border border-slate-850/50">
                      <p className="text-xs text-slate-500">No transactions recorded yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                      {userPayments.map((payment) => (
                        <div key={payment.id} className="p-3 bg-slate-900/50 rounded-2xl border border-slate-800 flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-200">{payment.courseOrPlanName}</span>
                            <span className="text-xs font-black text-amber-400 font-mono">
                              ₹{payment.amount.toLocaleString("en-IN")}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-400 font-medium">Ref / UTR: <span className="font-mono text-slate-200 font-bold">{payment.transactionId}</span></span>
                            <span className="text-slate-500 font-medium">{payment.date}</span>
                          </div>

                          <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/40">
                            <span className="text-[9px] text-slate-500 uppercase font-extrabold tracking-wider">
                              Method: {payment.paymentMethod.toUpperCase()}
                            </span>
                            {payment.status === "Completed" ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                <span className="h-1 w-1 bg-emerald-400 rounded-full"></span>
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                                <span className="h-1 w-1 bg-amber-500 rounded-full animate-ping"></span>
                                Pending Audit
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* RIGHT COLUMN: Live Interactive Referrals Tree Ledger & Injector */}
              <div className="lg:col-span-8 bg-[#0F172A] rounded-3xl border border-slate-850 p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h4 className="font-bold text-lg text-white">Direct Partnerships Registry Ledger</h4>
                    <p className="text-xs text-slate-400 mt-1">Real-time status of clients registering with your referral code.</p>
                  </div>

                  {/* Instant injector drawer for live interaction playground demonstration */}
                  <div className="bg-slate-900 px-3 py-1 text-slate-400 text-[10px] font-mono rounded-lg border border-slate-800 flex items-center gap-1.5 self-start shrink-0">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>SANDBOX MODE ACTIVE</span>
                  </div>
                </div>

                {/* Simulated Lead Injector Form */}
                <form onSubmit={handleAddMockLead} className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 mb-6 text-left">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 block mb-2.5 font-bold">Inject Mock Referral Signup to Test Dashboard Calculations:</span>
                  {leadInjectedError && <p className="text-xs text-red-400 mb-2">{leadInjectedError}</p>}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1.5">Client Full Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Saurabh Kamle"
                        value={newLeadName}
                        onChange={(e) => setNewLeadName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1.5">Purchased Module / Service</label>
                      <select 
                        value={newLeadCourse} 
                        onChange={(e) => setNewLeadCourse(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <optgroup label="Training Programs" className="bg-slate-900 text-amber-400 font-bold">
                          <option value="Basic Training" className="text-white">Basic Training (₹4,999)</option>
                          <option value="Advance Training" className="text-white">Advance Training (₹14,999)</option>
                          <option value="Mastery Training" className="text-white">Mastery Training (₹29,999)</option>
                          <option value="Starter Plan" className="text-white">Starter Plan (₹999)</option>
                          <option value="Pro Plan" className="text-white">Pro Plan (₹2,999)</option>
                          <option value="Premium Plan" className="text-white">Premium Plan (₹5,999)</option>
                        </optgroup>
                        <optgroup label="Agency Services" className="bg-slate-900 text-blue-400 font-bold">
                          <option value="Digital Marketing" className="text-white">Digital Marketing (₹9,999)</option>
                          <option value="Social Media Marketing" className="text-white">Social Media Marketing (₹7,999)</option>
                          <option value="Influencer Marketing" className="text-white">Influencer Marketing (₹12,499)</option>
                          <option value="Affiliate Marketing" className="text-white">Affiliate Marketing (₹6,999)</option>
                          <option value="Performance Marketing" className="text-white">Performance Marketing (₹14,999)</option>
                          <option value="AI Services" className="text-white">AI Services (₹11,999)</option>
                          <option value="Editing (Photos, Videos, Thumbnails)" className="text-white">Editing (Photos, Videos, Thumbnails) (₹3,999)</option>
                          <option value="Followers & Growth" className="text-white">Followers & Growth (₹2,499)</option>
                          <option value="Logo Designing" className="text-white">Logo Designing (₹1,999)</option>
                          <option value="Poster Designing" className="text-white">Poster Designing (₹1,499)</option>
                          <option value="Animations" className="text-white">Animations (₹8,999)</option>
                          <option value="ADS Campaign" className="text-white">ADS Campaign (₹9,999)</option>
                          <option value="Custom Solutions & Many More..." className="text-white">Custom Solutions & Many More...</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end pt-3 border-t border-slate-800/45">
                    <div className="sm:col-span-5">
                      <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1.5">Client Number (Phone)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. +91 99679 xxxxx"
                        value={newLeadPhone}
                        onChange={(e) => setNewLeadPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1.5">Payment Status</label>
                      <select 
                        value={newLeadStatus} 
                        onChange={(e) => setNewLeadStatus(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Completed">Paid (Settled)</option>
                        <option value="Pending">Pending (Clearance)</option>
                        <option value="Lead Only">Lead Only (No Payment)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <button 
                        type="submit"
                        className="w-full bg-[#2563EB] hover:bg-blue-500 text-white py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Inject Lead</span>
                      </button>
                    </div>
                  </div>
                </form>

                {/* Referrals table list */}
                <div className="overflow-x-auto rounded-xl border border-slate-850">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase text-[9px] tracking-wider font-bold bg-slate-900/40">
                        <th className="py-3 px-4 font-bold">Referent Details</th>
                        <th className="py-3 px-4 font-bold">Purchased Module</th>
                        <th className="py-3 px-4 font-bold">Price Value</th>
                        <th className="py-3 px-4 font-bold">Commissions Yielded</th>
                        <th className="py-3 px-4 font-bold">Registration Action</th>
                        <th className="py-3 px-4 font-bold text-right">Status State</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {referrals.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-850/40 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-100 flex items-center gap-2">
                            <div className="bg-slate-800 text-slate-300 w-8 h-8 rounded-full flex items-center justify-center uppercase font-black text-[10px] shrink-0 border border-slate-700/50">
                              {item.name.substring(0, 2)}
                            </div>
                            <div>
                              <span className="font-bold text-slate-100 block">{item.name}</span>
                              <div className="flex flex-col gap-0.5 mt-0.5">
                                <span className="text-[9px] text-slate-500 font-mono block">ID: {item.id}</span>
                                {item.phone && <span className="text-[9px] text-slate-400 font-medium block">Phone: {item.phone}</span>}
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-300 font-medium">{item.courseSelected}</td>
                          <td className="py-3.5 px-4 font-mono text-slate-400">₹{item.coursePrice.toLocaleString("en-IN")}</td>
                          <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                            {item.commissionEarned > 0 ? `₹${item.commissionEarned.toLocaleString("en-IN")}` : "—"}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 text-[10px] font-light">{item.date}</td>
                          <td className="py-3.5 px-4 text-right">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide ${
                              item.status === "Completed" 
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                : item.status === "Pending" 
                                  ? "bg-amber-400/10 text-amber-400 border border-amber-400/20"
                                  : "bg-slate-850 text-slate-400 border border-slate-800"
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>

            {/* Link Share URL Banner */}
            <div className="p-6 bg-slate-900 border border-slate-850 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-slate-200">Your Dedicated Referral Link</h4>
                <p className="text-xs text-slate-400 mt-1">Share this custom referral URL of Infinite SEO with clients to record passive commissions under your name.</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 border border-slate-800 rounded-xl grow sm:max-w-md">
                <input 
                  type="text" 
                  readOnly 
                  value={`https://infiniteseo.com/join?ref=${currentUser.promoCode}`}
                  className="bg-transparent text-xs text-slate-350 font-mono focus:outline-none w-full"
                />
                <button 
                  onClick={copyPartnerLink}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {copiedCode ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Informative affiliate program highlights layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#0F172A] p-6 sm:p-8 rounded-3xl border border-slate-850">
              
              <div className="space-y-2">
                <h5 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span className="bg-[#2563EB]/20 text-[#2563EB] text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">1</span>
                  <span>Promote Your Referral Code</span>
                </h5>
                <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                  Use your personalized code <span className="text-amber-400 font-semibold">{currentUser.promoCode}</span> to register clients and allocate royalty shares to your payout ledger instantly!
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span className="bg-[#2563EB]/20 text-[#2563EB] text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">2</span>
                  <span>Instant Client Conversion Audit</span>
                </h5>
                <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                  Whenever a subscriber completes checking out with your unique tag, our secure ledger tracking registers the clearance metrics automatically.
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span className="bg-[#2563EB]/20 text-[#2563EB] text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">3</span>
                  <span>Flexible Cleared Settlements</span>
                </h5>
                <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                  Direct your cleared dividends with extreme flexibility directly through your verified UPI address payment, cleared within a 4-hour settlement window.
                </p>
              </div>

            </div>

          </div>
        )}

      </div>

    </section>
  );
}
