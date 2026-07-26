import { useEffect, useState } from "react";
import { subscribeSettings, saveSettings, DEFAULT_SETTINGS } from "../../services/settingsService.js";

export default function SettingsPanel() {
  const [form, setForm] = useState(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => subscribeSettings(setForm), []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await saveSettings(form);
      setSavedAt(Date.now());
    } catch (err) {
      console.error("Saving page copy failed:", err);
      setError(
        err?.code === "permission-denied"
          ? "Firestore rejected this save (permission-denied). Your Firestore security rules likely haven't been deployed, or aren't allowing your admin account to write — check the Rules tab in the Firebase console."
          : `Couldn't save: ${err?.message || "unknown error"}`
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <h2 className="admin-h2">Page copy</h2>
      <p className="admin-hint">
        This is the wording on the opening screen and the celebration screen. Everything else
        (questions, letters) is managed in its own tab.
      </p>
      <form className="admin-form" onSubmit={handleSubmit}>
        <label>
          Eyebrow (small label above the title)
          <input
            value={form.heroEyebrow}
            onChange={(e) => setForm({ ...form, heroEyebrow: e.target.value })}
          />
        </label>
        <label>
          Hero title
          <input
            value={form.heroTitle}
            onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
          />
        </label>
        <label>
          Hero body
          <textarea
            rows={3}
            value={form.heroBody}
            onChange={(e) => setForm({ ...form, heroBody: e.target.value })}
          />
        </label>
        <label>
          Celebration title (shown right after she says yes)
          <input
            value={form.congratsTitle}
            onChange={(e) => setForm({ ...form, congratsTitle: e.target.value })}
          />
        </label>
        <label>
          Celebration body
          <textarea
            rows={3}
            value={form.congratsBody}
            onChange={(e) => setForm({ ...form, congratsBody: e.target.value })}
          />
        </label>
        <label>
          Signature under the letters
          <input
            value={form.senderSignature}
            onChange={(e) => setForm({ ...form, senderSignature: e.target.value })}
          />
        </label>
        <div className="admin-form__actions">
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
            Save copy
          </button>
          {savedAt && !error && <span className="admin-hint">Saved.</span>}
        </div>
        {error && <p className="admin-form__error">{error}</p>}
      </form>
    </section>
  );
}
