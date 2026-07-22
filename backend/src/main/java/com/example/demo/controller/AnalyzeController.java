package com.example.demo.controller;

import com.example.demo.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AnalyzeController {

    private final AiService aiService;

    @Autowired
    public AnalyzeController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<String> analyzeResumeStub() {
        // Hardcoded stub for Sprint 0 verification
        String result = aiService.analyzeResume("Stubbed resume text", "Stubbed job description");
        return ResponseEntity.ok(result);
    }
}
