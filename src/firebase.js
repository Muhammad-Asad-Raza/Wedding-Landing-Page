// ══════════════════════════════════════════════════════════════
// 🔥 FIREBASE CONFIG — Replace with your Firebase project config
// ══════════════════════════════════════════════════════════════
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, serverTimestamp } from 'firebase/firestore';

// 👇 PASTE YOUR FIREBASE CONFIG HERE (from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyBuQnd2HNf2Jxn3e1rsIOtAh3vfytz2Sno",
  authDomain: "wedding-page-d9092.firebaseapp.com",
  projectId: "wedding-page-d9092",
  storageBucket: "wedding-page-d9092.firebasestorage.app",
  messagingSenderId: "938033048221",
  appId: "1:938033048221:web:e7d826f9d541c766070274",
  measurementId: "G-F4PL5Q1H9B"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// ══════════════════════════════════════════
// Firestore helpers
// ══════════════════════════════════════════

/** Submit a new blessing (status: 'pending') */
export async function submitBlessing(data) {
  const token = Math.random().toString(36).slice(2, 12);
  const docRef = await addDoc(collection(db, 'blessings'), {
    ...data,
    token,
    status: 'pending',
    createdAt: serverTimestamp()
  });
  return { id: docRef.id, token };
}

/** Approve a blessing by doc ID */
export async function approveBlessing(id) {
  await updateDoc(doc(db, 'blessings', id), { status: 'approved' });
}

/** Reject a blessing by doc ID */
export async function rejectBlessing(id) {
  await updateDoc(doc(db, 'blessings', id), { status: 'rejected' });
}

/** Get all approved blessings */
export async function getApprovedBlessings() {
  const q = query(collection(db, 'blessings'), where('status', '==', 'approved'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** Delete a blessing if token matches */
export async function deleteBlessingByToken(token) {
  const q = query(collection(db, 'blessings'), where('token', '==', token));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  
  const deletedIds = [];
  for (const docSnap of snap.docs) {
    await deleteDoc(doc(db, 'blessings', docSnap.id));
    deletedIds.push(docSnap.id);
  }
  return deletedIds;
}

/** Delete a blessing by email */
export async function deleteBlessingByEmail(email) {
  const q = query(collection(db, 'blessings'), where('email', '==', email.trim().toLowerCase()));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  
  const deletedIds = [];
  for (const docSnap of snap.docs) {
    await deleteDoc(doc(db, 'blessings', docSnap.id));
    deletedIds.push(docSnap.id);
  }
  return deletedIds;
}
