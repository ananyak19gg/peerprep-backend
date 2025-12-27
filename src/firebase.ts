import * as admin from "firebase-admin";

// ✅ This prevents the "Cannot find module" error during build
let serviceAccount: any;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    // Only use the file locally
    serviceAccount = require("../serviceAccountKey.json");
  }
} catch (e) {
  console.log("Service account file not found, hoping for env var...");
}

if (!admin.apps.length && serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();
export { admin };