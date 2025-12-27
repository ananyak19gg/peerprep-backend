import { Request, Response } from "express";
import { admin, db } from "../firebase";
import { callGemini } from "../utils/gemini";

export async function loungeTLDR(req: Request, res: Response) {
  try {
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // 1️⃣ Get user doc
    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.exists ? userDoc.data() : null;

    // ✅ FIX: fallback lastSeen (24 hours ago)
    let lastSeen;

    if (!userData || !userData.lastSeenLoungeAt) {
     lastSeen = admin.firestore.Timestamp.fromDate(
  new Date(Date.now() - 500 * 24 * 60 * 60 * 1000) 
);
    } else {
      lastSeen = userData.lastSeenLoungeAt;
    }

    // 2️⃣ Fetch lounge messages after lastSeen
    const messagesSnap = await db
      .collection("loungeMessages")
      .where("createdAt", ">", lastSeen)
      .orderBy("createdAt", "asc")
      .limit(20)
      .get();

    if (messagesSnap.empty) {
      return res.json({ message: "You're all caught up 🎉" });
    }

    // 3️⃣ Extract text
    const texts = messagesSnap.docs
      .map(doc => doc.data().text)
      .filter(Boolean);

    if (texts.length === 0) {
      return res.json({ message: "No readable messages yet" });
    }

    // 4️⃣ Gemini prompt
    const prompt = `
You are summarizing a college Global Lounge chat.

Give a calm TL;DR in 3–5 bullet points.
No names. No drama. No exaggeration.

Messages:
${texts.join("\n")}
`;

    // 5️⃣ Call Gemini
    const summary = await callGemini(prompt);

    // 6️⃣ Save summary
    await db.collection("loungeSummaries").add({
      userId,
      summary,
      from: lastSeen,
      to: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // 7️⃣ Update user's last seen
    await db.collection("users").doc(userId).set(
      {
        lastSeenLoungeAt: admin.firestore.FieldValue.serverTimestamp()
      },
      { merge: true }
    );

    return res.json({ summary });

  } catch (err) {
    console.error("❌ TLDR Error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to generate TL;DR"
    });
  }
}
