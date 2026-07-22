package com.example.demo.dto;

public class RewriteRequest {
    private String bulletPoint;
    private String jobDescription;

    public RewriteRequest() {
    }

    public RewriteRequest(String bulletPoint, String jobDescription) {
        this.bulletPoint = bulletPoint;
        this.jobDescription = jobDescription;
    }

    public String getBulletPoint() {
        return bulletPoint;
    }

    public void setBulletPoint(String bulletPoint) {
        this.bulletPoint = bulletPoint;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }
}
