import "./BackgroundFX.css";

// A little vintage cast of characters, each with its own warm tint —
// butterflies, blooms, books, letters and stamps drifting like paper
// ephemera caught in a sunbeam, instead of a night sky.
const MOTIFS = [
  { glyph: "🦋", color: "var(--neon-blue-soft)" },
  { glyph: "🌸", color: "var(--rose)" },
  { glyph: "✉", color: "var(--wine)" },
  { glyph: "📖", color: "var(--gold-soft)" },
  { glyph: "🌿", color: "var(--sage)" },
  { glyph: "🌷", color: "var(--rose)" },
  { glyph: "🦋", color: "var(--dusk-plum)" },
  { glyph: "✦", color: "var(--gold-soft)" },
  { glyph: "🦋", color: "var(--neon-violet)" },
  { glyph: "📮", color: "var(--wine)" },
  { glyph: "❀", color: "var(--rose)" },
  { glyph: "🪶", color: "var(--ink-soft)" },
  { glyph: "🦋", color: "var(--rose)" },
  { glyph: "📚", color: "var(--chocolate)" },
];

const DUST_COUNT = 26;

export default function BackgroundFX() {
  return (
    <div className="bgfx" aria-hidden="true">
      <div className="bgfx__orb bgfx__orb--blue" />
      <div className="bgfx__orb bgfx__orb--violet" />
      <div className="bgfx__vignette" />

      <div className="bgfx__dust">
        {Array.from({ length: DUST_COUNT }).map((_, i) => (
          <span
            key={`dust-${i}`}
            className="bgfx__mote"
            style={{
              left: `${(i * 41 + 7) % 100}%`,
              top: `${(i * 29 + 11) % 100}%`,
              animationDelay: `${(i % 10) * 0.4}s`,
              animationDuration: `${3.2 + (i % 5) * 0.7}s`,
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
              animationDuration: `${21 + (i % 4) * 5}s`,
              fontSize: `${15 + (i % 3) * 7}px`,
            }}
          >
            {m.glyph}
          </span>
        ))}
      </div>
    </div>
  );
}
