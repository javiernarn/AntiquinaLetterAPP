import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase.js";

const responsesRef = collection(db, "responses");

/** Called once, the moment she opens the link, so a record exists to update. */
export async function startResponse() {
  const ref = await addDoc(responsesRef, {
    answers: [],
    openedLetterIds: [],
    finalDecision: null,
    startedAt: serverTimestamp(),
    respondedAt: null,
    updatedAt: serverTimestamp(),
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
  });
  return ref.id;
}

export async function recordAnswer(responseId, question, answer) {
  return updateDoc(doc(db, "responses", responseId), {
    answers: arrayUnion({
      questionId: question.id,
      questionText: question.text,
      answer,
      at: new Date().toISOString(),
    }),
    updatedAt: serverTimestamp(),
  });
}

export async function recordFinalDecision(responseId, decision) {
  return updateDoc(doc(db, "responses", responseId), {
    finalDecision: decision,
    respondedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function recordLetterOpened(responseId, letterId) {
  return updateDoc(doc(db, "responses", responseId), {
    openedLetterIds: arrayUnion(letterId),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Admin-only: live feed of every visit + her answers, newest first.
 * `onError` is required — without it a permissions error or a missing
 * index fails silently and the panel is stuck on "Loading…" forever.
 */
export function subscribeResponses(onData, onError) {
  const q = query(responsesRef, orderBy("startedAt", "desc"));
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    (err) => {
      console.error("subscribeResponses failed:", err);
      onError?.(err);
    }
  );
}
