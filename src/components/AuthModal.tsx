import React, { useState } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  GoogleAuthProvider, 
  signInWithPopup,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth } from "../firebase";
import { DatabaseService } from "../services/databaseService";
import { X, Mail, Lock, User, Sparkles, Loader2, AlertCircle, CheckCircle2, ChevronLeft, Phone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: () => void;
}

// Check if string looks like a phone number
const parseIdentifier = (input: string): { email: string; isPhone: boolean; rawPhone?: string } => {
  const trimmed = input.trim();
  // Clean special characters from phone numbers
  const cleanedPhone = trimmed.replace(/[- )(\s]/g, "");
  // Match digits with optional leading plus, between 7 and 15 characters
  const isPhone = /^\+?[0-9]{7,15}$/.test(cleanedPhone);
  
  if (isPhone) {
    const cleanPhone = cleanedPhone.replace(/\+/g, "");
    return {
      email: `phone_${cleanPhone}@phone.infiniteseo.com`,
      isPhone: true,
      rawPhone: cleanedPhone
    };
  }
  
  return {
    email: trimmed,
    isPhone: false
  };
};

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const { email, isPhone, rawPhone } = parseIdentifier(emailOrPhone);

      if (isSignUp) {
        if (!fullName.trim()) {
          throw new Error("Please enter your full name.");
        }
        // Sign up with Email/Phone (virtualized) and Password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update display name in Firebase Auth profile
        await updateProfile(user, { displayName: fullName });

        // Save User Profile in Firestore via DatabaseService
        await DatabaseService.saveUserProfile(user.uid, {
          uid: user.uid,
          name: fullName,
          email: isPhone ? "" : email,
          phone: isPhone ? rawPhone : "",
          partnerLevel: "pro"
        });

        setSuccessMessage("Account created successfully!");
        
        // Trigger celebration overlay with custom positive reinforcement message
        window.dispatchEvent(new CustomEvent("celebration-trigger", {
          detail: { message: `Welcome to Infinite SEO, ${fullName}! Account created.` }
        }));
      } else {
        // Sign in with Email/Phone and Password
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Verify/create profile doc if missing
        const profile = await DatabaseService.getUserProfile(user.uid);
        if (!profile) {
          await DatabaseService.saveUserProfile(user.uid, {
            uid: user.uid,
            name: user.displayName || "Learner Partner",
            email: isPhone ? "" : (user.email || ""),
            phone: isPhone ? rawPhone : "",
            partnerLevel: "pro"
          });
        }
      }

      if (onAuthSuccess) onAuthSuccess();
      onClose();
    } catch (err: any) {
      console.error("Authentication error: ", err);
      let errMsg = err.message || "An authentication error occurred.";
      if (err.code === "auth/email-already-in-use") {
        errMsg = "This email or phone number is already registered. Try signing in instead.";
      } else if (err.code === "auth/weak-password") {
        errMsg = "Password should be at least 6 characters long.";
      } else if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        errMsg = "Incorrect details or password. Please try again.";
      } else if (err.code === "auth/invalid-email") {
        errMsg = "Please enter a valid email address or phone number.";
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      if (!emailOrPhone.trim()) {
        throw new Error("Please enter your email address.");
      }

      const { email, isPhone } = parseIdentifier(emailOrPhone);
      if (isPhone) {
        throw new Error("Password reset links can only be dispatched to valid email addresses. If you registered using a phone number, please contact support.");
      }

      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("A password reset link has been dispatched to your email address!");
    } catch (err: any) {
      console.error("Password reset error: ", err);
      let errMsg = err.message || "An error occurred while sending the password reset email.";
      if (err.code === "auth/user-not-found") {
        errMsg = "No registered account found with this email address.";
      } else if (err.code === "auth/invalid-email") {
        errMsg = "Please enter a valid email address.";
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setSuccessMessage("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Ensure user profile is registered
      const profile = await DatabaseService.getUserProfile(user.uid);
      if (!profile) {
        await DatabaseService.saveUserProfile(user.uid, {
          uid: user.uid,
          name: user.displayName || "Learner Partner",
          email: user.email || "",
          partnerLevel: "pro"
        });
      }

      if (onAuthSuccess) onAuthSuccess();
      onClose();
    } catch (err: any) {
      console.warn("Google Sign-In failed or was cancelled: ", err);
      setError("Google Sign-In was cancelled or configuration is incomplete.");
    } finally {
      setLoading(false);
    }
  };

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
          transition={{ duration: 0.2 }}
          className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden p-6 sm:p-8 text-left"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center mb-6">
            <div className="inline-flex bg-gradient-to-r from-blue-600 to-amber-500 p-2.5 rounded-xl mb-3 shadow-md">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {isForgotPassword 
                ? "Reset Password" 
                : isSignUp 
                ? "Create Your Account" 
                : "Welcome Back"
              }
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isForgotPassword
                ? "Enter your email address to receive a secure password reset link."
                : isSignUp 
                ? "Sign up with your email or phone number to save everything in your custom workspace!"
                : "Log in with email or phone number to access all your saved leads, payments, and info."
              }
            </p>
          </div>

          {/* Alert error panel */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-950/40 border border-red-900/60 p-3 rounded-xl mb-4 flex items-start gap-2.5 text-xs text-red-300"
            >
              <AlertCircle className="h-4.5 w-4.5 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Success panel */}
          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-950/40 border border-emerald-900/60 p-3 rounded-xl mb-4 flex items-start gap-2.5 text-xs text-emerald-300"
            >
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </motion.div>
          )}

          {/* Sign In / Sign Up Forms */}
          {!isForgotPassword ? (
            <>
              {/* Google SSO button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-slate-950 hover:bg-slate-950/80 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all duration-200 shadow-sm active:scale-98 cursor-pointer disabled:opacity-50"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.253-3.133C18.42 1.944 15.618 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.985 0-.74-.08-1.302-.176-1.71H12.24z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center my-5">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="mx-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider">or email / phone</span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              {/* Core Credentials Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rakesh Kumar"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 px-10 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                    Email or Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                      {/^\+?[0-9]/.test(emailOrPhone) ? <Phone className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="Email or phone e.g. +919876543210"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 px-10 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Password
                    </label>
                    {!isSignUp && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(true);
                          setError("");
                          setSuccessMessage("");
                        }}
                        className="text-[10px] text-[#F59E0B] hover:underline font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      placeholder={isSignUp ? "At least 6 characters" : "••••••••"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 px-10 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2563EB] hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>{isSignUp ? "Sign Up" : "Sign In"}</span>
                  )}
                </button>
              </form>

              {/* Toggle between Login and Signup */}
              <div className="mt-5 text-center text-xs text-slate-400">
                {isSignUp ? "Already have an account? " : "New to Infinite SEO? "}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError("");
                    setSuccessMessage("");
                  }}
                  className="text-[#F59E0B] hover:underline font-bold transition-colors cursor-pointer"
                >
                  {isSignUp ? "Sign In here" : "Sign Up here"}
                </button>
              </div>
            </>
          ) : (
            /* Forgot Password Form */
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. rakesh@example.com"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 px-10 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2563EB] hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send Reset Email</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setError("");
                  setSuccessMessage("");
                }}
                className="w-full flex items-center justify-center gap-1 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider pt-2 cursor-pointer transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Back to Sign In</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
