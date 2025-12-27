import * as admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    projectId: serviceAccount.project_id
  });
}

const db = admin.firestore();

export { admin, db };
