import * as admin from 'firebase-admin';

export const sendDailyNotifications = async () => {
    const db = admin.firestore();
    console.log('📨 Sending daily notifications...');
    
    const today = new Date();
    const tasksSnapshot = await db.collection('tasks').get();
    let sentCount = 0;
    
    for (const taskDoc of tasksSnapshot.docs) {
      const task = taskDoc.data();
      if (!task.deadline || !task.userId) continue;
      
      const deadline = task.deadline.toDate();
      const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 3600 * 24));
      
      if ([7, 3, 1].includes(daysLeft)) {
        const userDoc = await db.collection('users').doc(task.userId).get();
        const user = userDoc.data();
        
        if (user && user.fcmToken) {
          let title = '', body = '';
          if (daysLeft === 7) { title = '📚 7 Days Left'; body = `Your ${task.subject} assignment is due in 7 days`; }
          else if (daysLeft === 3) { title = '⚠️ 3 Days Left!'; body = `Your ${task.subject} assignment is due in 3 days!`; }
          else if (daysLeft === 1) { title = '🚨 Deadline Tomorrow!'; body = `Your ${task.subject} is due tomorrow!`; }
          
          try {
            await admin.messaging().send({
              token: user.fcmToken,
              notification: { title, body }
            });
            sentCount++;
          } catch (error) {
            console.error(`Failed to send to ${task.userId}:`, error);
          }
        }
      }
    }
    console.log(`✅ Sent ${sentCount} notifications`);
};