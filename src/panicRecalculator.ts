import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { db } from './firebase';


export const recalculatePanicLevels = functions.pubsub
  .schedule("0 0 * * *")
  .timeZone("UTC")
  .onRun(async () => {
    console.log("Recalculating panic levels...");
    
    const tasksSnapshot = await db.collection("tasks").get();
    
    const updates: Promise<any>[] = [];
    
    tasksSnapshot.forEach((taskDoc) => {
      const task = taskDoc.data();
      if (!task.deadline) return;
      
      const deadline = task.deadline.toDate();
      const now = new Date();
      const daysLeft = Math.ceil(
        (deadline.getTime() - now.getTime()) / (1000 * 3600 * 24)
      );
      
      let panicLevel = "LOW";
      if (daysLeft < 5) panicLevel = "HIGH";
      else if (daysLeft <= 10) panicLevel = "MEDIUM";
      
      if (task.panicLevel !== panicLevel) {
        updates.push(
          taskDoc.ref.update({
            panicLevel,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
          })
        );
        console.log(`Task ${taskDoc.id}: ${panicLevel} (${daysLeft} days left)`);
      }
    });
    
    await Promise.all(updates);
    console.log("Panic calculation complete!");
    return null;
  });
