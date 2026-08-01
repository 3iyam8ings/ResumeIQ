# I Built a Career Coach Out of Six AI Agents Because Job Hunting Shouldn't Feel Like a Boss Fight

### Inside ResumeIQ, my entry for the 2026 AI Hackathon — and how agentic workflows are replacing basic chatbots

---

![ResumeIQ Hero Image Placeholder - A vibrant neo-brutalist dashboard showing a resume score](https://placehold.co/1200x630/f5c445/1c1b1b?text=ResumeIQ+Dashboard)
*The ResumeIQ Dashboard: Where the void of job hunting gets replaced by actionable feedback.*

Ask anyone who's job hunted in the last two years what it felt like, and you'll get some version of the same answer: exhausting, opaque, and weirdly silent. You spend hours tailoring a resume, hit submit, and then... nothing. No feedback. No explanation. Just the void.

The numbers make it clear this isn't just a feeling. Job seekers now submit anywhere from **32 to 200+ applications** before landing a single offer. On popular corporate roles, a single posting can pull **250+ applicants**, which means a genuinely qualified candidate is often one indistinguishable PDF among hundreds. And according to a Harvard Business School and Accenture study, **88% of employers** admit that qualified candidates get filtered out simply because their resume didn't echo a job description's exact wording.

There's a popular version of this story that says "75% of resumes get rejected by robots before a human ever sees them." I want to be upfront: that stat doesn't hold up. Most resumes *are* seen by a human, just after being mis-parsed, poorly ranked, or buried under a wall of near-identical competitors. That's the actual problem. Formatting. Keyword drift. Volume. So that's the problem I built for.

## Why this is a "Domain Agents" problem, not a chatbot problem

What does agentic AI look like when it's applied to one vertical's real, day-to-day workflow — not a toy demo? Job searching is a near-perfect fit because every step of it is a natural, narrow job for a dedicated agent:

- **Screening:** Checking a resume against ATS rules and a job description.
- **Tracking:** Managing applications and outcomes (no more dead spreadsheets).
- **Writing:** Crafting a tailored cover letter without staring at a blank page.
- **Rehearsing:** Practicing interview answers with real-time feedback.

Each of those became its own agent in ResumeIQ, and each agent does exactly one job — reading the same uploaded resume and target job description, and handing off context the way a human career coach would. That's the difference between a "Domain Agents" project and a general-purpose AI wrapper: narrow scope, real handoffs, no single agent trying to do everything.

## Under the Hood: The Architecture of ResumeIQ

Building an application with six distinct agents requires a robust technical foundation. Here is how the stack breaks down:

- **Frontend:** React (Vite) with a bespoke Neo-Brutalist design system.
- **Backend:** Java Spring Boot with Spring Cloud Gateway for robust API routing.
- **AI Models:** Google's Gemini SDK for text and logic processing.
- **Voice AI:** Vapi for real-time, ultra-low latency mock interviews.
- **Database:** PostgreSQL running in Docker for reliable state management.

### The Neo-Brutalist UI

I wrapped the entire application in a neo-brutalist interface — thick black borders, hard-offset shadows, a loud flat-pastel palette (`#f5c445`, `#6aaff5`, `#ff8b94`). I wanted the opposite of the soft-gradient, glassmorphic sameness that every other career-tech tool defaults to. 

*A tool for one of life's most stressful processes shouldn't look like it's afraid of its own users.*

![Neo Brutalist UI Placeholder - showing the thick borders and bright colors](https://placehold.co/800x400/6aaff5/1c1b1b?text=Neo-Brutalist+Design+System)

### The Core: Resume Analyzer and JD Matcher

The core of the app is **Home**. Upload a resume, and if you don't paste a job description, it scores pure ATS compatibility. Paste one in, and it switches modes to score a real job match instead.

Here is a simplified look at how the backend orchestrates the Gemini prompt for resume analysis:

```java
// Spring Boot Service Extract
public AnalysisResult analyzeResume(MultipartFile file, String jobDescription) {
    String extractedText = pdfService.extractText(file);
    
    String prompt = String.format(
        "You are an expert ATS system and technical recruiter. " +
        "Analyze this resume against the following job description.\\n" +
        "Resume: %s\\nJob Description: %s\\n" +
        "Provide a match percentage, keyword gaps, and formatting critique in JSON.",
        extractedText, jobDescription
    );

    return geminiClient.generateContent(prompt, AnalysisResult.class);
}
```

### Specialized Agents: Beyond the Core

From the core dashboard, the context branches out to specialized agents:

1. **Bullet-Point Rewriter:** Takes one weak line and sharpens it into something quantified and job-specific.
2. **Cover Letter Generator:** Offers three tones — Friendly, Confident, Formal — each mapped to a real sending context rather than being interchangeable style presets.
3. **Mock Interviewer:** Generates custom technical and behavioral questions from the actual job description and runs the session as either a live voice conversation (through Vapi) or a typed back-and-forth.

*Example of the Vapi Voice Integration on the frontend:*

```typescript
import Vapi from '@vapi-ai/web';

const vapi = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY);

const startInterview = async (jobContext, resumeContext) => {
  await vapi.start({
    model: {
      provider: "google",
      model: "gemini-2.0-flash",
      systemPrompt: `You are a strict but fair technical interviewer...`
    },
    voice: { provider: "11labs", voiceId: "professional-interviewer-1" }
  });
};
```

4. **Job Tracker:** A drag-and-drop Kanban board that replaces the spreadsheet everyone abandons. 
5. **The Arena:** Because a job search shouldn't be relentless, I added a hidden retro platformer one click away from the dashboard for a genuinely engaging five-minute break.

## How AI Accelerated the Build

Building a multi-agent system in a tight timeframe required leveraging AI as a pair programmer. 

**Implementation & Debugging:** I used AI assistants to write the first-pass code for the agents and carry the bulk of the iterative debug loop. One of the gnarlier bugs resolved was a Vapi web SDK interop error under Vite's module resolution ("Vapi is not a constructor").

**Architecture & Planning:** The decision to keep the Gemini-based text pipeline and the Vapi-based voice pipeline decoupled was crucial. Vapi maintains its own model whitelist, independent of the Gemini SDK's — a detail that would silently break one surface every time the other changed models. The Spring Cloud Gateway layout, the choice of Gemini over OpenAI for its usable free tier, and every final integration and validation pass before shipping stayed entirely in my hands. 

AI accelerated the build. The judgment about what to build, and whether it actually worked, didn't come from a prompt.

## What I'd tell someone starting their own Domain Agents project

Pick a workflow real people already do badly by hand — not a workflow you're inventing a need for. Job searching didn't need a new problem invented; it needed six existing, badly-served steps each handed to something that could actually do that one step well. 

Treat a prototype build like production software where it counts: the security pass that closed an IP-spoofing gap in our rate limiter, and the scoring audit that caught a silently-wrong constant, are the unglamorous parts nobody demos — but they're the difference between a toy demo and something you'd actually trust with your resume.

ResumeIQ is live at **resume-iq-teal.vercel.app** if you want to see where a coordinated set of narrow agents gets you, versus one more general-purpose chatbot wearing a career-coach hat.

*A career isn't a general-purpose problem. It's a specific domain, and it deserves agents that know it.*
