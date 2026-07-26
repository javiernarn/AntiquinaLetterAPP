import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import LettersManager from "./LettersManager.jsx";
import QuestionsManager from "./QuestionsManager.jsx";
import ResponsesPanel from "./ResponsesPanel.jsx";
import SettingsPanel from "./SettingsPanel.jsx";
import "./Admin.css";

const TABS = [
  { id: "letters", label: "Letters" },
  { id: "questions", label: "Questions" },
  { id: "responses", label: "Her responses" },
  { id: "settings", label: "Page copy" },
];

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState("letters");
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = "Dashboard — For Jessa Mae";
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const shareUrl = typeof window !== "undefined" ? window.location.origin + "/" : "/";

  function copyShareUrl() {
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="admin">
      {/* Sticks to the top of the viewport as the panel below scrolls —
          header, share link, and tabs stay put together, like the OTA app. */}
      <div className={`admin__stickytop${scrolled ? " is-scrolled" : ""}`}>
        <header className="admin__header">
          <div className="admin__who">
            <p className="admin__eyebrow">Signed in as</p>
            <p className="admin__user" title={user?.email}>
              {user?.email}
            </p>
          </div>
          <button type="button" className="admin__signout" onClick={signOut}>
            Sign out
          </button>
        </header>

        <div className="admin__share">
          <span className="admin__share-label">Her link — share this, no sign-in needed:</span>
          <div className="admin__share-row">
            <code className="admin__share-url" onClick={copyShareUrl} title="Click to copy">
              {shareUrl}
            </code>
            <span className={`admin__copied${copied ? " admin__copied--show" : ""}`}>
              Copied ✓
            </span>
          </div>
        </div>

        <nav className="admin__tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              className={`admin__tab ${tab === t.id ? "admin__tab--active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      <main className="admin__panel">
        {tab === "letters" && <LettersManager />}
        {tab === "questions" && <QuestionsManager />}
        {tab === "responses" && <ResponsesPanel />}
        {tab === "settings" && <SettingsPanel />}
      </main>
    </div>
  );
}
