import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Admin.css";

export default function AdminLogin() {
  const { user, loading, notAdminNotice, signInWithGoogle } = useAuth();

  useEffect(() => {
    document.title = "Admin sign in — For Jessa Mae";
  }, []);

  if (!loading && user) return <Navigate to="/admin" replace />;

  return (
    <div className="admin-auth">
      <div className="admin-auth__card">
        <p className="admin-auth__eyebrow">Private</p>
        <h1 className="admin-auth__title">Sign in to write, edit, and manage the letters.</h1>
        <p className="admin-auth__body">
          Only your Google account can reach this dashboard. Jessa's link never needs a sign-in — she
          just opens what you send her.
        </p>
        <button type="button" className="admin-auth__google" onClick={signInWithGoogle}>
          <GoogleMark />
          Continue with Google
        </button>
        {notAdminNotice && (
          <p className="admin-auth__error">
            That Google account isn't on the admin list. Sign in with the account listed in
            <code> VITE_ADMIN_EMAILS</code> instead.
          </p>
        )}
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8 3l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.9 19 13 24 13c3.1 0 5.9 1.1 8 3l5.7-5.7C34.6 6 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.3C29.3 35.5 26.8 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.5 5C9.6 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.2 5.3C40.9 36.6 44 30.9 44 24c0-1.3-.1-2.3-.4-3.5z"/>
    </svg>
  );
}
