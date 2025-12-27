"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTask = addTask;
exports.getTasksByCollege = getTasksByCollege;
// src/services/taskService.ts
const firebase_1 = require("../firebase");
/**
 * Add a new task to Firestore
 */
async function addTask(task) {
    await firebase_1.db.collection("tasks").add(task);
    console.log("✅ Task added:", task);
}
/**
 * Get all tasks for a given college
 */
async function getTasksByCollege(college_id) {
    const snapshot = await firebase_1.db.collection("tasks")
        .where("college_id", "==", college_id)
        .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
