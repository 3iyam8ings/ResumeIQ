package com.example.demo.service;

import com.example.demo.dto.ScoreFactor;
import com.example.demo.dto.ScoreResult;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ResumeScoringService {

    public ScoreResult scoreResume(String rawResumeText, List<String> requiredSkills) {
        if (requiredSkills == null || requiredSkills.isEmpty()) {
            return new ScoreResult(0, new ArrayList<>(), new ArrayList<>());
        }

        List<String> matchedSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();
        List<ScoreFactor> breakdown = new ArrayList<>();

        String lowerCaseResume = rawResumeText != null ? rawResumeText.toLowerCase() : "";

        for (String skill : requiredSkills) {
            if (skill == null || skill.trim().isEmpty()) continue;
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

        // Build scoring breakdown
        int keywordPoints = matchedSkills.size() * 5;
        breakdown.add(new ScoreFactor("KEYWORD DENSITY", keywordPoints));

        int missingPenalty = missingSkills.size() * -4;
        breakdown.add(new ScoreFactor("MISSING REQUIREMENTS", missingPenalty));

        if (lowerCaseResume.contains("experience") || lowerCaseResume.contains("work history")) {
            breakdown.add(new ScoreFactor("EXPERIENCE SECTION", +15));
        } else {
            breakdown.add(new ScoreFactor("EXPERIENCE SECTION", -10));
        }

        if (lowerCaseResume.contains("@") && (lowerCaseResume.contains(".com") || lowerCaseResume.contains(".org"))) {
            breakdown.add(new ScoreFactor("CONTACT INFO", +8));
        } else {
            breakdown.add(new ScoreFactor("CONTACT INFO MISSING", -5));
        }

        if (rawResumeText != null && rawResumeText.length() > 800) {
            breakdown.add(new ScoreFactor("CONTENT DEPTH", +10));
        } else {
            breakdown.add(new ScoreFactor("CONTENT TOO BRIEF", -8));
        }

        boolean hasNumbers = rawResumeText != null && rawResumeText.matches(".*\\d+.*");
        if (hasNumbers) {
            breakdown.add(new ScoreFactor("QUANTIFIED ACHIEVEMENTS", +12));
        } else {
            breakdown.add(new ScoreFactor("NO QUANTIFIED RESULTS", -8));
        }

        ScoreResult result = new ScoreResult(score, matchedSkills, missingSkills);
        result.setBreakdown(breakdown);
        result.setWeakBullet(extractWeakBullet(rawResumeText));
        return result;
    }

    public ScoreResult scoreGeneralResumeQuality(String rawResumeText) {
        if (rawResumeText == null || rawResumeText.trim().isEmpty()) {
            return new ScoreResult(0, new ArrayList<>(), new ArrayList<>());
        }

        String lowerCaseResume = rawResumeText.toLowerCase();
        int score = 40;
        List<String> foundFeatures = new ArrayList<>();
        List<String> missingFeatures = new ArrayList<>();
        List<ScoreFactor> breakdown = new ArrayList<>();

        if (lowerCaseResume.contains("education") || lowerCaseResume.contains("university") || lowerCaseResume.contains("college")) {
            score += 15;
            foundFeatures.add("Education Section");
            breakdown.add(new ScoreFactor("EDUCATION SECTION", +15));
        } else {
            missingFeatures.add("Education Section");
            breakdown.add(new ScoreFactor("EDUCATION MISSING", -10));
        }

        if (lowerCaseResume.contains("experience") || lowerCaseResume.contains("work history") || lowerCaseResume.contains("employment")) {
            score += 20;
            foundFeatures.add("Experience Section");
            breakdown.add(new ScoreFactor("EXPERIENCE ALIGNMENT", +20));
        } else {
            missingFeatures.add("Experience Section");
            breakdown.add(new ScoreFactor("EXPERIENCE MISSING", -15));
        }

        if (lowerCaseResume.contains("skills") || lowerCaseResume.contains("technologies")) {
            score += 15;
            foundFeatures.add("Skills Section");
            breakdown.add(new ScoreFactor("SKILLS SECTION", +15));
        } else {
            missingFeatures.add("Skills Section");
            breakdown.add(new ScoreFactor("SKILLS SECTION MISSING", -10));
        }

        if (lowerCaseResume.contains("@") && (lowerCaseResume.contains(".com") || lowerCaseResume.contains(".org") || lowerCaseResume.contains(".net") || lowerCaseResume.contains(".edu"))) {
            score += 5;
            foundFeatures.add("Email Address");
            breakdown.add(new ScoreFactor("CONTACT INFO", +5));
        } else {
            missingFeatures.add("Email Address");
            breakdown.add(new ScoreFactor("CONTACT INFO MISSING", -5));
        }

        if (rawResumeText.length() > 800) {
            score += 5;
            foundFeatures.add("Adequate Content Length");
            breakdown.add(new ScoreFactor("CONTENT DEPTH", +5));
        } else {
            missingFeatures.add("Adequate Content Length");
            breakdown.add(new ScoreFactor("CONTENT TOO BRIEF", -5));
        }

        boolean hasNumbers = rawResumeText.matches("(?s).*\\d+.*");
        if (hasNumbers) {
            breakdown.add(new ScoreFactor("QUANTIFIED ACHIEVEMENTS", +12));
        } else {
            breakdown.add(new ScoreFactor("NO QUANTIFIED RESULTS", -8));
        }

        score = Math.min(score, 100);

        ScoreResult result = new ScoreResult(score, foundFeatures, missingFeatures);
        result.setBreakdown(breakdown);
        result.setWeakBullet(extractWeakBullet(rawResumeText));
        return result;
    }

    /**
     * Extracts a representative "weak" bullet point from the resume text.
     * A weak bullet is a short sentence (10-120 chars) that lacks quantified metrics.
     */
    private String extractWeakBullet(String rawText) {
        if (rawText == null || rawText.isBlank()) return null;

        String[] lines = rawText.split("[\n\r]+");
        String fallback = null;

        for (String line : lines) {
            String trimmed = line.trim();
            // Must look like a bullet/sentence: starts with common bullet markers or is a short sentence
            if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*") || trimmed.startsWith("–")) {
                trimmed = trimmed.substring(1).trim();
            }
            if (trimmed.length() < 15 || trimmed.length() > 130) continue;
            // Skip section headers (all uppercase short words)
            if (trimmed.equals(trimmed.toUpperCase()) && trimmed.split("\\s+").length <= 3) continue;

            // Prefer lines without numbers (those are "weak" — no metrics)
            if (!trimmed.matches(".*\\d+.*")) {
                return "\"" + trimmed + "\"";
            }
            // Save as fallback in case all lines have numbers
            if (fallback == null) fallback = "\"" + trimmed + "\"";
        }

        return fallback;
    }
}
