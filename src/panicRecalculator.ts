import * as admin from 'firebase-admin';

export const recalculatePanicLevels = async () => {
  const db = admin.firestore();
  const now = new Date();
  const tasksSnapshot = await db.collection('tasks').get();

  tasksSnapshot.forEach(async (doc) => {
    const data = doc.data();
    if (!data.deadline) return;

    const deadline = data.deadline.toDate();
    const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    let newLevel = 'LOW'; // 🟢 Calm
    if (diffDays <= 5) newLevel = 'HIGH'; // 🔴 Urgent
    else if (diffDays <= 10) newLevel = 'MEDIUM'; // 🟡 Alert

    await doc.ref.update({ panicLevel: newLevel });
  });
};