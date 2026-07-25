import "./LetterCard.css";

const COLOR_MAP = {
  wine: "var(--wine)",
  gold: "var(--gold)",
  rose: "var(--rose)",
  navy: "var(--navy)",
};

export default function LetterCard({ letter, opened, onOpen }) {
  return (
    <button type="button" className="letter-card" onClick={() => onOpen(letter)}>
      <div
        className="letter-card__flap"
        style={{ background: COLOR_MAP[letter.envelopeColor] || COLOR_MAP.wine }}
      />
      <div className="letter-card__stamp">{letter.stamp || "💌"}</div>
      <p className="letter-card__title">{letter.title}</p>
      <p className="letter-card__category">{letter.category || "For her"}</p>
      {opened && <span className="letter-card__badge">opened</span>}
    </button>
  );
}
