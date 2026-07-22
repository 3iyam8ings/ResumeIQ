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
}
