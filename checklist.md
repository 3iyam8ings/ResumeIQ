# AI Resume Intelligence Platform — Build Checklist

A sprint-by-sprint plan, sequenced so every feature builds on a working core instead of ten half-finished parts. Each sprint assumes roughly 3–7 days depending on your pace — adjust freely, the order matters more than the timing.

**Ground rule:** don't start a sprint until the previous one has a "definition of done" you can actually demo, even roughly. A working MVP beats a half-built platform every time a reviewer opens your repo.

---

## Sprint 0 — Foundation
- [ ] Repo set up with a clear folder structure (frontend / api-gateway / backend / ai-service)
- [ ] Spring Boot skeleton running locally, health-check endpoint working
- [ ] Postgres connected, basic schema for `resumes` and `analyses` tables
- [ ] Pick **one** LLM provider (Gemini or OpenAI) as primary; design the AI Service behind an interface so the other could be swapped in later without touching business logic
- [ ] `.env` / secrets handled properly, never committed
- [ ] README v0: one paragraph on what this project is and why

**Definition of done:** you can hit an endpoint and get a hardcoded response back through the full stack (frontend → gateway → backend).

---

## Sprint 1 — Parser
- [ ] Upload endpoint accepts PDF and DOCX
- [ ] Text extraction working for both formats
- [ ] Section detection (contact info, experience, education, skills)
- [ ] Tested against 15–20 real resumes with varied formatting (two-column layouts, tables, unusual fonts) — not just clean examples
- [ ] Graceful error handling for malformed/unsupported files

**Definition of done:** any reasonable resume file in, structured text/JSON out, no crashes.

---

## Sprint 2 — ATS score + job match
- [ ] Job description input field/endpoint
- [ ] Keyword/skill overlap logic between resume and job description (deterministic, explainable)
- [ ] ATS score calculation with a visible breakdown — not just a number, show *why*
- [ ] Job match % calculation
- [ ] Missing skills list generated from the gap between resume and job description

**Definition of done:** paste a resume + job description, get a score, a match %, and a list of missing skills that's actually accurate on real examples.

---

## Sprint 3 — MVP polish
- [ ] Basic frontend UI for upload → results flow
- [ ] Loading states, error states handled in UI
- [ ] Unit tests for parser and scoring logic
- [ ] README v1: setup instructions, screenshots, what's built vs. planned
- [ ] **Stop here and demo this to a few real people before continuing.** This is your MVP checkpoint — if this isn't solid, everything after it inherits the problem.

**Definition of done:** a stranger can clone the repo, follow the README, and get a working demo without your help.

---

## Sprint 4 — Resume rewrite + bullet points
- [ ] Generative LLM call to rewrite a resume section
- [ ] "Improve this bullet point" feature with before/after shown side by side
- [ ] Guardrails so generated content doesn't fabricate experience the user didn't provide

**Definition of done:** pick a weak bullet point, get a genuinely better one back.

---

## Sprint 5 — Cover letter generator
- [ ] One-click generation using resume + job description as input
- [ ] Editable output (don't just dump raw LLM text with no way to adjust tone)

**Definition of done:** generates a cover letter that doesn't read as generic template filler.

---

## Sprint 6 — Mock interview
- [ ] Question generation based on resume + job description
- [ ] User answer input (text)
- [ ] AI evaluation of the answer with specific, actionable feedback

**Definition of done:** a question that's actually relevant to the resume, and feedback that's more useful than "good answer."

---

## Sprint 7 — Portfolio analysis + skill gap roadmap
- [ ] Accept a portfolio/GitHub URL, extract and analyze
- [ ] Feedback on what's missing or could be improved
- [ ] Skill gap roadmap generated from the delta between current resume and target job description

**Definition of done:** paste a real portfolio URL and get feedback that's specific to it, not generic advice.

---

## Sprint 8 — Application tracker + dashboard
- [ ] Data model for tracked applications (status: applied, OA, interview, offer, rejected)
- [ ] CRUD endpoints for applications
- [ ] Dashboard view tying together score history, tracked applications, and skill progress

**Definition of done:** the dashboard actually feels like the "home base" for a job search, not a bolted-on extra page.

---

## Stretch goals (only after everything above is solid)
- [ ] CI/CD pipeline — automated tests + deployment on push (highest signal-to-effort of the stretch items; do this one first if you only have time for one)
- [ ] RAG chatbot for Q&A over uploaded resume/job description
- [ ] Voice mock interview (speech-to-text + text-to-speech)
- [ ] Admin analytics dashboard

**Note:** only build the vector DB when you actually build RAG. An unused vector DB in your architecture diagram reads as scope-padding to a technical reviewer, not sophistication.

---

## Before you call it done
- [ ] README clearly separates "Built" vs. "Planned" — don't let unfinished stretch goals look like broken features
- [ ] One paragraph explaining *why* you sequenced the build this way (this signals engineering judgment, which is what reviewers are actually screening for)
- [ ] Real test cases documented, not just "it works on my machine"
