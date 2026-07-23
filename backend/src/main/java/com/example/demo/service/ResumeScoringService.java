package com.example.demo.service;

import com.example.demo.dto.ScoreResult;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ResumeScoringService {

    public ScoreResult scoreResume(String rawResumeText, List<String> requiredSkills) {
        if (requiredSkills == null || requiredSkills.isEmpty()) {
            return new ScoreResult(0, new ArrayList<>(), new ArrayList<>());
        }

        List<String> matchedSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();
        
        String lowerCaseResume = rawResumeText != null ? rawResumeText.toLowerCase() : "";

        for (String skill : requiredSkills) {
            if (skill == null || skill.trim().isEmpty()) {
                continue;
            }
            String trimmedSkill = skill.trim();
            if (lowerCaseResume.contains(trimmedSkill.toLowerCase())) {
                matchedSkills.add(trimmedSkill);
            } else {
                missingSkills.add(trimmedSkill);
            }
        }

        int totalValidSkills = matchedSkills.size() + missingSkills.size();
        double matchPercentage = totalValidSkills == 0 ? 0 : ((double) matchedSkills.size() / totalValidSkills) * 100;
        int score = (int) Math.round(matchPercentage);

        return new ScoreResult(score, matchedSkills, missingSkills);
    }

    public ScoreResult scoreGeneralResumeQuality(String rawResumeText) {
        if (rawResumeText == null || rawResumeText.trim().isEmpty()) {
            return new ScoreResult(0, new ArrayList<>(), new ArrayList<>());
        }

        String lowerCaseResume = rawResumeText.toLowerCase();
        int score = 40; // Base score
        List<String> foundFeatures = new ArrayList<>();
        List<String> missingFeatures = new ArrayList<>();

        // Check for sections
        if (lowerCaseResume.contains("education") || lowerCaseResume.contains("university") || lowerCaseResume.contains("college")) {
            score += 15;
            foundFeatures.add("Education Section");
        } else {
            missingFeatures.add("Education Section");
        }
        
        if (lowerCaseResume.contains("experience") || lowerCaseResume.contains("work history") || lowerCaseResume.contains("employment")) {
            score += 20;
            foundFeatures.add("Experience Section");
        } else {
            missingFeatures.add("Experience Section");
        }
        
        if (lowerCaseResume.contains("skills") || lowerCaseResume.contains("technologies")) {
            score += 15;
            foundFeatures.add("Skills Section");
        } else {
            missingFeatures.add("Skills Section");
        }

        // Contact info checks
        if (lowerCaseResume.contains("@") && (lowerCaseResume.contains(".com") || lowerCaseResume.contains(".org") || lowerCaseResume.contains(".net") || lowerCaseResume.contains(".edu"))) {
            score += 5;
            foundFeatures.add("Email Address");
        } else {
            missingFeatures.add("Email Address");
        }

        // Length check
        if (rawResumeText.length() > 800) {
            score += 5;
            foundFeatures.add("Adequate Content Length");
        } else {
            missingFeatures.add("Adequate Content Length");
        }

        score = Math.min(score, 100);

        return new ScoreResult(score, foundFeatures, missingFeatures);
    }
}
