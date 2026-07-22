# 🧠 ResumeIQ Platform

An intelligent, full-stack application designed to automatically parse, evaluate, and score candidate resumes against target job descriptions. Built with a modular architecture, this project leverages **Gemini 2.5 Flash** to extract unstructured resume data, identify matching or missing keywords, provide actionable feedback, and generate personalized career assets.

## 🏗️ Architecture
- **Frontend**: React (Vite) + React Router
- **UI Design**: Neo-Brutalist Sticker System (Custom CSS + Inline Styles)
- **API Gateway**: Spring Cloud Gateway (Port 8081)
- **Backend Core**: Spring Boot (Port 8082) + Spring Security
- **Database**: H2 In-Memory Database (Fallback from PostgreSQL)
- **AI Integration**: LangChain4j with Google Gemini API
- **Authentication**: Local Email/Password + OAuth2 (Google & GitHub)

## 🚀 Features (All Sprints Complete)
- **Resume Match & Analysis**: Upload a PDF and Job Description to get an ATS Match Score and detailed breakdown of matched/missing skills.
- **Smart Rewrite**: Improve specific resume bullet points with AI to better align with the job description.
- **AI Cover Letter**: Generate a customized cover letter tailored specifically to the uploaded resume and job description.
- **Mock Interview**: Generate technical and behavioral interview questions, submit answers, and receive detailed AI feedback.
- **Look Beyond Resume**: Analyze a project portfolio and generate a personalized learning roadmap.
- **Job Tracker Dashboard**: Full CRUD dashboard to save and track the status of your job applications.
- **Secure Authentication**: Robust authentication system supporting traditional Email/Password signup/login as well as one-click OAuth2 via Google and GitHub.

## 🛠️ Getting Started

### Prerequisites
- Node.js & npm
- Java 17+
- Google Gemini API Key
- Google & GitHub OAuth2 Credentials (if running locally)

### Setup Instructions

1. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. **API Gateway**
   ```bash
   cd api-gateway
   ./gradlew bootRun
   ```

3. **Backend**
   The backend properties (`backend/src/main/resources/application.properties`) currently store the API Keys and OAuth credentials.
   ```bash
   cd backend
   ./gradlew bootRun
   ```

4. Open `http://localhost:5173` in your browser. You will be greeted by the new Neo-Brutalist Login/Signup pages!

## ✅ Development Status
- **Sprint 1 - 3 (MVP Core)**: PDF parsing, heuristic chunking, Keyword matching, ATS scoring.
- **Sprint 4**: Resume Rewriting & Bullet Point Improvement.
- **Sprint 5**: AI Cover Letter Generation.
- **Sprint 6**: Mock Interview Questions & Feedback.
- **Sprint 7**: Portfolio Analysis & Learning Roadmap.
- **Sprint 8**: Job Tracker Dashboard.
- **Sprint 9**: Full System Authentication & Neo-Brutalist Frontend Redesign.
