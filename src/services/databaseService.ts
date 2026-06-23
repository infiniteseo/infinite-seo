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
import { User, Inquiry, Referral, SuccessStory } from "../types";
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

    // Save locally
    const local = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
    const inquiries: Inquiry[] = local ? JSON.parse(local) : [];
    inquiries.push(newInquiry);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));

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
  }
};
