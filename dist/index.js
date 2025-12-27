"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const admin = __importStar(require("firebase-admin"));
const node_cron_1 = __importDefault(require("node-cron"));
const panicRecalculator_1 = require("./panicRecalculator");
const notifications_1 = require("./notifications");
const loungeTLDR_1 = require("./routes/loungeTLDR");
const postToTask_1 = require("./triggers/postToTask");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// --------------------
// Firebase Init (Railway & Local Compatible)
// --------------------
let serviceAccount;
try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    }
    else {
        serviceAccount = require("../serviceAccountKey.json");
    }
}
catch (error) {
    console.warn("⚠️ Firebase service account not found. Check environment variables.");
}
if (!admin.apps.length && serviceAccount) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}
const db = admin.firestore();
// --------------------
// CRON: Daily Panic + Notifications
// --------------------
node_cron_1.default.schedule("0 0 * * *", async () => {
    console.log("🕒 [CampusConnect] Running daily audit...");
    await (0, panicRecalculator_1.recalculatePanicLevels)();
    await (0, notifications_1.sendDailyNotifications)();
});
// --------------------
// API: Create Post + AI Task Trigger
// --------------------
app.post("/api/posts", async (req, res) => {
    try {
        const { communityId, type, title, description, userId, date, deadline } = req.body;
        if (!communityId || !type || !title || !description || !userId) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields (communityId, type, title, description, userId)"
            });
        }
        // 1. Save Post to Firestore
        const postRef = await db
            .collection("communities")
            .doc(communityId)
            .collection("posts")
            .add({
            type,
            title,
            description,
            userId,
            date: date || null,
            deadline: deadline || null,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        // 2. Trigger AI Task Extraction (Fire and Forget)
        // Passes description to Gemini to check for tasks/deadlines
        (0, postToTask_1.postToTask)(postRef.id, { description, userId });
        res.status(201).json({
            success: true,
            postId: postRef.id,
            message: "Post created and AI task analysis triggered"
        });
    }
    catch (error) {
        console.error("❌ Error creating post:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
// --------------------
// API: Get Posts by Community
// --------------------
app.get("/api/posts", async (req, res) => {
    try {
        const { communityId } = req.query;
        if (!communityId) {
            return res.status(400).json({ success: false, error: "communityId is required" });
        }
        const snapshot = await db
            .collection("communities")
            .doc(String(communityId))
            .collection("posts")
            .orderBy("createdAt", "desc")
            .get();
        const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ success: true, posts });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
// --------------------
// Global Lounge: Send Message
// --------------------
app.post("/api/lounge/message", async (req, res) => {
    try {
        const { text } = req.body;
        if (!text)
            return res.status(400).json({ error: "Message text required" });
        await db.collection("globalLounge").add({
            text,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        res.status(201).json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// --------------------
// Global Lounge: Get Messages
// --------------------
app.get("/api/lounge/messages", async (_req, res) => {
    try {
        const snapshot = await db
            .collection("globalLounge")
            .orderBy("createdAt", "desc")
            .limit(50)
            .get();
        const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ success: true, messages });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// --------------------
// Global Lounge: TL;DR Summary (Gemini API)
// --------------------
app.get("/api/lounge/tldr", loungeTLDR_1.loungeTLDR);
// --------------------
// Health Check
// --------------------
app.get("/", (_req, res) => {
    res.send("🚀 CampusConnect Backend is Live and Healthy!");
});
// --------------------
// Server Start
// --------------------
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`📡 [CampusConnect] Server running on port ${PORT}`);
});
