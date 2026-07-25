import { motion, AnimatePresence } from "framer-motion";
import "./LetterViewer.css";

export default function LetterViewer({ letter, onClose }) {
  return (
    <AnimatePresence>
      {letter && (
        <motion.div
          className="lviewer__backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="lviewer__paper"
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="lviewer__close" onClick={onClose} aria-label="Close letter">
              ×
            </button>
            <p className="lviewer__stamp" aria-hidden="true">{letter.stamp || "💌"}</p>
            <h3 className="lviewer__title">{letter.title}</h3>
            <div className="lviewer__body">
              {letter.body.split("\n").map((line, i) => (
                <p key={i}>{line || <>&nbsp;</>}</p>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
