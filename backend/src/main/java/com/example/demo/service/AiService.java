package com.example.demo.service;

public interface AiService {
    /**
     * Analyzes the given resume text, optionally comparing it against a job description.
     * 
     * @param resumeText The extracted text from the resume
     * @param jobDescription The target job description (can be null/empty)
     * @return A structured analysis result in JSON string format
     */
    String analyzeResume(String resumeText, String jobDescription);
}
