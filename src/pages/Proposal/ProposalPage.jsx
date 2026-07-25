import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import QuestionFlow from "../../components/QuestionFlow/QuestionFlow.jsx";
import Envelope from "../../components/Envelope/Envelope.jsx";
import LetterCard from "../../components/LetterCard/LetterCard.jsx";
import LetterViewer from "../../components/LetterViewer/LetterViewer.jsx";
import BackgroundFX from "../../components/Shared/BackgroundFX.jsx";
import Loader from "../../components/Shared/Loader.jsx";
import { celebrate } from "../../components/Confetti/celebrate.js";
import { subscribeQuestions } from "../../services/questionsService.js";
import { subscribeLetters } from "../../services/lettersService.js";
import { subscribeSettings, DEFAULT_SETTINGS } from "../../services/settingsService.js";
import {
  startResponse,
  recordAnswer,
  recordFinalDecision,
  recordLetterOpened,
} from "../../services/responseService.js";
import { DEFAULT_QUESTIONS } from "../../data/defaultQuestions.js";
import { DEFAULT_LETTERS } from "../../data/defaultLetters.js";
import "./ProposalPage.css";

const RECIPIENT = import.meta.env.VITE_RECIPIENT_NAME || "Jessa";
const SENDER = import.meta.env.VITE_SENDER_NAME || "";

export default function ProposalPage() {
  const [stage, setStage] = useState("intro"); // intro -> questions -> celebrate -> envelope -> letters
  const [questions, setQuestions] = useState(null);
  const [letters, setLetters] = useState(null);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [responseId, setResponseId] = useState(null);
  const [activeLetter, setActiveLetter] = useState(null);
  const [openedIds, setOpenedIds] = useState([]);

  useEffect(() => {
    const unsubQ = subscribeQuestions((q) => setQuestions(q.length ? q : DEFAULT_QUESTIONS));
    const unsubL = subscribeLetters((l) => setLetters(l.length ? l : DEFAULT_LETTERS));
    const unsubS = subscribeSettings(setSettings);
    startResponse().then(setResponseId).catch(() => setResponseId(null));
    return () => {
      unsubQ();
      unsubL();
      unsubS();
    };
  }, []);

  const loading = questions === null || letters === null;

  function handleBegin() {
    setStage("questions");
  }

  function handleAnswer(question, answer) {
    if (responseId) recordAnswer(responseId, question, answer);
  }

  function handleComplete() {
    if (responseId) recordFinalDecision(responseId, "yes");
    setStage("celebrate");
    celebrate();
    setTimeout(() => setStage("envelope"), 2600);
  }

  function handleLetterOpen(letter) {
    setActiveLetter(letter);
    if (!openedIds.includes(letter.id)) {
      setOpenedIds((ids) => [...ids, letter.id]);
      if (responseId) recordLetterOpened(responseId, letter.id);
    }
  }

  const sortedLetters = useMemo(
    () => (letters ? [...letters].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) : []),
    [letters]
  );

  if (loading) return <Loader label="Warming the wax seal…" />;

  return (
    <div className="proposal">
      <BackgroundFX />

      <AnimatePresence mode="wait">
        {stage === "intro" && (
          <motion.section
            key="intro"
            className="proposal__hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="proposal__eyebrow">{settings.heroEyebrow}</p>
            <h1 className="proposal__title">
              {settings.heroTitle} <span className="script">{RECIPIENT}</span>
            </h1>
            <p className="proposal__body">{settings.heroBody}</p>
            <button type="button" className="proposal__begin" onClick={handleBegin}>
              Open the letter
            </button>
          </motion.section>
        )}

        {stage === "questions" && (
          <motion.section
            key="questions"
            className="proposal__stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <QuestionFlow
              questions={questions}
              onAnswer={handleAnswer}
              onComplete={handleComplete}
            />
          </motion.section>
        )}

        {stage === "celebrate" && (
          <motion.section
            key="celebrate"
            className="proposal__celebrate"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="proposal__congrats-title script">{settings.congratsTitle}</h1>
            <p className="proposal__body">{settings.congratsBody}</p>
          </motion.section>
        )}

        {stage === "envelope" && (
          <motion.section
            key="envelope"
            className="proposal__stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="proposal__eyebrow">One more thing, {RECIPIENT}</p>
            <Envelope name={RECIPIENT} onOpened={() => setStage("letters")} />
          </motion.section>
        )}

        {stage === "letters" && (
          <motion.section
            key="letters"
            className="proposal__letters"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="proposal__eyebrow">Every letter, yours</p>
            <h2 className="proposal__letters-title">A little collection, {RECIPIENT}</h2>
            <p className="proposal__body">Tap any envelope to read what's inside.</p>

            <div className="proposal__grid">
              {sortedLetters.map((letter) => (
                <LetterCard
                  key={letter.id}
                  letter={letter}
                  opened={openedIds.includes(letter.id)}
                  onOpen={handleLetterOpen}
                />
              ))}
            </div>

            {settings.senderSignature && (
              <p className="proposal__signature script">{settings.senderSignature}{SENDER ? `, ${SENDER}` : ""}</p>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      <LetterViewer letter={activeLetter} onClose={() => setActiveLetter(null)} />

      <Link to="/admin" className="proposal__admin-link">
        admin
      </Link>
    </div>
  );
}
