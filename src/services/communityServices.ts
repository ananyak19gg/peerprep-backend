// src/services/communityService.ts
import { db, admin } from "../firebase";

/**
 * Join a community by adding the user to members array
 */
export async function joinCommunity(commId: string, uid: string) {
  await db.collection("communities").doc(commId).update({
    members: admin.firestore.FieldValue.arrayUnion(uid),
  });
  console.log(`✅ User ${uid} joined community ${commId}`);
}

/**
 * Create a new community
 */
export async function createCommunity(community: { name: string; college_id: string; created_by: string }) {
  await db.collection("communities").add({
    ...community,
    members: [community.created_by], // creator is first member
  });
  console.log("Community created:", community);
}