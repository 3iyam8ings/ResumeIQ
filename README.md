<div align="center">
  <img src="frontend/public/logo.png" alt="ResumeIQ Logo" width="200" />
  <h1>ResumeIQ</h1>
  <p><strong>Beat the ATS. Ace the interview. Land the job.</strong></p>
</div>

---

Job hunting shouldn't feel like throwing your hard work into a black box. **ResumeIQ** is a full-stack platform powered by Google's Gemini 2.5 Flash that acts as your personal, ruthless career coach. It analyzes your resume exactly how an Applicant Tracking System (ATS) would, providing actionable insights to help you get hired.

## ✨ Features

- 📄 **Smart ATS Matching:** Upload your PDF resume and a target job description. We calculate a match score and provide a no-nonsense breakdown of missing keywords and skills.
- ✍️ **AI Bullet Point Rewrite:** Select any weak bullet point on your resume, and our AI will rewrite it to be impactful and tailored specifically to your target job.
- ✉️ **One-Click Cover Letters:** Generate highly specific, professional cover letters that perfectly bridge your experience with the job requirements.
- 🎤 **Interactive Mock Interviews:** Practice with custom technical and behavioral questions generated from the job description. Get real-time, interactive feedback on your answers via voice and text AI.
- 🗺️ **Personalized Learning Roadmaps:** Share your GitHub or portfolio. The AI analyzes your current projects and generates a step-by-step roadmap to bridge your skill gaps.
- 📊 **Kanban Job Tracker:** A built-in drag-and-drop dashboard to save analyzed jobs and track your application progress in real time.
- 🧠 **Cognitive IQ Assessment:** Test your logic and spatial reasoning with our interactive pattern matrix puzzles, complete with a personalized AI cognitive profile.

## 🛡️ Enterprise-Grade Architecture & Security

- **Bulletproof Auth:** Secure local accounts (BCrypt hashing) alongside seamless Google and GitHub OAuth. Complete with rate-limited password resets, one-time expiring tokens, and robust old-token invalidation.
- **Backend API Security:** All AI integrations (like the Gemini API) are securely routed through our Spring Boot backend. Endpoints are protected by Bucket4j rate limiting (e.g., 5 req/min per IP) and strict DTO input validation to prevent abuse and injection.
- **Reliable Data Sync:** The React frontend stays perfectly synced with our PostgreSQL database, ensuring your job tracking and application data are never lost.
- **Enterprise Reliability:** Asynchronous non-blocking email services, anti-enumeration protections to prevent email scraping, and comprehensive backend integration testing ensure the platform is robust.

## 🎨 The Neo-Brutalist Experience

We ditched the boring corporate aesthetic for a striking **Neo-Brutalist** design. Heavy borders, vibrant colors, chunky typography, and deeply satisfying physical "press" animations make ResumeIQ a joy to use. The UI is packed with micro-interactions, custom hover states, and dynamic hacker-style terminals that animate logically as your data is processed.

## 🏗️ Tech Stack

- **Frontend:** React (Vite), React Router, Neo-Brutalist Custom CSS
- **Backend:** Java 17, Spring Boot, Spring Security, Spring Cloud Gateway
- **Database:** PostgreSQL (Production) / H2 (Testing)
- **AI Integration:** LangChain4j, Google Gemini 2.5 Flash API, Vapi Voice AI

---

## 🚀 Run It Locally

To spin this up on your machine, you'll need Node.js, Java 17, Docker, and a free Google Gemini API Key.

### 1. Database Setup
Start the local PostgreSQL container. Copy `backend/.env.example` to `backend/.env` and insert your API credentials.
```bash
docker compose up -d postgres
```

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Start the API Gateway & Backend Service
```bash
cd api-gateway
./gradlew bootRun

# In a new terminal window:
cd backend
./gradlew bootRun
```
Access the app at `http://localhost:5173`.

---

## 📅 Hackathon Journey

We moved fast to build a complete, polished product. Here's a snapshot of our key development milestones:

- **Core Infrastructure & Design:** Configured PostgreSQL, Spring Boot, Spring Security, and the React/Vite frontend. Built out the core Neo-Brutalist design system across the entire application.
- **AI Integration:** Successfully wired up LangChain4j with Gemini 2.5 Flash for the Cover Letter Generator, Job Matching, and Resume Parsing engines.
- **Interactive Mock Interviews:** Integrated `@vapi-ai/web` for real-time voice interviews, solved Vite ESM interop issues, and polished the chat interface with smart natural language detection ("end session").
- **Job Tracker CRUD:** Built the interactive Kanban dashboard connected to secure, authenticated backend REST endpoints.
- **IQ Test & Security Hardening:** Developed the logic puzzle `PatternMatrix`, managed global test states, and migrated sensitive API prompt generation to a heavily rate-limited, validated backend endpoint. Leaked keys were successfully rotated and eliminated from the client.
