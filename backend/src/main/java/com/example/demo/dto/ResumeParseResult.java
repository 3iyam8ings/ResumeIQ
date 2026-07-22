package com.example.demo.dto;

import java.util.List;

public class ResumeParseResult {
    private String contactInfo;
    private String experience;
    private String education;
    private String skills;
    private String rawText;
    private ScoreResult score;
    private String role;

    // Getters and Setters
    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getRawText() { return rawText; }
    public void setRawText(String rawText) { this.rawText = rawText; }
    
    public ScoreResult getScore() { return score; }
    public void setScore(ScoreResult score) { this.score = score; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
