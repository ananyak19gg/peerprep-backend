// src/services/taskService.ts
import { db } from "../firebase";

/**
 * Add a new task to Firestore
 */
export async function addTask(task: { 
  title: string; 
  deadline: string; 
  college_id: string; 
  assigned_to: string; 
}) {
  await db.collection("tasks").add(task);
  console.log("✅ Task added:", task);
}

/**
 * Get all tasks for a given college
 */
export async function getTasksByCollege(college_id: string) {
  const snapshot = await db.collection("tasks")
    .where("college_id", "==", college_id)
    .get();

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}