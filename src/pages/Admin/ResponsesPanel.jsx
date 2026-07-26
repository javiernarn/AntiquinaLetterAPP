import { useEffect, useState } from "react";
import { subscribeResponses } from "../../services/responseService.js";

function formatTime(ts) {
  if (!ts) return "—";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ResponsesPanel() {
  const [responses, setResponses] = useState(null);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    setResponses(null);
    setError(null);
    return subscribeResponses(setResponses, setError);
  }, [retryKey]);

  if (error) {
    return (
      <div className="admin-empty">
        <p style={{ margin: "0 0 12px" }}>
          Couldn't load her visits{error.code ? ` (${error.code})` : ""}. This is usually a
          permissions or connection hiccup, not missing data.
        </p>
        <button
          type="button"
          className="admin-btn admin-btn--sm"
          onClick={() => setRetryKey((k) => k + 1)}
        >
          Try again
        </button>
      </div>
    );
  }

  if (responses === null) {
    return <p className="admin-hint">Loading her visits…</p>;
  }

  if (responses.length === 0) {
    return (
      <p className="admin-empty">
        No one has opened the link yet. Once you share it, every visit — and every answer — shows
        up here in real time.
      </p>
    );
  }

  return (
    <div>
      <h2 className="admin-h2">Her responses ({responses.length})</h2>
      <p className="admin-hint">
        Newest visit first. "Final decision" only appears once every question has been answered
        with yes.
      </p>
      <ul className="admin-responses">
        {responses.map((r) => (
          <li key={r.id} className="admin-response-card">
            <div className="admin-response-card__head">
              <span className={`admin-response-card__status ${r.finalDecision === "yes" ? "is-yes" : "is-pending"}`}>
                {r.finalDecision === "yes" ? "Said yes 💛" : "In progress"}
              </span>
              <span className="admin-list__meta">{formatTime(r.startedAt)}</span>
            </div>

            {r.answers?.length > 0 && (
              <ul className="admin-response-card__answers">
                {r.answers.map((a, i) => (
                  <li key={i}>
                    <strong>{a.questionText}</strong> → {a.answer}
                  </li>
                ))}
              </ul>
            )}

            <p className="admin-list__meta">
              Letters opened: {r.openedLetterIds?.length ?? 0}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
