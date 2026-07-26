import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase.js";

const lettersRef = collection(db, "letters");

/** Live-subscribe to every letter, ordered by its display order. */
export function subscribeLetters(callback) {
  const q = query(lettersRef, orderBy("order", "asc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function createLetter(data, order) {
  return addDoc(lettersRef, {
    title: data.title || "Untitled letter",
    body: data.body || "",
    category: data.category || "For her",
    envelopeColor: data.envelopeColor || "wine",
    stamp: data.stamp || "💌",
    order: order ?? Date.now(),
    active: data.active ?? true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateLetter(id, data) {
  return updateDoc(doc(db, "letters", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteLetter(id) {
  return deleteDoc(doc(db, "letters", id));
}

export async function reorderLetter(id, newOrder) {
  return updateDoc(doc(db, "letters", id), { order: newOrder });
}
