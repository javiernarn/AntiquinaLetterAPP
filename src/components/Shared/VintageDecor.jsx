import "./VintageDecor.css";

/**
 * Vintage sticky notes + stamp-style stickers, scattered around the
 * public letter page only (never the admin dashboard). Purely decorative:
 * fixed position, no pointer events, sits above the night-sky background
 * but never blocks the real content or its clicks.
 */
const NOTES = [
  { text: "for you", rotate: -7, top: "14%", left: "6%", tone: "kraft" },
  { text: "read me soon", rotate: 5, top: "62%", left: "4%", tone: "rose" },
  { text: "always &\nalways", rotate: -4, top: "20%", right: "5%", tone: "sage" },
  { text: "p.s. i love you", rotate: 6, top: "70%", right: "6%", tone: "kraft" },
];

const STICKERS = [
  { glyph: "❀", top: "8%", right: "16%", rotate: -10 },
  { glyph: "🦋", top: "46%", left: "2%", rotate: 8 },
  { glyph: "✉", bottom: "10%", left: "14%", rotate: -6 },
  { glyph: "📖", bottom: "6%", right: "3%", rotate: 12 },
  { glyph: "🌷", top: "34%", right: "4%", rotate: -14 },
  { glyph: "🦋", bottom: "24%", left: "3%", rotate: 15 },
];

export default function VintageDecor() {
  return (
    <div className="vdecor" aria-hidden="true">
      <div className="vdecor__notes">
        {NOTES.map((n, i) => (
          <div
            key={`note-${i}`}
            className={`vdecor__note vdecor__note--${n.tone}`}
            style={{
              top: n.top,
              bottom: n.bottom,
              left: n.left,
              right: n.right,
              "--rotate": `${n.rotate}deg`,
            }}
          >
            <span className="vdecor__tape" />
            {n.text.split("\n").map((line, li) => (
              <span key={li} className="vdecor__note-line script">
                {line}
              </span>
            ))}
          </div>
        ))}
      </div>

      <div className="vdecor__stickers">
        {STICKERS.map((s, i) => (
          <div
            key={`sticker-${i}`}
            className="vdecor__sticker"
            style={{
              top: s.top,
              bottom: s.bottom,
              left: s.left,
              right: s.right,
              "--rotate": `${s.rotate}deg`,
            }}
          >
            <span className="vdecor__sticker-glyph">{s.glyph}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
