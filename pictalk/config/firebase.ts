import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ||
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || 
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics only in web environment
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export { analytics };

// Export the Firebase app instance if needed
export default app; 