import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DodgeButton from "../DodgeButton/DodgeButton.jsx";
import "./QuestionFlow.css";

const cardVariants = {
  enter: { opacity: 0, y: 28, rotate: -1.5 },
  center: { opacity: 1, y: 0, rotate: 0 },
  exit: { opacity: 0, y: -24, rotate: 1.5 },
};

export default function QuestionFlow({ questions, onAnswer, onDodge, onComplete }) {
  const [index, setIndex] = useState(0);
  const current = questions[index];

  function handleYes() {
    onAnswer?.(current, "yes");
    if (index === questions.length - 1) {
      onComplete?.();
    } else {
      setIndex((i) => i + 1);
    }
  }

  if (!current) return null;

  return (
    <div className="qflow">
      <div className="qflow__progress" aria-hidden="true">
        {questions.map((q, i) => (
          <span
            key={q.id}
            className={`qflow__dot ${i <= index ? "qflow__dot--filled" : ""}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          className="qflow__card"
          variants={cardVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="qflow__eyebrow">Question {index + 1} of {questions.length}</p>
          <h2 className="qflow__question">{current.text}</h2>
          {current.subtext && <p className="qflow__subtext">{current.subtext}</p>}

          <div className="qflow__actions">
            <button type="button" className="qflow__yes" onClick={handleYes}>
              {current.yesLabel || "Yes"}
            </button>
            <DodgeButton label={current.noLabel || "No"} onAttempt={onDodge} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
