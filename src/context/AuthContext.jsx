import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth, googleProvider, ADMIN_EMAILS } from "../firebase.js";

const AuthContext = createContext(null);

/**
 * Environments where a real popup window can't reliably open and talk back
 * to the page — installed/standalone PWAs, and the in-app browsers used by
 * Messenger/Instagram/TikTok/etc. In these, Firebase's own "try a popup,
 * silently fall back to a redirect" logic is exactly what produces the
 * "missing initial state" handler page, because the redirect's pending
 * state gets written to sessionStorage right before a full navigation that
 * these browsers don't reliably preserve storage across. Routing straight
 * to signInWithRedirect for them avoids that silent fallback entirely.
 */
function isUnreliablePopupEnvironment() {
  if (typeof window === "undefined") return false;
  const standalone =
    window.matchMedia?.("(display-mode: standalone)")?.matches ||
    window.navigator.standalone === true;
  const ua = window.navigator.userAgent || "";
  const isInAppWebView = /FBAN|FBAV|Instagram|Line\/|MicroMessenger|Twitter|TikTok|GSA\//i.test(ua);
  return standalone || isInAppWebView;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notAdminNotice, setNotAdminNotice] = useState(false);
  const [authError, setAuthError] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    // Complete a signInWithRedirect() round trip if one is in flight. If the
    // browser dropped the pending-redirect state, this rejects — we swallow
    // that specific case quietly (retrying is the only real fix for it) and
    // only surface a message for anything else, so the person never lands
    // on a dead end.
    getRedirectResult(auth).catch((err) => {
      const code = err?.code || "";
      if (code && code !== "auth/missing-initial-state" && code !== "auth/no-auth-event") {
        setAuthError("Sign-in was interrupted. Please tap Continue with Google again.");
      }
      setSigningIn(false);
    });

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
      setAuthError("");
      setSigningIn(false);
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsub;
  }, []);

  async function signInWithGoogle() {
    setNotAdminNotice(false);
    setAuthError("");
    setSigningIn(true);

    if (isUnreliablePopupEnvironment()) {
      try {
        await signInWithRedirect(auth, googleProvider);
      } catch {
        setAuthError("Couldn't start sign-in. Please try again.");
        setSigningIn(false);
      }
      return;
    }

    try {
      await signInWithPopup(auth, googleProvider);
      setSigningIn(false);
    } catch (err) {
      const code = err?.code || "";
      const shouldFallbackToRedirect =
        code === "auth/popup-blocked" ||
        code === "auth/operation-not-supported-in-this-environment" ||
        code === "auth/cancelled-popup-request";

      if (shouldFallbackToRedirect) {
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch {
          setAuthError("Couldn't start sign-in. Please try again.");
          setSigningIn(false);
        }
        return;
      }

      setSigningIn(false);
      if (code !== "auth/popup-closed-by-user") {
        setAuthError("Couldn't sign in. Please try again.");
      }
    }
  }

  async function signOut() {
    await firebaseSignOut(auth);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: !!user,
        notAdminNotice,
        authError,
        signingIn,
        signInWithGoogle,
        signOut,
      }}
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
