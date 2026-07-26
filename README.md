# <img src="frontend/public/logo.png" alt="ResumeIQ Logo" height="32" style="vertical-align: middle;" /> ResumeIQ

Hey there! 👋 Welcome to **ResumeIQ**. 

I built this project because job hunting is incredibly stressful, and getting past automated Applicant Tracking Systems (ATS) feels like a black box. You submit a resume you worked hard on, and then... nothing. 

ResumeIQ is a full-stack tool I put together that uses Google's Gemini 2.5 Flash to act as a career coach. It looks at your resume exactly how an ATS would, and tells you what you need to fix to actually get an interview.

## What it does

- **Match your resume to the job:** Upload your PDF and paste the job description you want. The app reads both, calculates a match score, and gives you a breakdown of the exact skills you hit and the keywords you completely missed.
- **Fix your bullet points:** If you struggle with wording, you can select any bullet point on your resume and have the AI rewrite it to sound more impactful and tailored to the job.
- **Write your cover letter:** Cover letters are tedious. Click a button, and ResumeIQ writes a highly specific cover letter that blends your uploaded resume with the target job. 
- **Practice for the interview:** The app can generate custom technical and behavioral questions based on the job description. You type in your answers (or use the voice AI interview mode), and it gives you instant feedback.
- **Figure out what to learn next:** If you aren't ready for the job yet, share your portfolio or GitHub. The AI will look at your current projects and generate a step-by-step roadmap of exactly what you need to learn.
- **Keep track of everything:** There's a built-in drag-and-drop Kanban dashboard where you can save jobs and track where you are in the application process.
- **Take the IQ Test:** A fun, built-in logic and spatial reasoning test with dynamic pattern matrix puzzles and a personalized cognitive profile.

## The Vibe

I was tired of boring corporate dashboards, so I built the frontend using a Neo-Brutalist design. It uses heavy black borders, bright colors, chunky fonts, and satisfying, physical "press" animations on all the buttons. It makes the app genuinely fun to click around in. 

## How it was built

- **Frontend:** React (Vite) + React Router
- **Backend:** Java 17 with Spring Boot and Spring Security
- **API Gateway:** Spring Cloud Gateway
- **Database:** PostgreSQL for the running app; H2 for automated tests
- **AI Brain:** LangChain4j hooked up to the Google Gemini API

## Security & Reliability

I wanted to make sure this app handles data responsibly:
- **Auth:** You can create a local account (passwords are BCrypt hashed) or log in with Google/GitHub. The reset-password flow uses expiring, one-time secure tokens.
- **Rate Limiting:** The backend is protected by Bucket4j rate limiting (e.g., 5 requests/min per IP) to prevent API abuse, especially on the Gemini AI endpoints.
- **Anti-Enumeration:** The auth endpoints return consistent responses to prevent email scraping.

## How to run it yourself

If you want to spin this up on your own machine, you'll need Node.js, Java 17, Docker, and a free Google Gemini API Key.

**1. Database setup**
Start the local PostgreSQL container. Copy `backend/.env.example` to `backend/.env` and fill in your Gemini and OAuth credentials.
```bash
docker compose up -d postgres
```

**2. Start the Frontend**
```bash
cd frontend
npm install
npm run dev
```

**3. Start the API Gateway & Backend**
```bash
cd api-gateway
./gradlew bootRun

# In a new terminal window:
cd backend
./gradlew bootRun
```
Once everything is running, just open `http://localhost:5173` in your browser!

---

## Hackathon Progress (July 24-26, 2026)

Here's a quick rundown of what was accomplished during the hackathon:
- Setup PostgreSQL, Spring Boot, Spring Security, and the React frontend.
- Nailed down the Neo-Brutalist design system across all pages.
- Hooked up LangChain4j with Gemini 2.5 Flash for the Cover Letter Generator, Job Matching, and Resume Parsing.
- Integrated `@vapi-ai/web` for real-time voice interviews and added smart natural language detection to end sessions gracefully.
- Built a full Kanban Job Tracker with drag-and-drop support, hooked into secure REST endpoints.
- Built out the IQ Test feature (the logic puzzles) and secured the AI prompt generation on the backend to protect our API keys from leaking to the browser.
