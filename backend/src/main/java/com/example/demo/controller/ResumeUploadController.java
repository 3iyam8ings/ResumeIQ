package com.example.demo.controller;

import com.example.demo.dto.ResumeParseResult;
import com.example.demo.dto.ScoreResult;
import com.example.demo.service.ResumeParserService;
import com.example.demo.service.ResumeScoringService;
import com.example.demo.service.ai.JobAnalyzerAgent;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ResumeUploadController {

    private final ResumeParserService parserService;
    private final JobAnalyzerAgent jobAnalyzerAgent;
    private final ResumeScoringService scoringService;
    private final com.example.demo.service.PortfolioService portfolioService;

    public ResumeUploadController(ResumeParserService parserService, JobAnalyzerAgent jobAnalyzerAgent, ResumeScoringService scoringService, com.example.demo.service.PortfolioService portfolioService) {
        this.parserService = parserService;
        this.jobAnalyzerAgent = jobAnalyzerAgent;
        this.scoringService = scoringService;
        this.portfolioService = portfolioService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "jobDescription", required = false) String jobDescription) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a file to upload.");
        }
        
        try {
            ResumeParseResult result = parserService.parseResume(file);
            
            if (jobDescription != null && !jobDescription.trim().isEmpty()) {
                try {
                    String extractedStr = jobAnalyzerAgent.extractKeywords(jobDescription);
                    java.util.List<String> requiredSkills = java.util.Arrays.asList(extractedStr.replace("[", "").replace("]", "").replace("\"", "").split(","));
                    
                    ScoreResult score = scoringService.scoreResume(result.getRawText(), requiredSkills);
                    result.setScore(score);
                } catch (Exception e) {
                    System.err.println("Failed to analyze job description with AI: " + e.getMessage());
                }
            }
            
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to parse the file due to an IO error.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to parse the file. Ensure it is a valid PDF or DOCX.");
        }
    }
    @PostMapping("/rewrite")
    public ResponseEntity<?> rewriteBulletPoint(@RequestBody com.example.demo.dto.RewriteRequest request) {
        if (request.getBulletPoint() == null || request.getBulletPoint().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Bullet point cannot be empty.");
        }
        
        try {
            String rewritten = jobAnalyzerAgent.rewriteBulletPoint(
                    request.getBulletPoint(), 
                    request.getJobDescription() != null ? request.getJobDescription() : "No specific job description provided."
            );
            return ResponseEntity.ok(new com.example.demo.dto.RewriteResponse(rewritten));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to rewrite bullet point: " + e.getMessage());
        }
    }
    @PostMapping("/cover-letter")
    public ResponseEntity<?> generateCoverLetter(@RequestBody com.example.demo.dto.CoverLetterRequest request) {
        if (request.getResumeText() == null || request.getResumeText().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Resume text cannot be empty.");
        }
        if (request.getJobDescription() == null || request.getJobDescription().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Job description cannot be empty.");
        }
        
        try {
            String tone = request.getTone() != null && !request.getTone().trim().isEmpty() ? request.getTone() : "Professional";
            String focus = request.getFocus() != null && !request.getFocus().trim().isEmpty() ? request.getFocus() : "None";
            String coverLetter = jobAnalyzerAgent.generateCoverLetter(
                    request.getResumeText(), 
                    request.getJobDescription(),
                    tone,
                    focus
            );
            return ResponseEntity.ok(new com.example.demo.dto.CoverLetterResponse(coverLetter));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to generate cover letter: " + e.getMessage());
        }
    }

    @PostMapping("/interview/question")
    public ResponseEntity<?> generateInterviewQuestion(@RequestBody com.example.demo.dto.InterviewQuestionRequest request) {
        if (request.getResumeText() == null || request.getResumeText().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Resume text cannot be empty.");
        }
        if (request.getJobDescription() == null || request.getJobDescription().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Job description cannot be empty.");
        }

        try {
            String question = jobAnalyzerAgent.generateInterviewQuestion(
                    request.getResumeText(),
                    request.getJobDescription()
            );
            return ResponseEntity.ok(new com.example.demo.dto.InterviewQuestionResponse(question));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to generate interview question: " + e.getMessage());
        }
    }

    @PostMapping("/interview/feedback")
    public ResponseEntity<?> provideInterviewFeedback(@RequestBody com.example.demo.dto.InterviewFeedbackRequest request) {
        if (request.getResumeText() == null || request.getResumeText().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Resume text cannot be empty.");
        }
        if (request.getJobDescription() == null || request.getJobDescription().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Job description cannot be empty.");
        }
        if (request.getQuestion() == null || request.getQuestion().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Question cannot be empty.");
        }
        if (request.getAnswer() == null || request.getAnswer().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Answer cannot be empty.");
        }

        try {
            String feedback = jobAnalyzerAgent.provideInterviewFeedback(
                    request.getResumeText(),
                    request.getJobDescription(),
                    request.getQuestion(),
                    request.getAnswer()
            );
            return ResponseEntity.ok(new com.example.demo.dto.InterviewFeedbackResponse(feedback));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to provide interview feedback: " + e.getMessage());
        }
    }

    @PostMapping("/portfolio/analyze")
    public ResponseEntity<?> analyzePortfolio(@RequestBody com.example.demo.dto.PortfolioRequest request) {
        if (request.getResumeText() == null || request.getResumeText().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Resume text cannot be empty.");
        }
        if (request.getJobDescription() == null || request.getJobDescription().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Job description cannot be empty.");
        }
        if (request.getPortfolioUrl() == null || request.getPortfolioUrl().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Portfolio URL cannot be empty.");
        }

        try {
            String portfolioText = portfolioService.extractTextFromUrl(request.getPortfolioUrl());
            String feedback = jobAnalyzerAgent.analyzePortfolio(
                    request.getResumeText(),
                    request.getJobDescription(),
                    portfolioText
            );
            return ResponseEntity.ok(new com.example.demo.dto.PortfolioResponse(feedback));
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Failed to fetch or read the portfolio URL. Please ensure it is a valid, publicly accessible URL.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to analyze portfolio: " + e.getMessage());
        }
    }

    @PostMapping("/roadmap/generate")
    public ResponseEntity<?> generateSkillGapRoadmap(@RequestBody com.example.demo.dto.RoadmapRequest request) {
        if (request.getResumeText() == null || request.getResumeText().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Resume text cannot be empty.");
        }
        if (request.getJobDescription() == null || request.getJobDescription().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Job description cannot be empty.");
        }

        try {
            String roadmap = jobAnalyzerAgent.generateSkillGapRoadmap(
                    request.getResumeText(),
                    request.getJobDescription()
            );
            return ResponseEntity.ok(new com.example.demo.dto.RoadmapResponse(roadmap));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to generate skill-gap roadmap: " + e.getMessage());
        }
    }
}
