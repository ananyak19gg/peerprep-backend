import "dotenv/config";
import express from "express";
import * as admin from "firebase-admin";
import cron from "node-cron";
import { recalculatePanicLevels } from "./panicRecalculator";
import { sendDailyNotifications } from "./notifications";
import { loungeTLDR } from "./routes/loungeTLDR";
import { postToTask } from "./triggers/postToTask";

const app = express();
app.use(express.json());

// Firebase Init
let serviceAccount: any;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    serviceAccount = require("../serviceAccountKey.json");
  }
} catch (error) {
  console.warn("⚠️ Firebase service account error.");
}

if (!admin.apps.length && serviceAccount) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

// Cron Job
cron.schedule("0 0 * * *", async () => {
  try {
    await recalculatePanicLevels();
    await sendDailyNotifications();
  } catch (err) {
    console.error("Cron error:", err);
  }
});

// API Routes
app.post("/api/posts", async (req, res) => {
  try {
    const { communityId, type, title, description, userId } = req.body;
    const postRef = await db.collection("communities").doc(communityId).collection("posts").add({
      type, title, description, userId, createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    postToTask(postRef.id, { description, userId }); // Trigger AI
    res.status(201).json({ success: true, postId: postRef.id });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

app.get("/api/posts", async (req, res) => {
  try {
    const snapshot = await db.collection("communities").doc(String(req.query.communityId)).collection("posts").get();
    res.json({ success: true, posts: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) });
  } catch (error) {
    res.status(500).json({ error: "Fetch error" });
  }
});

app.post("/api/lounge/message", async (req, res) => {
  try {
    await db.collection("globalLounge").add({ text: req.body.text, createdAt: admin.firestore.FieldValue.serverTimestamp() });
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Lounge error" });
  }
});

app.get("/api/lounge/messages", async (_req, res) => {
  try {
    const snapshot = await db.collection("globalLounge").orderBy("createdAt", "desc").limit(50).get();
    res.json({ success: true, messages: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) });
  } catch (error) {
    res.status(500).json({ error: "Lounge fetch error" });
  }
});

app.get("/api/lounge/tldr", loungeTLDR);
app.get("/", (_req, res) => res.send("🚀 Live!"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Port ${PORT}`));