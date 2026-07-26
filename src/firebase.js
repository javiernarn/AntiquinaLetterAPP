import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  indexedDBLocalPersistence,
  browserLocalPersistence,
  setPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
// Always show the account picker instead of silently reusing whatever
// Google session the phone's browser already has open.
googleProvider.setCustomParameters({ prompt: "select_account" });

// Explicit, most-durable-first persistence. Some mobile/in-app browsers
// (private mode, storage-partitioned Safari, certain webviews) throw when
// IndexedDB is touched — fall back gracefully instead of leaving auth in
// an unpredictable state.
setPersistence(auth, indexedDBLocalPersistence).catch(() => {
  setPersistence(auth, browserLocalPersistence).catch(() => {
    /* last resort: default in-memory persistence — sign-in still works
       for the current tab even if it won't survive a restart */
  });
});

// Everyone in this list can reach /admin. Everyone else who signs in
// with Google gets signed back out immediately. Keep this in sync with
// firestore.rules (isAdmin()) so the client check and the server rule agree.
export const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);
