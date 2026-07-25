import { useCallback, useRef, useState } from "react";
import "./DodgeButton.css";

const TAUNTS = [
  "nice try",
  "not today",
  "keep trying",
  "so close",
  "almost",
  "nope",
  "try again",
];

/**
 * A "No" button that can never actually be pressed. It hops to a new,
 * random spot inside its container whenever a cursor gets close, and on
 * touch devices it hops away right when the tap begins, before it can
 * register. It stays technically reachable by keyboard (for screen
 * readers) but pressing it via Enter/Space just moves it again too —
 * it is never disabled or hidden, it simply never lands.
 */
export default function DodgeButton({ label = "No", onAttempt }) {
  const wrapRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dodges, setDodges] = useState(0);
  const [taunt, setTaunt] = useState("");

  const dodge = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const { width, height } = wrap.getBoundingClientRect();
    const btnW = 96;
    const btnH = 48;
    const maxX = Math.max(width - btnW, 0);
    const maxY = Math.max(height - btnH, 0);
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    setPos({ x, y });
    setDodges((d) => d + 1);
    setTaunt(TAUNTS[Math.floor(Math.random() * TAUNTS.length)]);
    onAttempt?.();
  }, [onAttempt]);

  return (
    <div className="dodge-wrap" ref={wrapRef}>
      <button
        type="button"
        className="dodge-btn"
        style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
        onMouseEnter={dodge}
        onPointerDown={(e) => {
          e.preventDefault();
          dodge();
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          dodge();
        }}
        onClick={(e) => e.preventDefault()}
        onFocus={dodge}
        aria-label={`${label} — this button is not meant to be pressed`}
      >
        {label}
      </button>
      {dodges > 0 && (
        <span className="dodge-taunt" aria-hidden="true">
          {taunt}
        </span>
      )}
    </div>
  );
}
