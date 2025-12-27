"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinCommunity = joinCommunity;
exports.createCommunity = createCommunity;
// src/services/communityService.ts
const firebase_1 = require("../firebase");
/**
 * Join a community by adding the user to members array
 */
async function joinCommunity(commId, uid) {
    await firebase_1.db.collection("communities").doc(commId).update({
        members: firebase_1.admin.firestore.FieldValue.arrayUnion(uid),
    });
    console.log(`✅ User ${uid} joined community ${commId}`);
}
/**
 * Create a new community
 */
async function createCommunity(community) {
    await firebase_1.db.collection("communities").add({
        ...community,
        members: [community.created_by], // creator is first member
    });
    console.log("Community created:", community);
}
