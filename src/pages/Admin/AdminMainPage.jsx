import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Admin.css";

const MIN_SPLASH_MS = 3000;

/**
 * The admin equivalent of the OTA app's MainPage: a themed splash that
 * always shows for at least 3s, then routes to /admin/login or
 * /admin/dashboard once we know whether someone's signed in. AdminLogin
 * sends people back here (state: { from: "login" }) after a successful
 * sign-in, so the splash also plays a second time on the way in.
 */
export default function AdminMainPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [minDelayDone, setMinDelayDone] = useState(false);
  const justSignedIn = location.state?.from === "login";

  useEffect(() => {
    document.title = "Loading — For Jessa Mae";
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMinDelayDone(true), MIN_SPLASH_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!minDelayDone || authLoading) return;
    navigate(user ? "/admin/dashboard" : "/admin/login", { replace: true });
  }, [minDelayDone, authLoading, user, navigate]);

  return (
    <>
      <style>{`
        .admin-main {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 24px;
          background:
            radial-gradient(900px 500px at 100% -10%, var(--night-glow-blue), transparent 60%),
            radial-gradient(900px 500px at -10% 110%, var(--night-glow-violet), transparent 60%),
            linear-gradient(180deg, var(--night) 0%, var(--night-deep) 75%);
          color: var(--cream-text);
        }

        .admin-main__blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.35;
          pointer-events: none;
          animation: admin-main-float 14s ease-in-out infinite;
        }
        .admin-main__blob--1 { width: 360px; height: 360px; background: var(--gold); top: -100px; left: -80px; }
        .admin-main__blob--2 { width: 420px; height: 420px; background: var(--neon-blue); bottom: -160px; right: -100px; animation-duration: 18s; }
        .admin-main__blob--3 { width: 260px; height: 260px; background: var(--wine-bright); top: 40%; left: 60%; opacity: 0.25; animation-duration: 22s; }

        @keyframes admin-main-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-16px) scale(1.05); }
        }

        .admin-main__card {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 48px 40px;
          border-radius: var(--radius-lg);
          max-width: 420px;
          width: 100%;
          background: var(--navy);
          border: 1px solid rgba(201, 162, 39, 0.22);
          box-shadow: var(--shadow-paper);
          animation: admin-main-fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .admin-main__chip {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 14px;
          border-radius: 999px;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          background: rgba(201, 162, 39, 0.12);
          border: 1px solid rgba(201, 162, 39, 0.3);
          color: var(--gold-soft);
          margin-bottom: 24px;
        }
        .admin-main__chip .pulse {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--gold);
          animation: admin-main-pulse 1.8s ease-in-out infinite;
        }
        @keyframes admin-main-pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(201,162,39,0.55); }
          50%     { box-shadow: 0 0 0 10px rgba(201,162,39,0); }
        }

        .admin-main__seal-wrap {
          width: 108px;
          height: 108px;
          margin: 0 auto 22px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: linear-gradient(160deg, var(--gold-soft), var(--gold) 60%, #a67f18);
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.35), 0 14px 28px -10px rgba(0,0,0,0.55);
          animation: admin-main-seal-float 3s ease-in-out infinite;
        }
        .admin-main__seal-wrap::before {
          content: ""; position: absolute; inset: -4px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,162,39,0.55), transparent 70%);
          z-index: -1;
          filter: blur(10px);
          animation: admin-main-glow 3s ease-in-out infinite;
        }
        .admin-main__seal-mark {
          font-family: var(--font-display);
          font-size: 42px;
          font-weight: 700;
          color: var(--navy-deep);
          line-height: 1;
        }
        @keyframes admin-main-seal-float {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-8px); }
        }
        @keyframes admin-main-glow {
          0%,100% { opacity: 0.35; }
          50%     { opacity: 0.65; }
        }

        .admin-main__title {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.01em;
          margin: 0 0 8px;
          color: var(--cream-text);
        }
        .admin-main__title .script {
          font-family: var(--font-script);
          font-size: 1.15em;
          color: var(--gold-soft);
        }
        .admin-main__sub {
          margin: 0 0 28px;
          font-size: 14px;
          color: rgba(243, 231, 201, 0.68);
        }

        .admin-main__loader {
          position: relative;
          width: 100%;
          height: 6px;
          border-radius: 4px;
          overflow: hidden;
          background: rgba(243, 231, 201, 0.12);
          margin-bottom: 14px;
        }
        .admin-main__loader::before {
          content: "";
          position: absolute; top: 0; left: 0; bottom: 0;
          width: 40%;
          border-radius: 4px;
          background: linear-gradient(90deg, var(--gold-soft), var(--gold), var(--wine-bright));
          animation: admin-main-slide 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          box-shadow: 0 0 12px rgba(201, 162, 39, 0.5);
        }
        @keyframes admin-main-slide {
          0%   { left: -40%; }
          100% { left: 100%; }
        }

        .admin-main__loading-text {
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-weight: 700;
          color: rgba(243, 231, 201, 0.55);
        }
        .admin-main__loading-text .dot {
          display: inline-block;
          animation: admin-main-blink 1.4s infinite;
        }
        .admin-main__loading-text .dot:nth-child(2) { animation-delay: 0.2s; }
        .admin-main__loading-text .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes admin-main-blink {
          0%, 80%, 100% { opacity: 0.3; }
          40%           { opacity: 1; }
        }

        @keyframes admin-main-fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .admin-main__blob, .admin-main__seal-wrap, .admin-main__seal-wrap::before,
          .admin-main__card, .admin-main__loader::before, .admin-main__loading-text .dot {
            animation: none !important;
          }
        }
      `}</style>

      <div className="admin-main">
        <span className="admin-main__blob admin-main__blob--1" />
        <span className="admin-main__blob admin-main__blob--2" />
        <span className="admin-main__blob admin-main__blob--3" />

        <div className="admin-main__card">
          <span className="admin-main__chip">
            <span className="pulse" />
            Private
          </span>

          <div className="admin-main__seal-wrap">
            <span className="admin-main__seal-mark">J</span>
          </div>

          <h1 className="admin-main__title">
            For <span className="script">Jessa Mae</span>
          </h1>
          <p className="admin-main__sub">
            {justSignedIn ? "Signed in — unlocking the archive…" : "Warming the wax seal, please wait…"}
          </p>

          <div className="admin-main__loader" aria-hidden="true" />
          <div className="admin-main__loading-text">
            Loading<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
          </div>
        </div>
      </div>
    </>
  );
}
