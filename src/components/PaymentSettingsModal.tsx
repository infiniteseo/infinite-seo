import React, { useState, useEffect } from "react";
import { 
  Settings, CreditCard, QrCode, Save, Link, Check, X, Shield, 
  Globe, Award, Download, Printer, Copy, RefreshCw, Smartphone, Sparkles 
} from "lucide-react";
import { DatabaseService } from "../services/databaseService";
import { PaymentConfig } from "../types";

export default function PaymentSettingsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<PaymentConfig | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Custom interactive QR Generator States
  const [activeTab, setActiveTab] = useState<"gateways" | "generator">("gateways");
  const [qrUpiId, setQrUpiId] = useState("");
  const [qrName, setQrName] = useState("");
  const [qrAmount, setQrAmount] = useState("");
  const [qrRemark, setQrRemark] = useState("Training Enrollment");
  const [qrTheme, setQrTheme] = useState<"gpay" | "phonepe" | "dark" | "gold">("gpay");
  const [qrAvatarText, setQrAvatarText] = useState("Bish");
  const [qrLogo, setQrLogo] = useState<"none" | "gpay" | "phonepe" | "upi">("upi");
  const [copiedLink, setCopiedLink] = useState(false);
  const [defaultSavedFeedback, setDefaultSavedFeedback] = useState(false);
  const [saveForFuture, setSaveForFuture] = useState<boolean>(() => {
    return localStorage.getItem("payment_settings_save_for_future") !== "false";
  });

  useEffect(() => {
    async function loadConfig() {
      try {
        const data = await DatabaseService.getPaymentConfig();
        setConfig(data);
        if (data) {
          const savePref = localStorage.getItem("payment_settings_save_for_future") !== "false";
          setSaveForFuture(savePref);
          
          if (savePref) {
            const savedPrefs = localStorage.getItem("qr_generator_preferences");
            if (savedPrefs) {
              try {
                const prefs = JSON.parse(savedPrefs);
                setQrUpiId(prefs.qrUpiId || data.ownerUpiId || "ritukamble329@okicici");
                setQrName(prefs.qrName || data.ownerName || "Bish");
                if (prefs.qrAmount !== undefined) setQrAmount(prefs.qrAmount);
                if (prefs.qrRemark) setQrRemark(prefs.qrRemark);
                if (prefs.qrTheme) setQrTheme(prefs.qrTheme);
                if (prefs.qrAvatarText) setQrAvatarText(prefs.qrAvatarText);
                if (prefs.qrLogo) setQrLogo(prefs.qrLogo);
                return;
              } catch (e) {
                console.error("Error parsing QR generator preferences:", e);
              }
            }
          }
          setQrUpiId(data.ownerUpiId || "ritukamble329@okicici");
          setQrName(data.ownerName || "Bish");
        }
      } catch (err) {
        console.error("Failed to load payment configuration:", err);
      }
    }
    loadConfig();
  }, []);

  const handleChange = (field: keyof PaymentConfig, value: any) => {
    if (!config) return;
    setConfig({
      ...config,
      [field]: value
    });
  };

  const handleSaveForFutureChange = (checked: boolean) => {
    setSaveForFuture(checked);
    localStorage.setItem("payment_settings_save_for_future", String(checked));
    if (!checked) {
      localStorage.removeItem("infinite_seo_payment_config");
      localStorage.removeItem("qr_generator_preferences");
    } else if (config) {
      localStorage.setItem("infinite_seo_payment_config", JSON.stringify(config));
      const qrPrefs = {
        qrUpiId,
        qrName,
        qrAmount,
        qrRemark,
        qrTheme,
        qrAvatarText,
        qrLogo
      };
      localStorage.setItem("qr_generator_preferences", JSON.stringify(qrPrefs));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    setLoading(true);
    setIsSaved(false);

    try {
      await DatabaseService.savePaymentConfig(config, saveForFuture);
      if (saveForFuture) {
        const qrPrefs = {
          qrUpiId,
          qrName,
          qrAmount,
          qrRemark,
          qrTheme,
          qrAvatarText,
          qrLogo
        };
        localStorage.setItem("qr_generator_preferences", JSON.stringify(qrPrefs));
      } else {
        localStorage.removeItem("qr_generator_preferences");
      }
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save payment config:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsDefault = async () => {
    if (!config) return;
    setLoading(true);
    const updatedConfig = {
      ...config,
      ownerUpiId: qrUpiId,
      ownerName: qrName
    };
    try {
      await DatabaseService.savePaymentConfig(updatedConfig, saveForFuture);
      if (saveForFuture) {
        const qrPrefs = {
          qrUpiId,
          qrName,
          qrAmount,
          qrRemark,
          qrTheme,
          qrAvatarText,
          qrLogo
        };
        localStorage.setItem("qr_generator_preferences", JSON.stringify(qrPrefs));
      } else {
        localStorage.removeItem("qr_generator_preferences");
      }
      setConfig(updatedConfig);
      setDefaultSavedFeedback(true);
      setTimeout(() => setDefaultSavedFeedback(false), 3000);
    } catch (err) {
      console.error("Failed to save default merchant config:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    const upiLink = `upi://pay?pa=${qrUpiId}&pn=${encodeURIComponent(qrName)}&am=${qrAmount}&cu=INR&tn=${encodeURIComponent(qrRemark)}`;
    navigator.clipboard.writeText(upiLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    const upiLink = `upi://pay?pa=${qrUpiId}&pn=${encodeURIComponent(qrName)}&am=${qrAmount}&cu=INR&tn=${encodeURIComponent(qrRemark)}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`;
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to open the print layout.");
      return;
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>Print UPI QR Code Flyer - ${qrName}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              body { background: white; color: black; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body class="bg-slate-50 flex flex-col items-center justify-center min-h-screen p-8">
          <div class="bg-white border border-slate-200 rounded-[32px] p-8 max-w-sm w-full shadow-2xl text-center flex flex-col items-center relative">
            <div class="flex items-center gap-3 mb-6 w-full justify-start border-b pb-4">
              <div class="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-extrabold text-lg">
                ${(qrAvatarText || "IS").toUpperCase()}
              </div>
              <div class="text-left">
                <div class="font-extrabold text-slate-900 flex items-center gap-1.5">
                  ${qrName}
                  <span class="text-blue-500 text-xs">✓</span>
                </div>
                <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">UPI MERCHANT PAYEE</div>
              </div>
            </div>
            
            <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center justify-center relative mb-6">
              <img src="${qrCodeUrl}" alt="Scan QR" class="w-[200px] h-[200px]" />
            </div>

            <div class="w-full text-center space-y-1">
              <div class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">UPI ID</div>
              <div class="text-xs font-semibold font-mono text-slate-800 bg-slate-100 py-1.5 px-3 rounded-lg break-all">
                ${qrUpiId}
              </div>
              ${qrAmount ? `
                <div class="text-2xl font-black text-slate-900 mt-4 font-mono">
                  ₹${parseFloat(qrAmount).toLocaleString("en-IN")}
                </div>
                <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">${qrRemark || "SEO Training Enrollment"}</div>
              ` : ''}
            </div>

            <div class="mt-8 text-[11px] text-slate-400 border-t pt-4 w-full font-medium">
              Scan to pay using Google Pay, PhonePe, Paytm, or BHIM.
            </div>
          </div>
          
          <div class="mt-6 no-print">
            <button onclick="window.print()" class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md">
              Print Flyer
            </button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (!config) return null;

  // Active QR URL
  const activeUpiLink = `upi://pay?pa=${qrUpiId}&pn=${encodeURIComponent(qrName)}&am=${qrAmount}&cu=INR&tn=${encodeURIComponent(qrRemark)}`;
  const activeQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(activeUpiLink)}`;

  return (
    <>
      {/* Floating Settings Trigger Button */}
      {/* <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-widest px-4 py-3.5 rounded-full shadow-2xl transition-all duration-300 flex items-center gap-2 hover:scale-105 border border-amber-300/30 cursor-pointer"
        title="Configure Payment Gateway Links"
      >
        <Settings className="h-4 w-4 animate-spin-slow text-slate-950" />
        <span>Configure Payment Links</span>
      </button> */}

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className={`bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 w-full shadow-2xl relative animate-in fade-in zoom-in duration-200 transition-all ${
            activeTab === "generator" ? "max-w-4xl" : "max-w-lg"
          }`}>
            
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800 mb-5">
              <div>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full uppercase tracking-widest font-extrabold flex items-center gap-1 w-max">
                  <Shield className="h-3 w-3" />
                  Owner Portal
                </span>
                <h3 className="text-xl font-bold text-white mt-2 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-amber-500" />
                  Configure Your Payment Gateway
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Configure direct payment channels, links, and custom QR Codes.
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1.5 hover:bg-slate-800 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab("gateways")}
                className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeTab === "gateways"
                    ? "border-amber-500 text-amber-500 font-extrabold"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Configure Gateways
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("generator")}
                className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "generator"
                    ? "border-amber-500 text-amber-500 font-extrabold"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <QrCode className="h-4 w-4" />
                Interactive QR Code Generator
              </button>
            </div>

            {/* GATEWAY LINKS CONFIGURATION TAB */}
            {activeTab === "gateways" && (
              <form onSubmit={handleSave} className="space-y-5">
                {/* UPI ID and Name */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                    <QrCode className="h-4 w-4" />
                    Direct UPI QR Code Settings
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Provide a valid UPI ID to automatically generate a scannable QR Code and mobile deep-link during checkouts. 
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Payee UPI ID</label>
                      <input
                        type="text"
                        required
                        value={config.ownerUpiId}
                        onChange={(e) => handleChange("ownerUpiId", e.target.value)}
                        placeholder="e.g. infiniteseo@okaxis"
                        className="w-full bg-slate-900 border border-slate-800 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Payee Account Name</label>
                      <input
                        type="text"
                        required
                        value={config.ownerName}
                        onChange={(e) => handleChange("ownerName", e.target.value)}
                        placeholder="e.g. Infinite SEO"
                        className="w-full bg-slate-900 border border-slate-800 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1.5">
                    <input
                      type="checkbox"
                      id="qrCodeEnabled"
                      checked={config.qrCodeEnabled}
                      onChange={(e) => handleChange("qrCodeEnabled", e.target.checked)}
                      className="rounded text-amber-500 focus:ring-amber-500 h-4 w-4 bg-slate-900 border-slate-800"
                    />
                    <label htmlFor="qrCodeEnabled" className="text-xs text-slate-300 font-medium cursor-pointer">
                      Enable scannable UPI QR codes for enrollments
                    </label>
                  </div>
                </div>

                {/* Training Gateways */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Link className="h-4 w-4 text-amber-500" />
                    Custom Training Payment Links (Optional)
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    Paste payment URLs from Instamojo, Razorpay, Stripe, or Cosmofeed for each training. If left empty, BHIM UPI will handle checkouts.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">
                        Basic Training Payment Link (₹4,999)
                      </label>
                      <input
                        type="url"
                        value={config.basicCourseUrl || ""}
                        onChange={(e) => handleChange("basicCourseUrl", e.target.value)}
                        placeholder="e.g. https://rzp.io/l/basic-seo"
                        className="w-full bg-slate-950 border border-slate-850 px-3.5 py-2 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">
                        Advance Training Payment Link (₹14,999)
                      </label>
                      <input
                        type="url"
                        value={config.advanceCourseUrl || ""}
                        onChange={(e) => handleChange("advanceCourseUrl", e.target.value)}
                        placeholder="e.g. https://rzp.io/l/advance-seo"
                        className="w-full bg-slate-950 border border-slate-850 px-3.5 py-2 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">
                        Mastery Training Payment Link (₹29,999)
                      </label>
                      <input
                        type="url"
                        value={config.masteryCourseUrl || ""}
                        onChange={(e) => handleChange("masteryCourseUrl", e.target.value)}
                        placeholder="e.g. https://rzp.io/l/mastery-seo"
                        className="w-full bg-slate-950 border border-slate-850 px-3.5 py-2 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Plan Gateways */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-amber-500" />
                    Custom Membership Subscription Links (Optional)
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">
                        Starter Plan Subscription Link (₹999/mo)
                      </label>
                      <input
                        type="url"
                        value={config.starterPlanUrl || ""}
                        onChange={(e) => handleChange("starterPlanUrl", e.target.value)}
                        placeholder="e.g. https://buy.stripe.com/starter-sub"
                        className="w-full bg-slate-950 border border-slate-850 px-3.5 py-2 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">
                        Pro Plan Subscription Link (₹2,999/mo)
                      </label>
                      <input
                        type="url"
                        value={config.proPlanUrl || ""}
                        onChange={(e) => handleChange("proPlanUrl", e.target.value)}
                        placeholder="e.g. https://buy.stripe.com/pro-sub"
                        className="w-full bg-slate-950 border border-slate-850 px-3.5 py-2 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">
                        Premium Plan Subscription Link (₹5,999/mo)
                      </label>
                      <input
                        type="url"
                        value={config.premiumPlanUrl || ""}
                        onChange={(e) => handleChange("premiumPlanUrl", e.target.value)}
                        placeholder="e.g. https://buy.stripe.com/premium-sub"
                        className="w-full bg-slate-950 border border-slate-850 px-3.5 py-2 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Save for Future Checkbox */}
                <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-850 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="saveForFutureGateways"
                    checked={saveForFuture}
                    onChange={(e) => handleSaveForFutureChange(e.target.checked)}
                    className="mt-0.5 rounded text-amber-500 focus:ring-amber-500 h-4 w-4 bg-slate-900 border-slate-850 cursor-pointer"
                  />
                  <div className="text-left">
                    <label htmlFor="saveForFutureGateways" className="text-xs text-slate-200 font-bold block cursor-pointer">
                      Save for future use
                    </label>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-normal font-light">
                      If checked, your custom payment links and QR settings will be cached locally in your browser's secure storage for future sessions.
                    </p>
                  </div>
                </div>

                {/* Status Message */}
                {isSaved && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-2">
                    <Check className="h-4 w-4 shrink-0" />
                    <span>Payment Gateway links saved and updated successfully!</span>
                  </div>
                )}

                {/* Submit CTA */}
                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>{loading ? "Saving..." : "Save Settings"}</span>
                  </button>
                </div>
              </form>
            )}

            {/* INTERACTIVE QR CODE GENERATOR TAB */}
            {activeTab === "generator" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mt-4">
                
                {/* Form Controls Column */}
                <div className="space-y-4 bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-850">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Settings className="h-4 w-4 text-amber-500" />
                    QR Card Customization Panel
                  </h4>
                  <p className="text-xs text-slate-400">
                    Customize your GPay or PhonePe style printable checkout QR cards instantly below.
                  </p>

                  <div className="space-y-3 pt-2">
                    {/* VPA UPI ID */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Payee UPI ID</label>
                      <input
                        type="text"
                        value={qrUpiId}
                        onChange={(e) => setQrUpiId(e.target.value)}
                        placeholder="e.g. ritukamble329@okicici"
                        className="w-full bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    {/* Merchant Name */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Payee Name</label>
                      <input
                        type="text"
                        value={qrName}
                        onChange={(e) => setQrName(e.target.value)}
                        placeholder="e.g. Ritukamble / Bish"
                        className="w-full bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    {/* Amount & Quick Presets */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Amount (INR - Optional)</label>
                      <input
                        type="number"
                        value={qrAmount}
                        onChange={(e) => setQrAmount(e.target.value)}
                        placeholder="e.g. 4999 (Leave blank for generic scan)"
                        className="w-full bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                      />
                      
                      {/* Presets */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <button
                          type="button"
                          onClick={() => setQrAmount("4999")}
                          className={`px-2.5 py-1 text-[9px] font-bold rounded-lg transition-all ${
                            qrAmount === "4999" ? "bg-amber-500 text-slate-950" : "bg-slate-800 hover:bg-slate-750 text-slate-300"
                          }`}
                        >
                          ₹4,999 (Basic)
                        </button>
                        <button
                          type="button"
                          onClick={() => setQrAmount("14999")}
                          className={`px-2.5 py-1 text-[9px] font-bold rounded-lg transition-all ${
                            qrAmount === "14999" ? "bg-amber-500 text-slate-950" : "bg-slate-800 hover:bg-slate-750 text-slate-300"
                          }`}
                        >
                          ₹14,999 (Advance)
                        </button>
                        <button
                          type="button"
                          onClick={() => setQrAmount("29999")}
                          className={`px-2.5 py-1 text-[9px] font-bold rounded-lg transition-all ${
                            qrAmount === "29999" ? "bg-amber-500 text-slate-950" : "bg-slate-800 hover:bg-slate-750 text-slate-300"
                          }`}
                        >
                          ₹29,999 (Mastery)
                        </button>
                        <button
                          type="button"
                          onClick={() => setQrAmount("")}
                          className="px-2 py-1 text-[9px] bg-red-950/40 text-red-400 hover:bg-red-900/30 rounded-lg transition-all"
                        >
                          Clear Amount
                        </button>
                      </div>
                    </div>

                    {/* Remark */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Transaction Remark</label>
                      <input
                        type="text"
                        value={qrRemark}
                        onChange={(e) => setQrRemark(e.target.value)}
                        placeholder="e.g. SEO Training Enrollment"
                        className="w-full bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    {/* Initials & Themes Controls */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Profile Initials</label>
                        <input
                          type="text"
                          maxLength={3}
                          value={qrAvatarText}
                          onChange={(e) => setQrAvatarText(e.target.value)}
                          placeholder="e.g. IS"
                          className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white text-center focus:outline-none focus:ring-1 focus:ring-amber-500 uppercase font-black"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Center Overlay Logo</label>
                        <select
                          value={qrLogo}
                          onChange={(e: any) => setQrLogo(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        >
                          <option value="upi">UPI Logo</option>
                          <option value="gpay">GPay Color Badge</option>
                          <option value="phonepe">PhonePe Purple Badge</option>
                          <option value="none">No Center Logo</option>
                        </select>
                      </div>
                    </div>

                    {/* Theme selector buttons */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Select Theme Template</label>
                      <div className="grid grid-cols-4 gap-2">
                        <button
                          type="button"
                          onClick={() => setQrTheme("gpay")}
                          className={`py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all ${
                            qrTheme === "gpay" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          GPay Light
                        </button>
                        <button
                          type="button"
                          onClick={() => setQrTheme("phonepe")}
                          className={`py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all ${
                            qrTheme === "phonepe" ? "bg-indigo-700 text-white" : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          PhonePe
                        </button>
                        <button
                          type="button"
                          onClick={() => setQrTheme("dark")}
                          className={`py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all ${
                            qrTheme === "dark" ? "bg-slate-700 text-white" : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          Slate Dark
                        </button>
                        <button
                          type="button"
                          onClick={() => setQrTheme("gold")}
                          className={`py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all ${
                            qrTheme === "gold" ? "bg-amber-600 text-slate-950 font-black" : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          Premium Gold
                        </button>
                      </div>
                    </div>

                    {/* Save for Future Checkbox in Generator */}
                    <div className="flex items-center gap-2 pt-2 pb-1 bg-slate-950 rounded-xl border border-transparent">
                      <input
                        type="checkbox"
                        id="saveForFutureQr"
                        checked={saveForFuture}
                        onChange={(e) => handleSaveForFutureChange(e.target.checked)}
                        className="rounded text-amber-500 focus:ring-amber-500 h-3.5 w-3.5 bg-slate-900 border-slate-800 cursor-pointer"
                      />
                      <label htmlFor="saveForFutureQr" className="text-[10px] text-slate-300 font-medium cursor-pointer">
                        Save preferences for future QR builds
                      </label>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-850 flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={handleSaveAsDefault}
                      className="flex-1 py-2 bg-slate-800 hover:bg-slate-750 text-amber-400 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-amber-500/20"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>{defaultSavedFeedback ? "Default Payee Saved!" : "Save As Default Payee"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="flex-1 py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-slate-800"
                    >
                      {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedLink ? "Deep-link Copied!" : "Copy UPI Link"}</span>
                    </button>
                  </div>
                </div>

                {/* Card Preview Column */}
                <div className="flex flex-col items-center justify-center p-3">
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-3 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    Merchant QR Card Live Preview
                  </div>

                  {/* Card Main Body */}
                  <div className={`rounded-[32px] p-6 max-w-sm w-full shadow-2xl relative text-center flex flex-col items-center transition-all duration-300 select-none ${
                    qrTheme === "gpay" ? "bg-[#E8F0FE] text-slate-900 border border-blue-200" :
                    qrTheme === "phonepe" ? "bg-[#F3E8FF] text-slate-900 border border-purple-200" :
                    qrTheme === "dark" ? "bg-slate-950 text-slate-100 border border-slate-800" :
                    "bg-gradient-to-br from-slate-950 via-amber-950 to-slate-950 text-amber-100 border-2 border-amber-500/40"
                  }`}>
                    
                    {/* Header: Avatar/Initials Circle + Verified Badge */}
                    <div className="flex items-center gap-3 mb-5 w-full justify-start border-b pb-4 border-slate-200/10">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-black shadow-inner tracking-tight ${
                        qrTheme === "gpay" ? "bg-blue-600 text-white" :
                        qrTheme === "phonepe" ? "bg-indigo-700 text-white" :
                        qrTheme === "dark" ? "bg-slate-800 text-white" :
                        "bg-amber-500 text-slate-950"
                      }`}>
                        {(qrAvatarText || "IS").toUpperCase()}
                      </div>
                      <div className="text-left">
                        <div className={`font-extrabold flex items-center gap-1.5 text-sm ${
                          qrTheme === "gpay" || qrTheme === "phonepe" ? "text-slate-900" : "text-white"
                        }`}>
                          {qrName || "Bish"}
                          <span className="bg-blue-500 text-white text-[8px] px-1 py-0.5 rounded-full font-black">✓</span>
                        </div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">UPI MERCHANT</div>
                      </div>
                    </div>

                    {/* QR Code Scannable Image Frame */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-center relative mb-5 shadow-inner">
                      <img 
                        src={activeQrCodeUrl} 
                        alt="UPI Scannable QR Code" 
                        className="w-[170px] h-[170px] bg-white rounded-lg transition-all" 
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Center Logo Overlay */}
                      {qrLogo !== "none" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md p-1 border border-slate-100">
                            {qrLogo === "gpay" && (
                              <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-500 via-yellow-500 to-green-500 flex items-center justify-center text-[7px] text-white font-black">G</div>
                            )}
                            {qrLogo === "phonepe" && (
                              <div className="w-full h-full rounded-full bg-indigo-600 flex items-center justify-center text-[7px] text-white font-extrabold">Pe</div>
                            )}
                            {qrLogo === "upi" && (
                              <div className="w-full h-full rounded-full bg-sky-500 flex items-center justify-center text-[6px] text-white font-black tracking-tight leading-none">UPI</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Payee Info & Dynamic Amount Text */}
                    <div className="w-full text-center space-y-1">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">UPI MERCHANT ID</div>
                      <div className={`text-xs font-semibold font-mono p-1.5 rounded-lg break-all ${
                        qrTheme === "gpay" || qrTheme === "phonepe" ? "bg-white/60 text-slate-700" : "bg-slate-900/60 text-slate-300"
                      }`}>
                        {qrUpiId || "ritukamble329@okicici"}
                      </div>

                      {qrAmount && (
                        <div className="pt-2">
                          <span className="text-[9px] text-slate-400 uppercase font-extrabold block">PRESET PAYABLE AMOUNT</span>
                          <div className={`text-2xl font-black font-mono leading-none tracking-tight ${
                            qrTheme === "gold" ? "text-amber-400" : qrTheme === "dark" ? "text-white" : "text-slate-900"
                          }`}>
                            ₹{parseFloat(qrAmount).toLocaleString("en-IN")}
                          </div>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{qrRemark || "Training Enrollment"}</p>
                        </div>
                      )}
                    </div>

                    {/* Footer tagline */}
                    <div className="mt-5 text-[10px] font-bold text-slate-400 border-t border-slate-200/10 pt-3.5 w-full uppercase tracking-wider flex items-center justify-center gap-1.5">
                      <Smartphone className="h-3 w-3 shrink-0" />
                      <span>Scan to pay with any UPI App</span>
                    </div>

                  </div>

                  {/* Export Options */}
                  <div className="flex gap-2.5 mt-5 w-full max-w-sm">
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Printer className="h-4 w-4" />
                      <span>Print Flyer</span>
                    </button>
                    <a
                      href={activeQrCodeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download QR</span>
                    </a>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
