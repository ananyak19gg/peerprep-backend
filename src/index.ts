import express from "express";
import cors from "cors";
import * as admin from "firebase-admin";
import cron from "node-cron";
import { recalculatePanicLevels } from "./panicRecalculator";
import { sendDailyNotifications } from "./notifications";

// --------------------
// App Setup
// --------------------
const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());

app.use(express.json());

// --------------------
// Firebase Init
// --------------------
import serviceAccount from "../serviceAccountKey.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      serviceAccount as admin.ServiceAccount
    ),
  });
}

const db = admin.firestore();

// --------------------
// CRON: Daily Panic + Notifications
// --------------------
cron.schedule("0 0 * * *", async () => {
  console.log("🕒 [CampusConnect] Running daily audit...");
  await recalculatePanicLevels();
  await sendDailyNotifications();
});

// --------------------
// API: Create Post
// --------------------
app.post("/api/posts", async (req, res) => {
  try {
    const { communityId, type, title, description, date, deadline } = req.body;

    if (!communityId || !type || !title || !description) {
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
        type,
        title,
        description,
        date: date || null,
        deadline: deadline || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    res.status(201).json({
      success: true,
      postId: postRef.id,
    });
  } catch (error) {
    console.error("❌ Error creating post:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// --------------------
// API: Get Posts
// --------------------
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

    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// --------------------
// Global Lounge APIs
// --------------------
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

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("❌ Lounge error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

app.get("/api/lounge/messages", async (_req, res) => {
  try {
    const snapshot = await db
      .collection("globalLounge")
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("❌ Lounge fetch error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// --------------------
// Health Check
// --------------------
app.get("/", (_req, res) => {
  res.send("🚀 CampusConnect Backend is Live!");
});

// --------------------
// Server Start
// --------------------
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`📡 Server running on port ${PORT}`);
});