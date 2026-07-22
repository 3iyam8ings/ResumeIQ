# Career Application Agent — Orchestrator Spec & Antigravity Build Guide

Target: Track 4 (Domain Agents), ChatGPT Codex India Hackathon 2026
Deadline: Aug 3

---

## 1. The Plan Object — what the agent produces before doing anything

This is the artifact that makes your demo read as "agentic" instead of "a chain of API calls." The agent must emit this *before* executing a single step, and the UI must render it live.

```json
{
  "planId": "plan_7f3a2b",
  "createdAt": "2026-07-22T10:00:00Z",
  "input": {
    "resumeId": "resume_9931",
    "jobDescriptionId": "jd_4410"
  },
  "goal": "Prepare a complete, tailored application package for this job.",
  "steps": [
    {
      "stepId": "s1",
      "tool": "parse_resume",
      "reason": "Need structured resume data before any scoring can happen.",
      "dependsOn": [],
      "status": "pending"
    },
    {
      "stepId": "s2",
      "tool": "score_ats_match",
      "reason": "Establish baseline fit and identify gaps to address.",
      "dependsOn": ["s1"],
      "status": "pending"
    },
    {
      "stepId": "s3",
      "tool": "rewrite_bullets",
      "reason": "3 bullets scored below relevance threshold (0.6) — improve wording without fabricating experience.",
      "dependsOn": ["s2"],
      "status": "pending",
      "selfReview": true
    },
    {
      "stepId": "s4",
      "tool": "generate_cover_letter",
      "reason": "JD requires a cover letter per posting metadata; draft one grounded in resume + JD.",
      "dependsOn": ["s2"],
      "status": "pending",
      "selfReview": true
    },
    {
      "stepId": "s5",
      "tool": "generate_interview_prep",
      "reason": "Pre-empt likely interview questions based on JD requirements vs resume gaps.",
      "dependsOn": ["s2"],
      "status": "pending",
      "selfReview": true
    },
    {
      "stepId": "s6",
      "tool": "compile_summary",
      "reason": "Produce a human-readable report of what changed and why.",
      "dependsOn": ["s3", "s4", "s5"],
      "status": "pending"
    }
  ]
}
```

**Why this schema wins on the rubric:**
- `reason` on every step is the artifact that proves "planning," not autocomplete — judges can literally read the agent's justification.
- `dependsOn` shows real orchestration (s3/s4/s5 all branch off s2, run independently, converge at s6) — not a linear script.
- `selfReview: true` flags which steps get a critique-and-retry pass — this is your "Use of Codex" differentiator.
- `status` per step (`pending` → `running` → `self_reviewing` → `done`/`failed`) is exactly what your activity-log UI renders live during the demo video.

---

## 2. Tool Definitions — what the orchestrator can call

Each tool wraps a service you already built. Keep signatures narrow and typed — this is what lets Codex (or any LLM) call them reliably as function-calling tools.

| Tool name | Input | Output | Maps to your existing code |
|---|---|---|---|
| `parse_resume` | `resumeFileId` | structured JSON (contact, experience, education, skills) | Sprint 1 parser |
| `score_ats_match` | `parsedResume`, `jobDescription` | `{ matchPercent, matchedSkills[], missingSkills[], weakBullets[] }` | Sprint 2 scoring engine |
| `rewrite_bullets` | `weakBullets[]`, `jobDescription` | `{ before, after, groundedIn }[]` | Sprint 4 rewriter |
| `generate_cover_letter` | `parsedResume`, `jobDescription`, `tone` | `{ draftText }` | Sprint 5 generator |
| `generate_interview_prep` | `parsedResume`, `jobDescription` | `{ questions[], suggestedFocus }` | Sprint 6 generator |
| `compile_summary` | all prior outputs | `{ summaryText, changeLog[] }` | new — small synthesis prompt |

## 3. The Self-Review Pass (this is the "agentic" differentiator)

For any step flagged `selfReview: true`, run a second, cheap LLM call after generation:

```json
{
  "reviewOf": "s3",
  "criteria": [
    "Does the rewritten bullet address a specific JD requirement?",
    "Is every claim grounded in the original resume (no fabrication)?",
    "Is it more specific/quantified than the original?"
  ],
  "verdict": "pass | retry",
  "notes": "Bullet 2 still vague on impact — retrying with instruction to quantify."
}
```

If `verdict: retry`, re-run the step once with the review notes appended to the prompt, then accept the result regardless (cap at 1 retry to keep runtime and cost predictable for a demo).

## 4. Orchestrator Execution Order (for your backend)

```
1. Build plan (LLM call: given resume+JD, emit the Plan Object above)
2. Execute s1 (parse) synchronously — everything depends on it
3. Execute s2 (score) synchronously — s3/s4/s5 all need it
4. Execute s3, s4, s5 in parallel (independent branches)
   → for each: run tool, then if selfReview, run review, retry once if needed
5. Execute s6 (compile summary) once s3/s4/s5 all report done
6. Persist full plan + step results as one JSON blob → this is your activity log
```

Parallel execution of s3–s5 is optional polish, but it's a strong technical execution signal if you have time — sequential is fine and safer under deadline pressure.

---

## 5. Build Steps in Antigravity

Antigravity works best when you give it **verifiable tasks**: a clear behavior, target files, acceptance criteria, and a way to check success — not vague instructions. Structure each Antigravity task like this:

### Task 1 — Orchestrator core
- **Target files**: `backend/src/main/java/.../orchestrator/PlanBuilder.java`, `OrchestratorService.java`, `StepExecutor.java`
- **Instruction to give the agent**: "Build a `PlanBuilder` that takes a resumeId + jobDescriptionId, calls the LLM with [paste the Plan Object schema above] as the required output format, and returns a validated Plan object. Build an `OrchestratorService` that executes the plan's steps in dependency order, calling existing services (`ResumeParserService`, `ScoringService`, `RewriteService`, `CoverLetterService`, `InterviewPrepService`) as the tool implementations behind each step. Persist plan + step results to Postgres."
- **Acceptance criteria**: given a fixed test resume + JD, running the orchestrator produces a Plan object matching the schema, executes all 6 steps, and every step ends in `done` or `failed` (never stuck `pending`).
- **Test command**: a JUnit test that posts a fixed resume+JD and asserts the final plan JSON has all steps resolved.

### Task 2 — Self-review pass
- **Target files**: `SelfReviewService.java`
- **Instruction**: "Add a `SelfReviewService.review(stepOutput, criteria)` that returns `{verdict, notes}` per the schema in section 3. Wire it into `StepExecutor` so any step marked `selfReview: true` runs review after generation, and retries once if verdict is `retry`."
- **Acceptance criteria**: feeding a deliberately weak/generic bullet through the pipeline results in a `retry` verdict and a visibly different second attempt.

### Task 3 — Activity log UI
- **Target files**: `frontend/src/components/AgentActivityLog.jsx`
- **Instruction**: "Build a live-updating panel that polls (or websockets) the orchestrator's plan status and renders each step as a card: step name, `reason`, current `status` with an icon (pending/running/self-reviewing/done/failed), and self-review notes if present. This should visually read as 'watching an agent work,' not a static results page."
- **Acceptance criteria**: starting a run visibly transitions each step card through its states in real time.

### Task 4 — Summary/report
- **Target files**: `CompileSummaryService.java`
- **Instruction**: "Generate a short natural-language report from all step outputs: what was changed, why, and what's still missing. This becomes the final screen of the demo."

### How to run this in Antigravity day-to-day
1. Open one task at a time in the Agent Panel — don't paste all four at once; each depends on the previous existing.
2. Give the agent the acceptance criteria and test command explicitly — Antigravity's Manager surface tracks tasks by verifiable outcome, so a vague "make it agentic" prompt will underperform a concrete spec.
3. Let it run, then review the artifact/diff it produces before accepting — don't rubber-stamp; you need to understand the code for the "genuine agentic usage" and originality checks the hackathon rubric asks for.
4. Once Task 1–2 are solid, dispatch Task 3 (frontend) as a separate parallel task if you want to save time — different files, minimal overlap.
5. Keep commits granular per task — the rubric explicitly checks GitHub commit history for originality/process, and a clean incremental history helps prove genuine iterative building rather than one dumped commit.

---

## 6. Demo Video Script (3 min max)

1. (0:00–0:20) One-line problem statement: "Job seekers get generic AI resume advice. This agent actually plans and executes a tailored application."
2. (0:20–1:00) Upload resume + paste JD → show the **Plan Object rendering live** in the activity log. Narrate: "the agent decided it needs to score fit first, then branch into three parallel improvements."
3. (1:00–2:00) Show steps completing, including one `retry` from the self-review pass — this is your strongest "genuine agentic usage" beat, make sure it's in frame.
4. (2:00–2:40) Show the final summary report + cover letter + interview questions.
5. (2:40–3:00) Quick repo/architecture flash, close on deployed link.
