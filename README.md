# 🧠 ResumeIQ

Hey there! 👋 Welcome to **ResumeIQ**. 

I built this project because job hunting is incredibly stressful, and getting past automated Applicant Tracking Systems (ATS) feels like a black box. You submit a resume you worked hard on, and then... nothing. 

ResumeIQ is a full-stack tool I put together that uses Google's Gemini 2.5 Flash to act as your personal career coach. It looks at your resume exactly how a ruthless recruiter or ATS would, and tells you exactly what you need to fix to actually get an interview.

---

## ✨ What it does

### 📄 Match your resume to the job
You just upload your PDF and paste the job description you want. The app reads both, calculates a match score, and gives you a no-nonsense breakdown of the exact skills you hit and the keywords you completely missed.

### ✍️ Fix your bullet points
If you struggle with wording (like most of us do), you can select any bullet point on your resume and have the AI rewrite it to sound much more impactful and perfectly tailored to the job you want.

### ✉️ Write your cover letter
Cover letters are tedious. Click one button, and ResumeIQ writes a highly specific, professional cover letter that blends your uploaded resume with the target job. 

### 🎤 Practice for the interview
Once your resume gets you in the door, the app can generate custom technical and behavioral questions based on that specific job description. You type in your answers, and it gives you instant feedback on how you did.

### 🗺️ Figure out what to learn next
If you aren't ready for the job yet, you can share your portfolio or GitHub. The AI will look at your current projects and generate a step-by-step roadmap of exactly what you need to learn to bridge the gap.

### 📊 Keep track of everything
There's a built-in Kanban-style dashboard where you can save all the jobs you've analyzed and track where you are in the application process.

### 🔐 Secure Accounts
You can create a local account with a secure password, or just click once to log in using Google or GitHub. The authentication system is bulletproof: it prevents duplicate accounts, securely hashes all passwords, provides a robust "Forgot Password" flow using expiring tokens, and intelligently routes returning OAuth users straight to the dashboard.

### 🛡️ Enterprise-Grade Security & Reliability
- **Auth Flow Logic**: Flawless signup, login, forgot-password, and reset-password.
- **Password Hashing**: BCrypt for passwords; SHA-256 for secure reset tokens (no plain text).
- **Rate Limiting**: Forgot-password endpoint protected (3 requests / 10 min per IP).
- **Anti-Enumeration**: Consistent 200 OK responses to prevent email scraping.
- **Token Security**: 15-minute expiry windows, one-time use tokens, and old token invalidation.
- **Email Delivery**: Asynchronous (`@Async`), non-blocking email service that catches exceptions gracefully.
- **Test Coverage**: Comprehensive 15+ backend integration test cases for all authentication endpoints.

### 🧠 Take the IQ Test
Test your cognitive skills with our built-in IQ assessment. It features dynamic routing, real-time timing, and personalized cognitive profiling utilizing Gemini AI for an interactive experience.

---

## 🎨 The Vibe

I was tired of boring corporate dashboards, so I built the entire frontend using a **Neo-Brutalist** design system. It uses heavy black borders, bright colors, chunky fonts, and really satisfying, physical "press" animations on all the buttons. It makes the app genuinely fun to click around in. 

We've heavily polished the UI to create a premium feel: the layout is compact with unified corner radiuses, interactions are crisp with custom hover states, and the dynamic hacker-style terminal starts clean and animates logically as it processes your resume.



## 🏗️ How it was built

- **Frontend:** React (Vite) + React Router
- **Backend:** Java 17 with Spring Boot and Spring Security
- **API Gateway:** Spring Cloud Gateway
- **Database:** PostgreSQL for the running application; H2 is used only by automated tests.
- **AI Brain:** LangChain4j hooked up to the Google Gemini API

---

## 🚀 How to run it yourself

If you want to spin this up on your own machine, you'll need Node.js, Java 17, and a free Google Gemini API Key.

**Database setup**

Start the local PostgreSQL container, then copy `backend/.env.example` to
`backend/.env` and fill in your Gemini, OAuth, and email credentials. The
default local connection is `jdbc:postgresql://localhost:5433/resume_db`.

```bash
docker compose up -d postgres
```

For a hosted database, replace `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` in
`backend/.env`. H2 is intentionally isolated to the `test` Spring profile and
is never used by `bootRun`.

**1. Start the Frontend**
```bash
cd frontend
npm install
npm run dev
```

**2. Start the API Gateway**
```bash
cd api-gateway
./gradlew bootRun
```

**3. Start the Backend Service**
```bash
cd backend
./gradlew bootRun
```

Once those three things are running, just open `http://localhost:5173` in your browser and you're good to go!

---

## 📅 Hackathon Progress - 24/July/2026

- `[x]` Setup and Configuration
  - `[x]` Add OpenAI API Key to `.env`
  - `[x]` Install `openai` package
- `[x]` Backend Updates
  - `[x]` Add `User` relationship to `JobApplication.java`
  - `[x]` Update `JobApplicationController.java` to fetch/save based on logged-in user
- `[x]` Frontend UI Construction
  - `[x]` Create Neo-Brutalist sticky `NavBar.tsx`
  - `[x]` Redesign `Dashboard.tsx` with user-specific data tracking
  - `[x]` Create `CoverLetterGenius.tsx` with interactive Neo-Brutalist inputs and OpenAI generation
  - `[x]` Create `MockInterview.tsx` with Neo-Brutalist mode dropdown and >10 message AI feedback popup
- `[x]` Integration
  - `[x]` Update `App.tsx` routes without touching existing pages
  - `[x]` Test OpenAI API integration endpoints
- `[x]` Navigation & UI Polish
  - [x] Replaced inline headers with a unified, universal `NavBar` component across all core pages
  - [x] Added a sticky scrolling "Home" link to ensure seamless navigation
  - [x] Implemented bold and underline hover states globally for a better tactile feel

- `[x]` **CoverLetterGenius UI & UX Polish (25/July/2026)**
  - `[x]` Added bold neo-brutalist styling to the component header and title
  - `[x]` Fixed terminal animation timing using `Promise.all` to synchronize properly with the lightning-fast Gemini API
  - `[x]` Updated input field placeholders to clearly distinguish them from inserted data using global `::placeholder` styling
  - `[x]` Fixed button hover effects to properly clear inline shadows and translate correctly for the neo-brutalist aesthetic
  - `[x]` Resolved TypeScript errors related to `React.CSSProperties` handling

- `[x]` **Mock Interview & Voice AI (26/July/2026)**
  - `[x]` Integrated `@vapi-ai/web` to power real-time voice AI interviews for mock sessions
  - `[x]` Resolved Vite ESM interop issues causing `Vapi is not a constructor` runtime errors
  - `[x]` Refined Neo-Brutalist layout for the Mock Interview page by stacking side-tabs vertically flush against the left edge
  - `[x]` Added smooth pop-out hover animations to the mode selection tabs
  - `[x]` Fixed absolute positioning overflows that were causing the global blue background to leak into the page layout when dropdowns were opened
  - `[x]` Fixed aggressive auto-scrolling bug that hid the chat underneath the sticky navbar
  - `[x]` Implemented smart natural language detection to gracefully end the interview and pause the timer when the user types variations of 'end session'
  - `[x]` Removed excessive page padding to keep the input interface snug at the bottom of the screen

- `[x]` **Job Tracker CRUD Integration (26/July/2026)**
  - `[x]` Developed the interactive Kanban-style dashboard for managing job applications
  - `[x]` Connected the frontend Job Tracker to the backend REST API (`/api/job-applications`) for full CRUD functionality
  - `[x]` Secured application data so users can only view and manage their own saved jobs
  - `[x]` Ensured seamless drag-and-drop state updates synchronize perfectly with the PostgreSQL database


- `[x]` **IQ Test Feature & Security Enhancements (26/July/2026)**
  - `[x]` Built full Neo-Brutalist UI flow for the IQ Test (`IQTestLanding`, `IQTestScreen`, `IQTestReviewScreen`, `IQTestResultsScreen`)
  - `[x]` Created a dynamic `PatternMatrix` component to render logic puzzles from `iqTestBank.ts`
  - `[x]` Managed global test state (answers, time remaining) using `IQTestContext`
  - `[x]` Secured the Gemini API integration by migrating prompt generation from the frontend to a new backend `/api/iqtest/summary` endpoint
  - `[x]` Hardened the new backend endpoint with `Bucket4j` rate limiting (5 req/min per IP) and strict DTO input validation to prevent API abuse
  - `[x]` Rotated leaked frontend API keys out of the `.env` file and integrated the frontend with the secured Spring Boot backend
