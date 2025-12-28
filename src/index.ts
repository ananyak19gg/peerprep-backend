import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import * as admin from "firebase-admin";
import cron from "node-cron";
import { recalculatePanicLevels } from "./panicRecalculator";
import { sendDailyNotifications } from "./notifications";
import { loungeTLDR } from "./routes/loungeTLDR";
import { postToTask } from "./triggers/postToTask";

const app = express();
app.use(express.json());

// Firebase Initialization
let serviceAccount: any;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    serviceAccount = require("../serviceAccountKey.json");
  }
} catch (error) {
  console.warn("⚠️ Firebase service account configuration missing.");
}

if (!admin.apps.length && serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
const db = admin.firestore();

// Cron Job: Daily Logic
cron.schedule("0 0 * * *", async () => {
  try {
    await recalculatePanicLevels();
    await sendDailyNotifications();
  } catch (err) {
    console.error("Cron execution error:", err);
  }
});

// API: Create Post + AI Trigger
app.post("/api/posts", async (req, res) => {
  try {
    const { communityId, type, title, description, userId } = req.body;

    const postRef = await db.collection("communities").doc(communityId).collection("posts").add({
      type, title, description, userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Extract task using Gemini AI
    postToTask(postRef.id, { description, userId });

    res.status(201).json({ success: true, postId: postRef.id });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// API: Global Lounge
app.get("/api/lounge/messages", async (_req, res) => {
  try {
    const snapshot = await db.collection("globalLounge").orderBy("createdAt", "desc").limit(50).get();
    res.json({ success: true, messages: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) });
  } catch (error) {
    res.status(500).json({ error: "Lounge fetch error" });
  }
});

app.get("/api/lounge/tldr", loungeTLDR);

app.get("/", (_req, res) => res.send("🚀 CampusConnect Backend is Live!"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`📡 Server running on port ${PORT}`);
});