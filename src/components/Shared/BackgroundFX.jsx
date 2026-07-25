import "./BackgroundFX.css";

const ITEMS = ["✦", "❀", "♡", "✦", "❀", "♡", "✦", "❀"];

export default function BackgroundFX() {
  return (
    <div className="bgfx" aria-hidden="true">
      {ITEMS.map((glyph, i) => (
        <span
          key={i}
          className="bgfx__item"
          style={{
            left: `${(i * 97 + 13) % 100}%`,
            animationDelay: `${i * 1.7}s`,
            animationDuration: `${16 + (i % 4) * 4}s`,
            fontSize: `${12 + (i % 3) * 6}px`,
          }}
        >
          {glyph}
        </span>
      ))}
    </div>
  );
}
