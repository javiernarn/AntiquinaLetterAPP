import { useState } from "react";
import { motion } from "framer-motion";
import "./Envelope.css";

/**
 * A wax-sealed envelope. Clicking cracks the seal and lifts the flap,
 * then calls onOpened once the animation settles so the parent can
 * reveal what's inside.
 */
export default function Envelope({ onOpened, name = "Jessa" }) {
  const [stage, setStage] = useState("closed"); // closed -> cracking -> open

  function handleOpen() {
    if (stage !== "closed") return;
    setStage("cracking");
    setTimeout(() => setStage("open"), 900);
    setTimeout(() => onOpened?.(), 1500);
  }

  return (
    <div className="envelope-stage">
      <motion.button
        type="button"
        className={`envelope envelope--${stage}`}
        onClick={handleOpen}
        aria-label={stage === "closed" ? "Open the envelope" : "Envelope opened"}
        whileHover={stage === "closed" ? { y: -4 } : {}}
      >
        <div className="envelope__body">
          <div className="envelope__flap" />
          <div className="envelope__triangle-left" />
          <div className="envelope__triangle-right" />
          <div className="envelope__label">
            <span className="script">To my {name}</span>
          </div>
          <motion.div
            className="envelope__seal"
            animate={
              stage === "cracking"
                ? { scale: [1, 1.15, 0.4], rotate: [0, -6, 14], opacity: [1, 1, 0] }
                : {}
            }
            transition={{ duration: 0.85, ease: "easeInOut" }}
          >
            J
          </motion.div>
        </div>
      </motion.button>
      {stage === "closed" && <p className="envelope-hint">tap the seal to open</p>}
    </div>
  );
}
