import { onDocumentCreated } from "firebase-functions/v2/firestore";
import {admin, db }from "../firebase";
import { callGemini } from "../utils/gemini";

export const postToTask = onDocumentCreated(
  "posts/{postId}",
  async (event) => {
    const post = event.data?.data();
    if (!post || !post.text || !post.userId) return;

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
"${post.text}"
`;

    const response = await callGemini(prompt);

    if (response.includes("NONE")) return;

    try {
      const task = JSON.parse(response);

      await db.collection("tasks").add({
        userId: post.userId,
        title: task.title,
        subject: task.subject,
        deadline: task.deadline,
        panicLevel: "LOW",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log("✅ Task auto-created from post");

    } catch (err) {
      console.error("❌ Post→Task parse failed:", err);
    }
  }
);
