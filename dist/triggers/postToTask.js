"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postToTask = void 0;
const firebase_1 = require("../firebase"); // Ensure this path is correct
const gemini_1 = require("../utils/gemini");
/**
 * Ananya, this function is now a standard helper that
 * your Express route can call after a post is saved.
 */
const postToTask = async (postId, postData) => {
    // 1. Validation: Ensure we have the text and userId needed for the AI
    if (!postData || !postData.description || !postData.userId) {
        console.log("⏭️ Post skipped: Missing description or userId");
        return;
    }
    const prompt = `
    You are an academic assistant.
    From the text below, detect if it contains a task or deadline.
    If YES, return STRICT JSON ONLY:
    {
      "title": "",
      "subject": "",
      "deadline": "YYYY-MM-DD"
    }
    If NO task, return: NONE

    Text:
    "${postData.description}"
  `;
    try {
        const response = await (0, gemini_1.callGemini)(prompt);
        if (response.includes("NONE")) {
            console.log("ℹ️ Gemini found no task in this post.");
            return;
        }
        // Clean the response (Gemini sometimes wraps JSON in markdown blocks)
        const cleanedJson = response.replace(/```json|```/g, "").trim();
        const task = JSON.parse(cleanedJson);
        // 2. Add to the Tasks collection
        await firebase_1.db.collection("tasks").add({
            userId: postData.userId,
            postId: postId,
            title: task.title,
            subject: task.subject,
            deadline: task.deadline,
            panicLevel: "LOW",
            status: "pending",
            createdAt: firebase_1.admin.firestore.FieldValue.serverTimestamp()
        });
        console.log("✅ Task auto-created successfully for user:", postData.userId);
    }
    catch (err) {
        console.error("❌ Post→Task logic failed:", err);
    }
};
exports.postToTask = postToTask;
