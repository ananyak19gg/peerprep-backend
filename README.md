<h1>🎓 CampusConnect</h1>

CampusConnect is a stress-aware campus community platform built exclusively for college students.
It helps students stay organized and mentally at ease by converting posts and discussions into manageable tasks, urgency-aware reminders, and calm AI-generated summaries.

Instead of adding pressure, CampusConnect reduces cognitive overload.

---
## Live Demo

⚠️ Note:
- Frontend deployment i.e. the below link was live at submission time.
- Due to Netlify free-tier credit limits, the deployment was auto-paused after submission.
- Complete working code and backend (Railway) are available in this repository.
- Click: https://campusconnectivity.netlify.app
---

<h2>🎯 Problem Statement</h2>

College students often face avoidable stress because:
* 📢 Important announcements are scattered across chats and platforms
* ⏳ Deadlines are mentioned casually and forgotten easily.
* 😵 Students return after breaks feeling lost in conversations
* 🔔 Existing systems overwhelm rather than guide

Most platforms focus on activity.
CampusConnect focuses on clarity.

---

<h2>🛠️ Our Approach</h2>

CampusConnect works by:
- Automatically structuring posts into tasks
- Tracking deadlines and calculating urgency (panic levels)
- Sending smart, non-intrusive notifications
- Using AI to summarize long lounge conversations
- Keeping the system calm — no forced help, no pressure loops
The aim is support without stress.

---

<h2>🌟 Core Features</h2>

* 📝 Post → Task conversion
* 🚦 Panic Levels (🟢 Calm / 🟡 Alert / 🔴 Urgent)
* 🔔 Deadline-based smart notifications
* 🧠 AI-powered Global Lounge TL;DR
* 🌍 Global Lounge for casual campus interaction
* ⏱️ Optional focus timers
* 🧘 Stress-aware UX philosophy

 --- 
  
<h2>🧰 Tech Stack</h2>

Frontend
- React / Next.js
- Tailwind CSS
- Firebase Authentication

Backend
- Node.js + Express
- Firebase Admin SDK
- Cron-based background jobs

AI & Cloud
- Google Gemini API
- Google Cloud Platform

Database
- Cloud Firestore
- Structured collections & rules

---

<h2>🔀 System Flow</h2>

1. Campus post is created
2. Post content is analyzed
3. Tasks are generated (if deadlines exist)
4. Panic levels update as deadlines approach
5. Notifications are sent based on urgency
6. Lounge messages accumulate
7. AI generates a TL;DR when a student returns

---

<h2>👥 Team Members & Contributions</h2>

<h3>Ananya Dubey (Backend Developer & AI Integrator)</h3>

* Designed the complete backend architecture
* Implemented all APIs for posts, tasks, notifications, and lounge features
* Integrated Google Gemini AI for:
* Post → Task understanding
* Global Lounge TL;DR generation
* Managed Firestore schema, cron jobs, and environment configuration

<h3>Shreya Singh (Documentation & Authentication Lead)</h3>

* Authored complete project documentation and system explanation
* Implemented authentication flow using Firebase Auth
* Defined access logic and user flow documentation
* Ensured clarity and consistency for submission and evaluation

<h3>Rishita Chouksey (Connectivity & Integration Lead)</h3>

* Established frontend–backend connectivity
* Integrated APIs with frontend components
* Ensured smooth data flow across posts, lounge, and tasks
* Led the overall pitch narrative and feature walkthrough

<h3>Shreya Deolia (Frontend Developer & UI/UX Designer)</h3>

* Designed the user interface and interaction flow
* Implemented frontend layouts and components
* Focused on clean, calm, and accessible UX
* Ensured design aligned with stress-aware principles

---

<h2> ⚙️ Project Setup (Backend) </h2>
1️⃣ Clone the Repository

```bash
git clone <backend-repo-url>
cd CampusConnect-Backend
```

2️⃣ Install Dependencies

```bash
npm install
```

3️⃣ Environment Variables

Create a .`env `file:

GEMINI_API_KEY=your_gemini_api_key


⚠️ Do not commit .env or service account keys.

4️⃣ Run the Server
```bash
npm run build
npm start
```

Server runs locally at:
http://localhost:8080

---

<h2>🎬 Demo Overview</h2>

The demo includes:

* Creating campus posts
* Automatic task creation
* Panic level transitions
* Smart notifications
* AI-generated TL;DR for lounge messages

---

<h2>📈 Key Learnings</h2>

- Designing stress-aware systems
- Backend-first architecture thinking
- Real-world AI integration (Gemini)
- Secure Firestore modeling
- Team-based modular development
- Debugging cloud auth & environment issues

---

## 📄 License

Open-source project for educational and hackathon use.

---

## 🙌 Acknowledgements

* Hackathon organizers and mentors
* Google Cloud & Firebase
* Peer reviewers and testers

---

## CampusConnect
Clarity over chaos. Calm over clutter.
