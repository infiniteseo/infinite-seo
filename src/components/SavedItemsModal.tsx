import React, { useState, useEffect } from "react";
import { DatabaseService } from "../services/databaseService";
import { auth } from "../firebase";
import { User, Referral, UserPayment, Inquiry, WorkshopRegistration } from "../types";
import { 
  X, 
  User as UserIcon, 
  Award, 
  Copy, 
  Check, 
  FolderSync, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  MessageSquare, 
  DollarSign, 
  BookOpen, 
  Calendar,
  Share2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SavedItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

type TabType = "profile" | "workshops" | "referrals" | "payments" | "inquiries";

export default function SavedItemsModal({ isOpen, onClose, user }: SavedItemsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [copied, setCopied] = useState(false);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [payments, setPayments] = useState<UserPayment[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [workshops, setWorkshops] = useState<WorkshopRegistration[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user?.uid) {
      loadUserData(user.uid);
    }
  }, [isOpen, user]);

  const loadUserData = async (uid: string) => {
    setLoading(true);
    try {
      const [refs, pays, inqs, wss] = await Promise.all([
        DatabaseService.getReferrals(uid),
        DatabaseService.getUserPayments(uid),
        DatabaseService.getUserInquiries(uid),
        DatabaseService.getUserWorkshopRegistrations(uid)
      ]);
      setReferrals(refs);
      setPayments(pays);
      setInquiries(inqs);
      setWorkshops(wss);
    } catch (err) {
      console.warn("Error loading saved items:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs: { id: TabType; label: string; count?: number }[] = [
    { id: "profile", label: "My Profile" },
    { id: "workshops", label: "My Workshops", count: workshops.length },
    { id: "referrals", label: "Referral Leads", count: referrals.length },
    { id: "payments", label: "Enrollments", count: payments.length },
    { id: "inquiries", label: "Inquiries", count: inquiries.length },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm"
        />

        {/* Modal panel */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl relative overflow-hidden flex flex-col h-[85vh] max-h-[620px] text-left"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/40">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#F59E0B]">
                <FolderSync className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white tracking-tight">My Saved Workspace</h3>
                <p className="text-xs text-slate-400 mt-0.5">Securely synchronized cloud backup space</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 border-b border-slate-800/65 flex gap-2 overflow-x-auto bg-slate-950/20 shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3.5 px-3 font-semibold text-xs uppercase tracking-wider relative transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id 
                    ? "text-[#F59E0B]" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                    activeTab === tab.id 
                      ? "bg-[#F59E0B]/10 text-[#F59E0B]" 
                      : "bg-slate-800 text-slate-400"
                  }`}>
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeModalTabBorder" 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F59E0B]" 
                  />
                )}
              </button>
            ))}
          </div>

          {/* Scrollable Content Container */}
          <div className="flex-grow p-6 overflow-y-auto bg-slate-900/40">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="h-8 w-8 text-[#F59E0B] border-2 border-[#F59E0B] border-t-transparent rounded-full"
                />
                <p className="text-xs uppercase tracking-widest font-mono">Synchronizing workspace data...</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  {/* TAB: PROFILE */}
                  {activeTab === "profile" && (
                    <div className="space-y-6">
                      <div className="bg-slate-950/45 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-5">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-blue-600 to-amber-500 flex items-center justify-center text-white text-2xl font-black shadow-lg uppercase">
                          {user.name ? user.name.substring(0, 2) : "LP"}
                        </div>
                        <div className="text-center sm:text-left flex-grow">
                          <h4 className="text-lg font-bold text-slate-100">{user.name || "Learner Partner"}</h4>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">{user.email}</p>
                          <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-2.5">
                            <span className="bg-amber-500/10 border border-amber-500/25 text-[#F59E0B] text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Award className="h-3 w-3" />
                              Level: {user.partnerLevel ? user.partnerLevel.toUpperCase() : "PRO"}
                            </span>
                            <span className="bg-slate-800 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded-md">
                              UID: {user.uid.substring(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Promo Code & Share block */}
                      {user.promoCode && (
                        <div className="bg-slate-950/30 p-5 rounded-2xl border border-slate-800">
                          <h5 className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold mb-2 flex items-center gap-1.5">
                            <Share2 className="h-3.5 w-3.5 text-blue-400" />
                            My Personal Affiliation Promo Code:
                          </h5>
                          <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-850">
                            <span className="font-mono text-base font-black text-amber-400 tracking-wider flex-grow">
                              {user.promoCode}
                            </span>
                            <button
                              onClick={() => handleCopyCode(user.promoCode || "")}
                              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              {copied ? (
                                <>
                                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                                  <span className="text-emerald-400">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed mt-2.5">
                            Share your personal code with your friends! They get a <span className="font-semibold text-white">10% discount</span> on any practical digital marketing or agency training module, and you earn up to <span className="font-semibold text-amber-400">₹5,000 direct payout</span> commission per enrollment!
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB: WORKSHOPS */}
                  {activeTab === "workshops" && (
                    <div className="h-full">
                      {workshops.length === 0 ? (
                        <div className="h-44 flex flex-col items-center justify-center text-slate-500 gap-1">
                          <Calendar className="h-8 w-8 text-slate-600 mb-1" />
                          <p className="text-sm font-bold">No Registered Workshops Found</p>
                          <p className="text-xs text-slate-400 text-center">Claim free tickets in the live training section on the main page!</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {workshops.map((ws) => (
                            <div key={ws.id} className="bg-slate-950/45 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                              <div className="min-w-0">
                                <h5 className="font-bold text-slate-100 text-sm truncate" title={ws.workshopTitle}>{ws.workshopTitle}</h5>
                                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-[11px] text-slate-400">
                                  <span className="font-mono text-amber-400 font-bold">Ticket ID: {ws.id}</span>
                                  <span className="text-slate-300 font-semibold">{ws.workshopDate}</span>
                                </div>
                                <span className="text-[10px] text-slate-500 mt-1 block flex items-center gap-1">
                                  <Clock className="h-3 w-3" /> Registered: {new Date(ws.registeredAt).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  <CheckCircle2 className="h-3.5 w-3.5" /> Confirmed
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB: REFERRALS */}
                  {activeTab === "referrals" && (
                    <div className="h-full">
                      {referrals.length === 0 ? (
                        <div className="h-44 flex flex-col items-center justify-center text-slate-500 gap-1">
                          <DollarSign className="h-8 w-8 text-slate-600 mb-1" />
                          <p className="text-sm font-bold">No Referral Leads Cataloged Yet</p>
                          <p className="text-xs text-slate-400">Refer clients using your promo code to accumulate earnings!</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {referrals.map((item) => (
                            <div key={item.id} className="bg-slate-950/45 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-100 text-sm truncate">{item.name}</span>
                                  <span className="text-[9px] font-mono text-slate-500">ID: {item.id}</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">Purchased: <span className="font-medium text-slate-300">{item.courseSelected}</span></p>
                                <span className="text-[10px] text-slate-500 mt-0.5 block flex items-center gap-1">
                                  <Calendar className="h-3 w-3" /> {item.date}
                                </span>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-sm font-extrabold text-amber-400 block font-mono">
                                  +₹{item.commissionEarned.toLocaleString("en-IN")}
                                </span>
                                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1.5 ${
                                  item.status === "Completed" 
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : item.status === "Pending"
                                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                    : "bg-slate-800 text-slate-400 border border-slate-700/55"
                                }`}>
                                  {item.status === "Completed" && <CheckCircle2 className="h-3 w-3" />}
                                  {item.status === "Pending" && <Clock className="h-3 w-3 animate-pulse" />}
                                  {item.status === "Lead Only" && <AlertTriangle className="h-3 w-3" />}
                                  {item.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB: PAYMENTS */}
                  {activeTab === "payments" && (
                    <div className="h-full">
                      {payments.length === 0 ? (
                        <div className="h-44 flex flex-col items-center justify-center text-slate-500 gap-1">
                          <BookOpen className="h-8 w-8 text-slate-600 mb-1" />
                          <p className="text-sm font-bold">No Practical Enrollments Found</p>
                          <p className="text-xs text-slate-400">Enroll in any practical modules to lock in active placements.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {payments.map((pay) => (
                            <div key={pay.id} className="bg-slate-950/45 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                              <div>
                                <h5 className="font-bold text-slate-100 text-sm">{pay.courseOrPlanName}</h5>
                                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-[11px] text-slate-400">
                                  <span className="font-mono text-slate-300">UTR/ID: {pay.transactionId}</span>
                                  <span className="capitalize">Method: {pay.paymentMethod}</span>
                                </div>
                                <span className="text-[10px] text-slate-500 mt-1 block flex items-center gap-1">
                                  <Calendar className="h-3 w-3" /> {pay.date}
                                </span>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-sm font-extrabold text-[#F59E0B] block font-mono">
                                  ₹{pay.amount.toLocaleString("en-IN")}
                                </span>
                                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1.5 ${
                                  pay.status === "Completed" 
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse"
                                }`}>
                                  {pay.status === "Completed" ? (
                                    <CheckCircle2 className="h-3 w-3" />
                                  ) : (
                                    <Clock className="h-3 w-3" />
                                  )}
                                  {pay.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB: INQUIRIES */}
                  {activeTab === "inquiries" && (
                    <div className="h-full">
                      {inquiries.length === 0 ? (
                        <div className="h-44 flex flex-col items-center justify-center text-slate-500 gap-1">
                          <MessageSquare className="h-8 w-8 text-slate-600 mb-1" />
                          <p className="text-sm font-bold">No Saved Contact Inquiries Found</p>
                          <p className="text-xs text-slate-400">Drop a message in the contact form to save details here!</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {inquiries.map((inq, index) => (
                            <div key={index} className="bg-slate-950/45 p-4.5 rounded-xl border border-slate-800">
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="min-w-0">
                                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wide block">Subject:</span>
                                  <h6 className="font-extrabold text-slate-100 text-sm truncate mt-0.5">{inq.userSubject || "General Inquiry"}</h6>
                                </div>
                                <span className="text-[10px] text-slate-500 shrink-0 font-medium">
                                  {inq.createdAt ? inq.createdAt.split("T")[0] : ""}
                                </span>
                              </div>
                              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-850 text-xs text-slate-300 italic leading-relaxed">
                                "{inq.userMessage}"
                              </div>
                              <div className="mt-2.5 flex justify-between items-center text-[10px] text-slate-400">
                                <span>Sent from: <strong className="text-slate-300">{inq.userName}</strong></span>
                                <span className="text-slate-500">{inq.userEmail}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Footer controls */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end shrink-0">
            <button 
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded-lg transition-colors cursor-pointer"
            >
              Close Workspace
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
