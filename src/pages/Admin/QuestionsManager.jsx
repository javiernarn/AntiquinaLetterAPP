import { useEffect, useState } from "react";
import {
  subscribeQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../../services/questionsService.js";

const EMPTY = { text: "", subtext: "", yesLabel: "Yes", noLabel: "No", active: true };

export default function QuestionsManager() {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => subscribeQuestions(setQuestions), []);

  const sorted = [...questions].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  function startEdit(q) {
    setEditingId(q.id);
    setForm({
      text: q.text,
      subtext: q.subtext || "",
      yesLabel: q.yesLabel || "Yes",
      noLabel: q.noLabel || "No",
      active: q.active ?? true,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.text.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await updateQuestion(editingId, form);
      } else {
        await createQuestion(form, Date.now());
      }
      resetForm();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Remove this question from the flow?")) return;
    await deleteQuestion(id);
    if (editingId === id) resetForm();
  }

  return (
    <div className="admin-grid">
      <section>
        <h2 className="admin-h2">{editingId ? "Edit question" : "Add a question"}</h2>
        <p className="admin-hint">
          These show one at a time, in order, before the envelope appears. Classic examples:
          "Do you love me?", "Will you be my girlfriend?", "Will you marry me?" — write your own.
        </p>
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Question
            <input
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              placeholder="Will you be my girlfriend?"
              required
            />
          </label>
          <label>
            Subtext (optional)
            <input
              value={form.subtext}
              onChange={(e) => setForm({ ...form, subtext: e.target.value })}
              placeholder="This is the real question..."
            />
          </label>
          <div className="admin-form__row">
            <label>
              "Yes" label
              <input
                value={form.yesLabel}
                onChange={(e) => setForm({ ...form, yesLabel: e.target.value })}
              />
            </label>
            <label>
              "No" label
              <input
                value={form.noLabel}
                onChange={(e) => setForm({ ...form, noLabel: e.target.value })}
              />
            </label>
          </div>
          <div className="admin-form__actions">
            <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
              {editingId ? "Save changes" : "Add question"}
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
        <h2 className="admin-h2">Question order ({sorted.length})</h2>
        <ul className="admin-list">
          {sorted.map((q, i) => (
            <li key={q.id} className="admin-list__item">
              <div>
                <p className="admin-list__title">{i + 1}. {q.text}</p>
                <p className="admin-list__meta">Yes: "{q.yesLabel}" · No: "{q.noLabel}"</p>
              </div>
              <div className="admin-list__actions">
                <button type="button" className="admin-btn admin-btn--sm" onClick={() => startEdit(q)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn--sm admin-btn--danger"
                  onClick={() => handleDelete(q.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
          {sorted.length === 0 && (
            <p className="admin-empty">No custom questions yet — the site is using the built-in defaults.</p>
          )}
        </ul>
      </section>
    </div>
  );
}
