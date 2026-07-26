import { useEffect, useState } from "react";
import {
  subscribeLetters,
  createLetter,
  updateLetter,
  deleteLetter,
} from "../../services/lettersService.js";

const EMPTY = { title: "", body: "", category: "For her", envelopeColor: "wine", stamp: "💌", active: true };
const COLORS = ["wine", "gold", "rose", "navy"];

export default function LettersManager() {
  const [letters, setLetters] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => subscribeLetters(setLetters), []);

  const sorted = [...letters].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  function startEdit(letter) {
    setEditingId(letter.id);
    setForm({
      title: letter.title,
      body: letter.body,
      category: letter.category || "For her",
      envelopeColor: letter.envelopeColor || "wine",
      stamp: letter.stamp || "💌",
      active: letter.active ?? true,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        await updateLetter(editingId, form);
      } else {
        await createLetter(form, Date.now());
      }
      resetForm();
    } catch (err) {
      console.error("Saving letter failed:", err);
      setError(
        err?.code === "permission-denied"
          ? "Firestore rejected this save (permission-denied). Your Firestore security rules likely haven't been deployed, or aren't allowing your admin account to write — check the Rules tab in the Firebase console."
          : `Couldn't save this letter: ${err?.message || "unknown error"}`
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this letter for good?")) return;
    setError("");
    try {
      await deleteLetter(id);
      if (editingId === id) resetForm();
    } catch (err) {
      console.error("Deleting letter failed:", err);
      setError(`Couldn't delete this letter: ${err?.message || "unknown error"}`);
    }
  }

  return (
    <div className="admin-grid">
      <section>
        <h2 className="admin-h2">{editingId ? "Edit letter" : "Write a new letter"}</h2>
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Why you"
              required
            />
          </label>
          <div className="admin-form__row">
            <label>
              Category
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="For her"
              />
            </label>
            <label>
              Stamp emoji
              <input
                value={form.stamp}
                onChange={(e) => setForm({ ...form, stamp: e.target.value })}
                placeholder="💌"
                maxLength={4}
              />
            </label>
          </div>
          <label>
            Envelope color
            <select
              value={form.envelopeColor}
              onChange={(e) => setForm({ ...form, envelopeColor: e.target.value })}
            >
              {COLORS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Letter body
            <textarea
              rows={10}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder="Jessa,&#10;&#10;Write from the heart..."
              required
            />
          </label>
          <label className="admin-form__checkbox">
            <input
              type="checkbox"
              checked={form.active ?? true}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Active
            <span className={`admin-form__status ${form.active ?? true ? "is-active" : "is-inactive"}`}>
              {(form.active ?? true) ? "● visible on her page" : "● hidden from her page"}
            </span>
          </label>
          {error && <p className="admin-form__error">{error}</p>}
          <div className="admin-form__actions">
            <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
              {editingId ? "Save changes" : "Add letter"}
            </button>
            {editingId && (
              <button type="button" className="admin-btn" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section>
        <h2 className="admin-h2">Letters ({sorted.length})</h2>
        <ul className="admin-list">
          {sorted.map((letter) => (
            <li key={letter.id} className="admin-list__item">
              <div>
                <p className="admin-list__title">
                  {letter.stamp} {letter.title}
                  {letter.active === false && <span className="admin-list__badge">inactive</span>}
                </p>
                <p className="admin-list__meta">{letter.category} · {letter.envelopeColor}</p>
              </div>
              <div className="admin-list__actions">
                <button type="button" className="admin-btn admin-btn--sm" onClick={() => startEdit(letter)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn--sm admin-btn--danger"
                  onClick={() => handleDelete(letter.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
          {sorted.length === 0 && <p className="admin-empty">No letters yet — write your first one.</p>}
        </ul>
      </section>
    </div>
  );
}
