import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth, googleProvider, ADMIN_EMAILS } from "../firebase.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notAdminNotice, setNotAdminNotice] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      const email = (firebaseUser.email || "").toLowerCase();
      if (!ADMIN_EMAILS.includes(email)) {
        // Someone signed in with a Google account that isn't the admin's.
        // Sign them right back out — only the admin ever sees /admin.
        await firebaseSignOut(auth);
        setUser(null);
        setNotAdminNotice(true);
        setLoading(false);
        return;
      }
      setNotAdminNotice(false);
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsub;
  }, []);

  async function signInWithGoogle() {
    setNotAdminNotice(false);
    await signInWithPopup(auth, googleProvider);
  }

  async function signOut() {
    await firebaseSignOut(auth);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, isAdmin: !!user, notAdminNotice, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
