package com.example.demo.service;

import com.example.demo.dto.ScoreResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ResumeScoringServiceTest {

    private ResumeScoringService scoringService;

    @BeforeEach
    void setUp() {
        scoringService = new ResumeScoringService();
    }

    @Test
    void testEmptyRequiredSkills() {
        ScoreResult result = scoringService.scoreResume("Some resume text", Collections.emptyList());
        assertEquals(0, result.getMatchPercentage());
        assertTrue(result.getMatchedSkills().isEmpty());
        assertTrue(result.getMissingSkills().isEmpty());
    }

    @Test
    void testNullRequiredSkills() {
        ScoreResult result = scoringService.scoreResume("Some resume text", null);
        assertEquals(0, result.getMatchPercentage());
        assertTrue(result.getMatchedSkills().isEmpty());
        assertTrue(result.getMissingSkills().isEmpty());
    }

    @Test
    void testNullResumeText() {
        List<String> required = Arrays.asList("Java", "Spring");
        ScoreResult result = scoringService.scoreResume(null, required);
        assertEquals(0, result.getMatchPercentage());
        assertTrue(result.getMatchedSkills().isEmpty());
        assertEquals(2, result.getMissingSkills().size());
        assertTrue(result.getMissingSkills().containsAll(required));
    }

    @Test
    void testPerfectMatch() {
        String resume = "I am a Java and Spring Boot developer with PostgreSQL experience.";
        List<String> required = Arrays.asList("Java", "Spring Boot", "PostgreSQL");
        
        ScoreResult result = scoringService.scoreResume(resume, required);
        
        assertEquals(100, result.getMatchPercentage());
        assertEquals(3, result.getMatchedSkills().size());
        assertTrue(result.getMissingSkills().isEmpty());
        assertTrue(result.getMatchedSkills().containsAll(required));
    }

    @Test
    void testPartialMatchAndCaseInsensitive() {
        String resume = "Skilled in JAVA, spring boot, and AWS.";
        List<String> required = Arrays.asList("java", "Spring Boot", "Docker", "AWS");
        
        ScoreResult result = scoringService.scoreResume(resume, required);
        
        assertEquals(75, result.getMatchPercentage()); // 3 out of 4 is 75%
        assertEquals(3, result.getMatchedSkills().size());
        assertEquals(1, result.getMissingSkills().size());
        assertTrue(result.getMatchedSkills().containsAll(Arrays.asList("java", "Spring Boot", "AWS")));
        assertTrue(result.getMissingSkills().contains("Docker"));
    }

    @Test
    void testBlankSkillsIgnored() {
        String resume = "Java developer";
        List<String> required = Arrays.asList("Java", "", "  ", null);
        
        ScoreResult result = scoringService.scoreResume(resume, required);
        
        assertEquals(100, result.getMatchPercentage()); // Only "Java" is valid
        assertEquals(1, result.getMatchedSkills().size());
        assertTrue(result.getMissingSkills().isEmpty());
    }
}
