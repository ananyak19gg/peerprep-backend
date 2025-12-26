// src/services/postService.ts
import { db } from "../firebase";

/**
 * Create a new post in Firestore
 */
export async function createPost(post: { 
  title: string; 
  content: string; 
  college_id: string; 
  author_id: string; 
}) {
  await db.collection("posts").add(post);
  console.log("Post created:", post);
}

/**
 * Get all posts for a given college
 */
export async function getPostsByCollege(college_id: string) {
  const snapshot = await db.collection("posts")
    .where("college_id", "==", college_id)
    .get();

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}