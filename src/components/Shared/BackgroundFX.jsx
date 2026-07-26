import "./BackgroundFX.css";

// A little vintage-night cast of characters, each with its own glow tint.
const MOTIFS = [
  { glyph: "🦋", color: "var(--neon-blue-soft)" },
  { glyph: "🌸", color: "var(--rose)" },
  { glyph: "♡", color: "var(--rose)" },
  { glyph: "📖", color: "var(--gold-soft)" },
  { glyph: "🍫", color: "var(--chocolate)" },
  { glyph: "🌷", color: "var(--rose)" },
  { glyph: "💙", color: "var(--neon-blue-soft)" },
  { glyph: "✦", color: "var(--gold-soft)" },
  { glyph: "🦋", color: "var(--neon-violet)" },
  { glyph: "🌙", color: "var(--moon)" },
  { glyph: "❀", color: "var(--rose)" },
  { glyph: "✦", color: "var(--neon-blue-soft)" },
  { glyph: "🦋", color: "var(--rose)" },
  { glyph: "📖", color: "var(--neon-blue-soft)" },
];

const STAR_COUNT = 30;

export default function BackgroundFX() {
  return (
    <div className="bgfx" aria-hidden="true">
      <div className="bgfx__orb bgfx__orb--blue" />
      <div className="bgfx__orb bgfx__orb--violet" />

      <div className="bgfx__stars">
        {Array.from({ length: STAR_COUNT }).map((_, i) => (
          <span
            key={`star-${i}`}
            className="bgfx__star"
            style={{
              left: `${(i * 41 + 7) % 100}%`,
              top: `${(i * 29 + 11) % 100}%`,
              animationDelay: `${(i % 10) * 0.35}s`,
              animationDuration: `${2.2 + (i % 5) * 0.6}s`,
            }}
          />
        ))}
      </div>

      <div className="bgfx__motifs">
        {MOTIFS.map((m, i) => (
          <span
            key={`motif-${i}`}
            className="bgfx__item"
            style={{
              left: `${(i * 97 + 13) % 100}%`,
              color: m.color,
              animationDelay: `${i * 1.9}s`,
              animationDuration: `${19 + (i % 4) * 5}s`,
              fontSize: `${14 + (i % 3) * 7}px`,
            }}
          >
            {m.glyph}
          </span>
        ))}
      </div>
    </div>
  );
}
