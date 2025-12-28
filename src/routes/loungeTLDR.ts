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

        let lastSeen;
        if (!userData || !userData.lastSeenLoungeAt) {
            // Fallback to 500 days ago if no lastSeen exists
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
            .limit(50) // Increased limit slightly for better summaries
            .get();

        console.log(`DEBUG: Found ${messagesSnap.size} messages since ${lastSeen.toDate()}`);

        if (messagesSnap.empty) {
            return res.json({ message: "You're all caught up 🎉" });
        }

        // 3️⃣ Extract text - ✅ FIX: Check for both 'content' and 'text' fields
        const texts = messagesSnap.docs
            .map(doc => {
                const data = doc.data();
                return data.content || data.text; // Tries 'content' first, then 'text'
            })
            .filter(t => t && t.trim().length > 0);

        console.log(`DEBUG: Extracted ${texts.length} valid text strings`);

        if (texts.length === 0) {
            return res.json({ message: "No readable messages found to summarize." });
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
        console.log("DEBUG: Calling Gemini API...");
        const summary = await callGemini(prompt);

        // 6️⃣ Save summary to history
        await db.collection("loungeSummaries").add({
            userId,
            summary,
            from: lastSeen,
            to: admin.firestore.FieldValue.serverTimestamp(),
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // 7️⃣ Update user's last seen so they don't see the same messages again
        await db.collection("users").doc(userId).set(
            { lastSeenLoungeAt: admin.firestore.FieldValue.serverTimestamp() },
            { merge: true }
        );

        return res.json({ summary });

    } catch (err: any) {
        // ✅ CRITICAL: Detailed error logging to find the root cause
        console.error("❌ TLDR Error Details:", err.message);
        if (err.stack) console.error(err.stack);

        return res.status(500).json({
            success: false,
            error: "Failed to generate TL;DR",
            details: err.message // Temporary: remove this once fixed for security
        });
    }
}