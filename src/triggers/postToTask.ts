import { admin, db } from "../firebase"; // Ensure this path is correct
import { callGemini } from "../utils/gemini";

/**
 * Ananya, this function is now a standard helper that 
 * your Express route can call after a post is saved.
 */
export const postToTask = async (postId: string, postData: any) => {
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
    const response = await callGemini(prompt);

    if (response.includes("NONE")) {
      console.log("ℹ️ Gemini found no task in this post.");
      return;
    }

    // Clean the response (Gemini sometimes wraps JSON in markdown blocks)
    const cleanedJson = response.replace(/```json|```/g, "").trim();
    const task = JSON.parse(cleanedJson);

    // 2. Add to the Tasks collection
    await db.collection("tasks").add({
      userId: postData.userId,
      postId: postId,
      title: task.title,
      subject: task.subject,
      deadline: task.deadline,
      panicLevel: "LOW",
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log("✅ Task auto-created successfully for user:", postData.userId);

  } catch (err) {
    console.error("❌ Post→Task logic failed:", err);
  }
};