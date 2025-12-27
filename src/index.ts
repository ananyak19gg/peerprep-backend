import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import cron from "node-cron";

import { recalculatePanicLevels } from "./panicRecalculator";
import { sendDailyNotifications } from "./notifications";

const app = express();

/* =======================
   CORS — FINAL & SAFE
   ======================= */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://campusconnectivity.netlify.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

/* =======================
   Firebase Init
   ======================= */
import serviceAccount from "../serviceAccountKey.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      serviceAccount as admin.ServiceAccount
    ),
  });
}

const db = admin.firestore();

/* =======================
   CRON JOBS
   ======================= */
cron.schedule("0 0 * * *", async () => {
  console.log("🕒 Daily audit running...");
  await recalculatePanicLevels();
  await sendDailyNotifications();
});

/* =======================
   POSTS API
   ======================= */
app.post("/api/posts", async (req, res) => {
  try {
    const { communityId, title, description } = req.body;

    if (!communityId || !title || !description) {
      return res.status(400).json({
        success: false,
        error: "Missing fields",
      });
    }

    const postRef = await db
      .collection("communities")
      .doc(communityId)
      .collection("posts")
      .add({
        title,
        description,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    res.json({
      success: true,
      postId: postRef.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.get("/api/posts", async (req, res) => {
  try {
    const { communityId } = req.query;

    if (!communityId) {
      return res.status(400).json({ success: false });
    }

    const snapshot = await db
      .collection("communities")
      .doc(String(communityId))
      .collection("posts")
      .orderBy("createdAt", "desc")
      .get();

    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ success: true, posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* =======================
   GLOBAL LOUNGE
   ======================= */
app.post("/api/lounge/message", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ success: false });
    }

    await db.collection("globalLounge").add({
      text,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.get("/api/lounge/messages", async (_req, res) => {
  try {
    const snapshot = await db
      .collection("globalLounge")
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ success: true, messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* =======================
   HEALTH CHECK
   ======================= */
app.get("/", (_req, res) => {
  res.send("🚀 CampusConnect Backend Live");
});

/* =======================
   START SERVER
   ======================= */
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`📡 Server running on ${PORT}`);
});