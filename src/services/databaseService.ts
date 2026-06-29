import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy
} from "firebase/firestore";
import { db, auth, OperationType, handleFirestoreError } from "../firebase";
import { User, Inquiry, Referral, SuccessStory, PaymentConfig, UserPayment, WorkshopRegistration } from "../types";
import { SUCCESS_STORIES_DATA } from "../data";

// Helper to determine if Firebase is configured with real active keys
import firebaseConfig from "../../firebase-applet-config.json";
const isDbConfigured = !!(
  firebaseConfig && 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "" && 
  !firebaseConfig.apiKey.startsWith("remixed-") && 
  !firebaseConfig.apiKey.includes("placeholder")
);

// Fallback persistence keys
const STORAGE_KEYS = {
  USER_PROFILE: "infinite_seo_user_profile",
  INQUIRIES: "infinite_seo_inquiries",
  REFERRALS: "infinite_seo_referrals",
  SUCCESS_STORIES: "infinite_seo_success_stories",
  PAYMENT_CONFIG: "infinite_seo_payment_config",
  USER_PAYMENTS: "infinite_seo_user_payments",
  WORKSHOPS: "infinite_seo_workshops",
};

/**
 * DATABASE SERVICE API
 */
export const DatabaseService = {
  /**
   * 1. USER PROFILE MANAGEMENT
   */
  async saveUserProfile(uid: string, profileData: Partial<User>): Promise<void> {
    const defaultData = {
      uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      partnerLevel: "pro",
      promoCode: profileData.name 
        ? `${profileData.name.trim().split(" ")[0].toUpperCase()}${Math.floor(10 + Math.random() * 89)}`
        : `PARTNER${Math.floor(100 + Math.random() * 899)}`,
    };

    const mergedData = { ...defaultData, ...profileData, updatedAt: new Date().toISOString() };

    // Synchronize with Client Local Storage Fallback
    localStorage.setItem(`${STORAGE_KEYS.USER_PROFILE}_${uid}`, JSON.stringify(mergedData));

    if (isDbConfigured) {
      const path = `users/${uid}`;
      try {
        const userRef = doc(db, "users", uid);
        await setDoc(userRef, {
          ...mergedData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        console.log("Firestore User Profile saved successfully");
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    }
  },

  async getUserProfile(uid: string): Promise<User | null> {
    // 1. Check LocalStorage first for high-speed offline capabilities
    const local = localStorage.getItem(`${STORAGE_KEYS.USER_PROFILE}_${uid}`);
    let localProfile: User | null = local ? JSON.parse(local) : null;

    if (isDbConfigured) {
      const path = `users/${uid}`;
      try {
        const userRef = doc(db, "users", uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const cloudData = docSnap.data() as User;
          // Sync back to local storage
          localStorage.setItem(`${STORAGE_KEYS.USER_PROFILE}_${uid}`, JSON.stringify(cloudData));
          return cloudData;
        }
      } catch (error) {
        console.warn("Firestore getUserProfile error (using local fallback value):", error);
      }
    }

    return localProfile;
  },

  /**
   * 2. REFERRALS MANAGEMENT
   */
  async getReferrals(userId: string): Promise<Referral[]> {
    // Standard mock referral seed data to pre-populate the dashboard beautifully
    const defaultReferrals: Referral[] = [
      { id: "REF-2901", name: "Kunal Pathak", courseSelected: "Mastery Course", coursePrice: 29999, commissionEarned: 5000, date: "2026-05-21", status: "Completed", referrerUid: userId, createdAt: new Date().toISOString() },
      { id: "REF-2902", name: "Aarushi Sen", courseSelected: "Advance Course", coursePrice: 14999, commissionEarned: 3000, date: "2026-05-20", status: "Completed", referrerUid: userId, createdAt: new Date().toISOString() },
      { id: "REF-2903", name: "Jatin More", courseSelected: "Basic Course", coursePrice: 4999, commissionEarned: 1500, date: "2026-05-20", status: "Completed", referrerUid: userId, createdAt: new Date().toISOString() },
      { id: "REF-2911", name: "Megha Gupta", courseSelected: "Advance Course", coursePrice: 14999, commissionEarned: 3000, date: "2026-05-18", status: "Completed", referrerUid: userId, createdAt: new Date().toISOString() },
      { id: "REF-2915", name: "Vikas Joshi", courseSelected: "Mastery Course", coursePrice: 29999, commissionEarned: 5000, date: "2026-05-17", status: "Completed", referrerUid: userId, createdAt: new Date().toISOString() },
      { id: "REF-3001", name: "Tanmay Patil", courseSelected: "Advance Course", coursePrice: 14999, commissionEarned: 3000, date: "2026-05-16", status: "Pending", referrerUid: userId, createdAt: new Date().toISOString() },
      { id: "REF-3004", name: "Pooja Hegde", courseSelected: "Basic Course", coursePrice: 4999, commissionEarned: 0, date: "2026-05-15", status: "Lead Only", referrerUid: userId, createdAt: new Date().toISOString() }
    ];

    const localKey = `${STORAGE_KEYS.REFERRALS}_${userId}`;
    const local = localStorage.getItem(localKey);
    let referralList: Referral[] = local ? JSON.parse(local) : [];

    // If local storage is empty, initialize it with seed data for visual satisfaction
    if (referralList.length === 0) {
      localStorage.setItem(localKey, JSON.stringify(defaultReferrals));
      referralList = defaultReferrals;
    }

    if (isDbConfigured) {
      const path = `users/${userId}/referrals`;
      try {
        const referralsCol = collection(db, "users", userId, "referrals");
        const q = query(referralsCol, orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        
        if (!snap.empty) {
          const cloudReferrals: Referral[] = [];
          snap.forEach((docSnap) => {
            cloudReferrals.push(docSnap.data() as Referral);
          });
          // Update local cache
          localStorage.setItem(localKey, JSON.stringify(cloudReferrals));
          return cloudReferrals;
        }
      } catch (error) {
        console.warn("Firestore getReferrals error (using local cache):", error);
      }
    }

    return referralList;
  },

  async addReferral(userId: string, referral: Referral): Promise<void> {
    const localKey = `${STORAGE_KEYS.REFERRALS}_${userId}`;
    const local = localStorage.getItem(localKey);
    const referrals: Referral[] = local ? JSON.parse(local) : [];
    
    const updatedReferrals = [referral, ...referrals];
    localStorage.setItem(localKey, JSON.stringify(updatedReferrals));

    if (isDbConfigured) {
      const path = `users/${userId}/referrals/${referral.id}`;
      try {
        const refDocRef = doc(db, "users", userId, "referrals", referral.id);
        await setDoc(refDocRef, {
          ...referral,
          createdAt: serverTimestamp()
        });
        console.log("Firestore Referral saved successfully");
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    }
  },

  /**
   * 3. INQUIRIES MANAGEMENT
   */
  async createInquiry(inquiry: Partial<Inquiry>): Promise<void> {
    const newInquiry: Inquiry = {
      userName: inquiry.userName || "",
      userEmail: inquiry.userEmail || "",
      userSubject: inquiry.userSubject || "",
      userMessage: inquiry.userMessage || "",
      createdAt: new Date().toISOString()
    };

    // Save globally
    const local = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
    const inquiries: Inquiry[] = local ? JSON.parse(local) : [];
    inquiries.push(newInquiry);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));

    // Save under logged in user if active
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const localKey = `${STORAGE_KEYS.INQUIRIES}_${userId}`;
      const localUserInquiries = localStorage.getItem(localKey);
      const userInquiriesList: Inquiry[] = localUserInquiries ? JSON.parse(localUserInquiries) : [];
      userInquiriesList.push(newInquiry);
      localStorage.setItem(localKey, JSON.stringify(userInquiriesList));

      if (isDbConfigured) {
        try {
          const userInquiriesCol = collection(db, "users", userId, "inquiries");
          await addDoc(userInquiriesCol, {
            ...newInquiry,
            createdAt: serverTimestamp()
          });
          console.log("Firestore User-specific Inquiry cataloged successfully");
        } catch (error) {
          console.warn("Could not save user-specific inquiry to Firestore:", error);
        }
      }
    }

    if (isDbConfigured) {
      const path = "inquiries";
      try {
        const inquiriesCol = collection(db, "inquiries");
        await addDoc(inquiriesCol, {
          ...newInquiry,
          createdAt: serverTimestamp()
        });
        console.log("Firestore Inquiry cataloged successfully");
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    }
  },

  async getUserInquiries(userId: string): Promise<Inquiry[]> {
    const localKey = `${STORAGE_KEYS.INQUIRIES}_${userId}`;
    const local = localStorage.getItem(localKey);
    let inquiriesList: Inquiry[] = local ? JSON.parse(local) : [];

    if (isDbConfigured) {
      const path = `users/${userId}/inquiries`;
      try {
        const inquiriesCol = collection(db, "users", userId, "inquiries");
        const snap = await getDocs(inquiriesCol);
        
        if (!snap.empty) {
          const cloudInquiries: Inquiry[] = [];
          snap.forEach((docSnap) => {
            const data = docSnap.data();
            cloudInquiries.push({
              userName: data.userName,
              userEmail: data.userEmail,
              userSubject: data.userSubject,
              userMessage: data.userMessage,
              createdAt: data.createdAt?.seconds 
                ? new Date(data.createdAt.seconds * 1000).toISOString() 
                : (data.createdAt || new Date().toISOString())
            });
          });
          localStorage.setItem(localKey, JSON.stringify(cloudInquiries));
          return cloudInquiries;
        }
      } catch (error) {
        console.warn("Firestore getUserInquiries error (using local cache):", error);
      }
    }
    return inquiriesList;
  },

  /**
   * 4. STUDENT SUCCESS STORIES
   */
  async getSuccessStories(): Promise<SuccessStory[]> {
    const local = localStorage.getItem(STORAGE_KEYS.SUCCESS_STORIES);
    let storyList: SuccessStory[] = local ? JSON.parse(local) : [];

    if (storyList.length === 0) {
      localStorage.setItem(STORAGE_KEYS.SUCCESS_STORIES, JSON.stringify(SUCCESS_STORIES_DATA));
      storyList = SUCCESS_STORIES_DATA;
    }

    if (isDbConfigured) {
      const path = "successStories";
      try {
        const storiesCol = collection(db, "successStories");
        const snap = await getDocs(storiesCol);
        if (!snap.empty) {
          const cloudStories: SuccessStory[] = [];
          snap.forEach((docSnap) => {
            cloudStories.push(docSnap.data() as SuccessStory);
          });
          return cloudStories;
        }
      } catch (error) {
        console.warn("Firestore getSuccessStories failed (using local stories):", error);
      }
    }

    return storyList;
  },

  async addSuccessStory(story: SuccessStory): Promise<void> {
    const local = localStorage.getItem(STORAGE_KEYS.SUCCESS_STORIES);
    const stories: SuccessStory[] = local ? JSON.parse(local) : [];
    
    const updatedStories = [story, ...stories];
    localStorage.setItem(STORAGE_KEYS.SUCCESS_STORIES, JSON.stringify(updatedStories));

    if (isDbConfigured) {
      const path = `successStories/${story.id}`;
      try {
        const storyRef = doc(db, "successStories", story.id);
        await setDoc(storyRef, {
          ...story,
          createdAt: serverTimestamp()
        });
        console.log("Firestore Success Story published successfully");
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    }
  },

  async getPaymentConfig(): Promise<PaymentConfig> {
    const defaultConfig: PaymentConfig = {
      ownerUpiId: "ritukamble329@okicici",
      ownerName: "Bish",
      basicCourseUrl: "",
      advanceCourseUrl: "",
      masteryCourseUrl: "",
      starterPlanUrl: "",
      proPlanUrl: "",
      premiumPlanUrl: "",
      qrCodeEnabled: true,
    };

    const local = localStorage.getItem(STORAGE_KEYS.PAYMENT_CONFIG);
    let config: PaymentConfig = local ? JSON.parse(local) : defaultConfig;

    // Self-heal/migrate old placeholder defaults in local storage to user's new real QR details
    if (config.ownerUpiId === "infiniteseo777@okaxis") {
      config.ownerUpiId = "ritukamble329@okicici";
    }
    if (config.ownerName === "Infinite SEO Academy") {
      config.ownerName = "Bish";
    }

    if (isDbConfigured) {
      try {
        const configRef = doc(db, "config", "paymentConfig");
        const snap = await getDoc(configRef);
        if (snap.exists()) {
          const cloudConfig = snap.data() as PaymentConfig;
          localStorage.setItem(STORAGE_KEYS.PAYMENT_CONFIG, JSON.stringify(cloudConfig));
          return cloudConfig;
        }
      } catch (err) {
        console.warn("Firestore getPaymentConfig error, using cached local config:", err);
      }
    }

    return config;
  },

  async savePaymentConfig(config: PaymentConfig, persistToLocal: boolean = true): Promise<void> {
    if (persistToLocal) {
      localStorage.setItem(STORAGE_KEYS.PAYMENT_CONFIG, JSON.stringify(config));
    } else {
      localStorage.removeItem(STORAGE_KEYS.PAYMENT_CONFIG);
    }

    if (isDbConfigured) {
      const path = "config/paymentConfig";
      try {
        const configRef = doc(db, "config", "paymentConfig");
        await setDoc(configRef, {
          ...config,
          updatedAt: serverTimestamp()
        });
        console.log("Firestore PaymentConfig saved successfully");
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    }
  },

  async getUserPayments(userId: string): Promise<UserPayment[]> {
    const localKey = `${STORAGE_KEYS.USER_PAYMENTS}_${userId}`;
    const local = localStorage.getItem(localKey);
    let paymentList: UserPayment[] = local ? JSON.parse(local) : [];

    if (isDbConfigured) {
      const path = `users/${userId}/payments`;
      try {
        const paymentsCol = collection(db, "users", userId, "payments");
        const q = query(paymentsCol, orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        
        if (!snap.empty) {
          const cloudPayments: UserPayment[] = [];
          snap.forEach((docSnap) => {
            cloudPayments.push(docSnap.data() as UserPayment);
          });
          // Update local cache
          localStorage.setItem(localKey, JSON.stringify(cloudPayments));
          return cloudPayments;
        }
      } catch (error) {
        console.warn("Firestore getUserPayments error (using local cache):", error);
      }
    }

    return paymentList;
  },

  async addUserPayment(userId: string, payment: UserPayment): Promise<void> {
    const localKey = `${STORAGE_KEYS.USER_PAYMENTS}_${userId}`;
    const local = localStorage.getItem(localKey);
    const payments: UserPayment[] = local ? JSON.parse(local) : [];
    
    const updatedPayments = [payment, ...payments];
    localStorage.setItem(localKey, JSON.stringify(updatedPayments));

    if (isDbConfigured) {
      const path = `users/${userId}/payments/${payment.id}`;
      try {
        const payDocRef = doc(db, "users", userId, "payments", payment.id);
        await setDoc(payDocRef, {
          ...payment,
          createdAt: serverTimestamp()
        });
        console.log("Firestore User Payment saved successfully");
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    }
  },

  async addWorkshopRegistration(registration: WorkshopRegistration): Promise<void> {
    const localKey = registration.userId 
      ? `${STORAGE_KEYS.WORKSHOPS}_${registration.userId}`
      : `${STORAGE_KEYS.WORKSHOPS}_guest`;
    
    const local = localStorage.getItem(localKey);
    const list: WorkshopRegistration[] = local ? JSON.parse(local) : [];
    const updated = [registration, ...list];
    localStorage.setItem(localKey, JSON.stringify(updated));

    if (isDbConfigured) {
      if (registration.userId) {
        const path = `users/${registration.userId}/workshops/${registration.id}`;
        try {
          const docRef = doc(db, "users", registration.userId, "workshops", registration.id);
          await setDoc(docRef, {
            ...registration,
            createdAt: serverTimestamp()
          });
          console.log("Firestore User Workshop Registration saved successfully");
        } catch (error) {
          console.warn("Firestore error saving workshop registration: ", error);
        }
      } else {
        const path = `workshops-public/${registration.id}`;
        try {
          const docRef = doc(db, "workshops-public", registration.id);
          await setDoc(docRef, {
            ...registration,
            createdAt: serverTimestamp()
          });
          console.log("Firestore Guest Workshop Registration saved successfully");
        } catch (error) {
          console.warn("Firestore error saving guest workshop registration: ", error);
        }
      }
    }
  },

  async getUserWorkshopRegistrations(userId: string): Promise<WorkshopRegistration[]> {
    const localKey = `${STORAGE_KEYS.WORKSHOPS}_${userId}`;
    const local = localStorage.getItem(localKey);
    let list: WorkshopRegistration[] = local ? JSON.parse(local) : [];

    if (isDbConfigured) {
      const path = `users/${userId}/workshops`;
      try {
        const colRef = collection(db, "users", userId, "workshops");
        const q = query(colRef, orderBy("registeredAt", "desc"));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const cloudList: WorkshopRegistration[] = [];
          snap.forEach((docSnap) => {
            cloudList.push(docSnap.data() as WorkshopRegistration);
          });
          localStorage.setItem(localKey, JSON.stringify(cloudList));
          return cloudList;
        }
      } catch (error) {
        console.warn("Firestore getUserWorkshopRegistrations error: ", error);
      }
    }

    return list;
  }
};
