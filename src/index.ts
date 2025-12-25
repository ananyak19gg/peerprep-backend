import express from 'express';
import * as admin from 'firebase-admin';
import cron from 'node-cron'; // You'll need this for the daily timer
import { onPostCreate } from './triggers/onPostCreate';
import { recalculatePanicLevels } from './panicRecalculator';
import { sendDailyNotifications } from './notifications';

// 1. Setup the App
const app = express();
app.use(express.json());

// 2. Connect to Firebase
if (!admin.apps.length) {
  admin.initializeApp();
}

// 3. The "Daily Audit" (Runs at Midnight)
// This updates task colors (🟢🟡🔴) and sends reminders automatically
cron.schedule('0 0 * * *', async () => {
  console.log("🕒 Running Daily Task Audit...");
  await recalculatePanicLevels();
  await sendDailyNotifications();
});

// 4. API for Person 3
app.post('/api/posts', async (req, res) => {
  try {
    const postData = req.body;
    await onPostCreate(postData); 
    res.status(200).send({ message: "Task created successfully!" });
  } catch (error) {
    res.status(500).send({ error: "Failed to create task" });
  }
});

// 5. Status Check & Manual Trigger (For Testing)
app.get('/', (req, res) => res.send('🚀 CampusConnect Backend is Live!'));

app.post('/api/debug-audit', async (req, res) => {
  await recalculatePanicLevels();
  res.send({ message: "Panic levels updated manually!" });
});

// 6. Start the Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`📡 Server is running on port ${PORT}`);
});