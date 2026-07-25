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

  useEffect(() => {
    document.title = "Dashboard — For Jessa Mae";
  }, []);

  const shareUrl = typeof window !== "undefined" ? window.location.origin + "/" : "/";

  return (
    <div className="admin">
      <header className="admin__header">
        <div>
          <p className="admin__eyebrow">Signed in as</p>
          <p className="admin__user">{user?.email}</p>
        </div>
        <button type="button" className="admin__signout" onClick={signOut}>
          Sign out
        </button>
      </header>

      <div className="admin__share">
        <span>Her link — share this, no sign-in needed:</span>
        <code
          className="admin__share-url"
          onClick={() => navigator.clipboard?.writeText(shareUrl)}
          title="Click to copy"
        >
          {shareUrl}
        </code>
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

      <main className="admin__panel">
        {tab === "letters" && <LettersManager />}
        {tab === "questions" && <QuestionsManager />}
        {tab === "responses" && <ResponsesPanel />}
        {tab === "settings" && <SettingsPanel />}
      </main>
    </div>
  );
}
