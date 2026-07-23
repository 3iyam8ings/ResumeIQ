# 🧠 ResumeIQ

**ResumeIQ** is an intelligent, AI-powered career assistant that helps candidates optimize their resumes and navigate the job application process with confidence. 

Powered by Google Gemini 2.5 Flash, ResumeIQ breaks down your resume through the eyes of a recruiter and an ATS (Applicant Tracking System) to provide you with actionable, hyper-personalized feedback.

---

## ✨ Features

### 📄 AI Resume Analysis & ATS Match
Upload your resume (PDF/DOCX) alongside any target job description. ResumeIQ extracts the unstructured data and instantly calculates an ATS match score. It highlights the exact skills you matched and precisely what keywords you're missing to get the interview.

### ✍️ Smart Rewrite
Stop struggling with wording. ResumeIQ can automatically rewrite and polish your resume bullet points to dramatically improve their impact and perfectly align them with the specific job you're applying for.

### ✉️ One-Click Cover Letters
Generate a completely custom, professional cover letter tailored specifically to your uploaded resume and the target job description in seconds.

### 🎤 Interactive Mock Interviews
Prepare for the real thing. ResumeIQ generates custom technical and behavioral interview questions based on your specific job description. Submit your answers and receive immediate, actionable AI feedback on your performance.

### 🗺️ Beyond the Resume (Portfolio & Roadmaps)
Share your portfolio or GitHub profile, and ResumeIQ will analyze your projects to generate a personalized learning roadmap to help you bridge the gap between your current skills and your dream role.

### 📊 Job Tracker Dashboard
Stay organized during your hunt. The built-in Job Tracker Dashboard allows you to save, manage, and update the status of all your ongoing job applications in one central location.

### 🔐 Secure, Seamless Authentication
Create a local account or log in with one click using Google or GitHub OAuth2. Secure password reset flows are also fully supported.

---

## 🎨 UI/UX Design

ResumeIQ is built entirely using a custom **Neo-Brutalist Design System**. 
This distinctive aesthetic features bold typography, high-contrast layouts, heavy borders, vibrant colors, and satisfying, highly responsive physical hover interactions to make the platform as enjoyable to use as it is powerful.

---

## 🏗️ Tech Stack

- **Frontend:** React (Vite) + React Router
- **Backend:** Spring Boot (Java 17) + Spring Security
- **API Gateway:** Spring Cloud Gateway
- **Database:** H2 In-Memory Database
- **AI Integration:** LangChain4j + Google Gemini API

---

## 🚀 Getting Started

To run the application locally, you will need Node.js, Java 17+, and a Google Gemini API Key.

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

Once all services are running, navigate to `http://localhost:5173` to get started!
