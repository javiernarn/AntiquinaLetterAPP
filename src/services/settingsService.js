import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../firebase.js";

const settingsDoc = doc(db, "settings", "app");

export const DEFAULT_SETTINGS = {
  heroEyebrow: "A letter, sealed with wax",
  heroTitle: "For Jessa Mae,",
  heroBody:
    "Before you open this, know that every word inside was written slowly, and meant completely.",
  congratsTitle: "She said yes.",
  congratsBody: "Every letter below is yours now, Jessa. Open them whenever you want to feel it again.",
  senderSignature: "Yours, always",
};

export function subscribeSettings(callback) {
  return onSnapshot(settingsDoc, (snap) => {
    callback(snap.exists() ? { ...DEFAULT_SETTINGS, ...snap.data() } : DEFAULT_SETTINGS);
  });
}

export async function saveSettings(data) {
  return setDoc(settingsDoc, data, { merge: true });
}
