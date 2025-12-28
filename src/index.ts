import "dotenv/config";
import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import cron from "node-cron";

import { recalculatePanicLevels } from "./panicRecalculator";
import { sendDailyNotifications } from "./notifications";
import { loungeTLDR } from "./routes/loungeTLDR";

const app = express();

/* =======================
   FIREBASE INIT (SAFE)
   ======================= */
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

/* =======================
   MIDDLEWARE
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
        error: "Missing required fields",
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

    return res.status(201).json({
      success: true,
      postId: postRef.id,
    });
  } catch (error) {
    console.error("❌ Error creating post:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

app.get("/api/posts", async (req, res) => {
  try {
    const { communityId } = req.query;

    if (!communityId) {
      return res.status(400).json({
        success: false,
        error: "communityId is required",
      });
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

    return res.json({ success: true, posts });
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    return res.status(500).json({ success: false });
  }
});

/* =======================
   GLOBAL LOUNGE
   ======================= */
app.post("/api/lounge/message", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: "Message text required",
      });
    }

    await db.collection("globalLounge").add({
      text,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(201).json({ success: true });
  } catch (error) {
    console.error("❌ Lounge error:", error);
    return res.status(500).json({ success: false });
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

    return res.json({ success: true, messages });
  } catch (error) {
    console.error("❌ Lounge fetch error:", error);
    return res.status(500).json({ success: false });
  }
});

/* =======================
   GEMINI TL;DR
   ======================= */
app.get("/api/lounge/tldr", loungeTLDR);

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
  console.log(`📡 Server running on port ${PORT}`);
});