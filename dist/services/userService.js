"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
exports.saveUser = saveUser;
// src/services/userService.ts
const firebase_1 = require("../firebase");
/**
 * Verify Firebase ID token and attach college_id
 */
async function verifyToken(idToken) {
    const decoded = await firebase_1.admin.auth().verifyIdToken(idToken);
    const email = decoded.email;
    const domain = email.split("@")[1];
    // Lookup college_id from Firestore
    const snapshot = await firebase_1.db.collection("colleges").where("domain", "==", domain).get();
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
async function saveUser(user) {
    await firebase_1.db.collection("users").doc(user.uid).set(user);
    console.log("User saved:", user);
}
