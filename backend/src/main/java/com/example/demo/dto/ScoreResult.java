package com.example.demo.dto;

import java.util.List;

public class ScoreResult {
    private int matchPercentage;
    private List<String> matchedSkills;
    private List<String> missingSkills;

    public ScoreResult() {
    }

    public ScoreResult(int matchPercentage, List<String> matchedSkills, List<String> missingSkills) {
        this.matchPercentage = matchPercentage;
        this.matchedSkills = matchedSkills;
        this.missingSkills = missingSkills;
    }

    public int getMatchPercentage() {
        return matchPercentage;
    }

    public void setMatchPercentage(int matchPercentage) {
        this.matchPercentage = matchPercentage;
    }

    public List<String> getMatchedSkills() {
        return matchedSkills;
    }

    public void setMatchedSkills(List<String> matchedSkills) {
        this.matchedSkills = matchedSkills;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }
}
