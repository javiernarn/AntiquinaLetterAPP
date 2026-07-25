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

const questionsRef = collection(db, "questions");

export function subscribeQuestions(callback) {
  const q = query(questionsRef, orderBy("order", "asc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function createQuestion(data, order) {
  return addDoc(questionsRef, {
    text: data.text || "Do you love me?",
    subtext: data.subtext || "",
    yesLabel: data.yesLabel || "Yes",
    noLabel: data.noLabel || "No",
    order: order ?? Date.now(),
    active: data.active ?? true,
    createdAt: serverTimestamp(),
  });
}

export async function updateQuestion(id, data) {
  return updateDoc(doc(db, "questions", id), data);
}

export async function deleteQuestion(id) {
  return deleteDoc(doc(db, "questions", id));
}
