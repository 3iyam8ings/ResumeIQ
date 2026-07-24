package com.example.demo.service.ai;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.spring.AiService;

import java.util.List;

@AiService
public interface JobAnalyzerAgent {
    @SystemMessage({
        "You are an expert technical recruiter and ATS system.",
        "Your job is to analyze a Job Description and extract the core required skills, tools, and qualifications.",
        "Return EXACTLY and ONLY a single line of comma-separated values.",
        "Do NOT use JSON. Do NOT use bullet points. Do NOT use newlines. Do NOT use conversational text.",
        "Example of valid output: Java, Spring Boot, Docker, PostgreSQL",
        "Limit your response to a maximum of 15 key requirements."
    })
    @UserMessage("Extract the required skills from this job description: \n\n{{jobDescription}}")
    String extractKeywords(@dev.langchain4j.service.V("jobDescription") String jobDescription);

    @SystemMessage({
        "You are an expert recruiter parsing a candidate's resume.",
        "Your task is to identify the candidate's primary job title or role (e.g., 'Software Engineer', 'Data Scientist', 'Marketing Manager').",
        "If they are a student, return something like 'Computer Science Student' or 'Graduating Student'.",
        "Return EXACTLY and ONLY the role title as a short string.",
        "Do NOT use JSON. Do NOT use bullet points. Do NOT include any other text."
    })
    @UserMessage("Resume:\n{{resumeText}}\n\nPlease extract the candidate's primary role or title:")
    String extractCandidateRole(@dev.langchain4j.service.V("resumeText") String resumeText);

    @SystemMessage({
        "You are a brutally honest senior recruiter and resume expert.",
        "Your ONLY task is to find the single weakest, most vague, and least impactful bullet point or sentence in this resume.",
        "A weak bullet point: uses passive voice, has no quantified results, is generic ('Responsible for...', 'Helped with...', 'Worked on...'), is very short, or says nothing specific.",
        "DO NOT pick the candidate's name, contact info, education header, a section title, or a skills list.",
        "You MUST pick a full sentence or bullet that came from the Experience or Projects section.",
        "Return EXACTLY and ONLY the original weak bullet point text, verbatim as it appears in the resume.",
        "Do NOT add quotes. Do NOT add commentary. Do NOT rewrite it. Just return the exact text."
    })
    @UserMessage("Resume:\n{{resumeText}}\n\nIdentify the single weakest bullet point or experience sentence:")
    String findWeakestBulletPoint(@dev.langchain4j.service.V("resumeText") String resumeText);

    @SystemMessage({
        "You are a world-class resume writer who has helped candidates land offers at FAANG, top startups, and Fortune 500 companies.",
        "Your task is to rewrite a weak resume bullet point into a powerful, results-driven statement that will impress hiring managers.",
        "Follow these rules STRICTLY:",
        "1. Use a strong, active verb at the start (e.g., Architected, Spearheaded, Engineered, Delivered, Reduced, Increased).",
        "2. Apply the XYZ formula where possible: Accomplished [X] by doing [Y], resulting in [Z].",
        "3. If the candidate mentioned any numbers, tools, or technologies, keep them — do NOT drop or change real facts.",
        "4. CRITICAL: Do NOT invent fake metrics (e.g., do not say '40% improvement' if the original did not mention it).",
        "5. If no metrics exist, make the impact clear through scope and specificity (e.g., 'across 3 production services', 'used by 500+ users').",
        "6. Use keywords from the job description naturally if they fit.",
        "7. Keep it to ONE punchy sentence, maximum 30 words.",
        "8. Return ONLY the rewritten bullet. No commentary, no quotes, no formatting."
    })
    @UserMessage("Job Description context:\n{{jobDescription}}\n\nOriginal Weak Bullet:\n{{bulletPoint}}\n\nRewrite this into a powerful, impactful resume bullet:")
    String rewriteBulletPoint(@dev.langchain4j.service.V("bulletPoint") String bulletPoint, @dev.langchain4j.service.V("jobDescription") String jobDescription);

    @SystemMessage({
        "You are an expert career coach writing a highly personalized, authentic cover letter.",
        "CRITICAL RULES:",
        "1. Do not use generic filler words like 'delighted to apply' or 'as a highly motivated individual'. Write like a real, competent human being.",
        "2. Be concise, direct, and confident.",
        "3. Connect exactly 2-3 specific achievements from the provided resume to the core needs of the provided job description.",
        "4. Do NOT invent or fabricate any experiences. Only use facts from the provided resume.",
        "5. Return ONLY the plain text of the cover letter. Do not include markdown formatting or placeholder brackets like [Your Name] unless you genuinely cannot find the name in the resume.",
        "6. Write the cover letter using a {{tone}} tone.",
        "7. Ensure the cover letter focuses heavily on this specific area, if provided: {{focus}}",
        "8. Structure the letter into three distinct parts: a strong Hook, Evidence (2-3 achievements), and a concise Call to Action."
    })
    @UserMessage("Resume:\n{{resumeText}}\n\nJob Description:\n{{jobDescription}}\n\nTone: {{tone}}\nFocus Area: {{focus}}\n\nPlease write the cover letter:")
    String generateCoverLetter(@dev.langchain4j.service.V("resumeText") String resumeText, 
                               @dev.langchain4j.service.V("jobDescription") String jobDescription,
                               @dev.langchain4j.service.V("tone") String tone,
                               @dev.langchain4j.service.V("focus") String focus);

    @SystemMessage({
        "You are an expert hiring manager conducting a technical and behavioral interview.",
        "Based on the provided Resume and Job Description, generate exactly ONE challenging and highly specific interview question.",
        "Do NOT ask generic questions like 'What is your greatest weakness?' or 'Tell me about yourself.'",
        "The question should force the candidate to explain a specific technology, project, or leadership scenario mentioned in their resume as it relates to the target job.",
        "Return ONLY the question text. No conversational filler."
    })
    @UserMessage("Resume:\n{{resumeText}}\n\nJob Description:\n{{jobDescription}}\n\nGenerate ONE specific interview question:")
    String generateInterviewQuestion(@dev.langchain4j.service.V("resumeText") String resumeText, 
                                     @dev.langchain4j.service.V("jobDescription") String jobDescription);

    @SystemMessage({
        "You are an expert technical interviewer providing specific, actionable feedback.",
        "You asked the candidate a question based on their resume and the job description.",
        "Evaluate their provided answer.",
        "Provide constructive feedback. If the answer is weak, explain exactly what is missing (e.g., 'You didn't mention the specific database used' or 'Use the STAR method').",
        "Do not just say 'Good answer, keep practicing'. Give 1-2 paragraphs of sharp, actionable advice.",
        "Return ONLY the feedback."
    })
    @UserMessage("Resume:\n{{resumeText}}\n\nJob Description:\n{{jobDescription}}\n\nQuestion Asked:\n{{question}}\n\nCandidate's Answer:\n{{answer}}\n\nPlease provide feedback on the answer:")
    String provideInterviewFeedback(@dev.langchain4j.service.V("resumeText") String resumeText, 
                                    @dev.langchain4j.service.V("jobDescription") String jobDescription,
                                    @dev.langchain4j.service.V("question") String question,
                                    @dev.langchain4j.service.V("answer") String answer);

    @SystemMessage({
        "You are an expert technical recruiter analyzing a candidate's portfolio or GitHub page.",
        "Compare their portfolio contents to their resume and the target job description.",
        "Identify exactly what is missing from their portfolio, or what they should highlight better to land this specific job.",
        "Provide 2-3 specific, actionable suggestions. Do NOT give generic advice.",
        "Return ONLY the feedback as plain text."
    })
    @UserMessage("Resume:\n{{resumeText}}\n\nJob Description:\n{{jobDescription}}\n\nPortfolio Contents:\n{{portfolioText}}\n\nPlease provide portfolio feedback:")
    String analyzePortfolio(@dev.langchain4j.service.V("resumeText") String resumeText,
                            @dev.langchain4j.service.V("jobDescription") String jobDescription,
                            @dev.langchain4j.service.V("portfolioText") String portfolioText);

    @SystemMessage({
        "You are an expert career coach helping a candidate bridge the gap between their current skills (Resume) and their target job (Job Description).",
        "Generate a step-by-step roadmap for them to acquire the missing skills.",
        "Focus ONLY on the missing skills, tools, or experiences. Be specific (e.g., 'Learn React Hooks' instead of 'Learn Frontend').",
        "Format the roadmap clearly with step numbers.",
        "Return ONLY the roadmap as plain text."
    })
    @UserMessage("Resume:\n{{resumeText}}\n\nJob Description:\n{{jobDescription}}\n\nPlease generate a skill-gap roadmap:")
    String generateSkillGapRoadmap(@dev.langchain4j.service.V("resumeText") String resumeText,
                                   @dev.langchain4j.service.V("jobDescription") String jobDescription);
}
