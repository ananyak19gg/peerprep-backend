// src/services/userService.ts
import { db, admin } from "../firebase";

/**
 * Verify Firebase ID token and attach college_id
 */
export async function verifyToken(idToken: string) {
  const decoded = await admin.auth().verifyIdToken(idToken);
  const email = decoded.email!;
  const domain = email.split("@")[1];

  // Lookup college_id from Firestore
  const snapshot = await db.collection("colleges").where("domain", "==", domain).get();
  if (snapshot.empty) {
    throw new Error("Unauthorized domain");
  }

  const college_id = snapshot.docs[0].data().college_id;

  return {
    uid: decoded.uid,
    email,
    college_id,
  };
}

/**
 * Save user into Firestore
 */
export async function saveUser(user: { uid: string; email: string; college_id: string }) {
  await db.collection("users").doc(user.uid).set(user);
  console.log("User saved:", user);
}