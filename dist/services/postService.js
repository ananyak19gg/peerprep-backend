"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = createPost;
exports.getPostsByCollege = getPostsByCollege;
// src/services/postService.ts
const firebase_1 = require("../firebase");
/**
 * Create a new post in Firestore
 */
async function createPost(post) {
    await firebase_1.db.collection("posts").add(post);
    console.log("Post created:", post);
}
/**
 * Get all posts for a given college
 */
async function getPostsByCollege(college_id) {
    const snapshot = await firebase_1.db.collection("posts")
        .where("college_id", "==", college_id)
        .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
