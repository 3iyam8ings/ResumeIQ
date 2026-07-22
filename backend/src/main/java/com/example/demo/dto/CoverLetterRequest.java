package com.example.demo.dto;

public class CoverLetterRequest {
    private String resumeText;
    private String jobDescription;

    private String tone;
    private String focus;

    public CoverLetterRequest() {
    }

    public CoverLetterRequest(String resumeText, String jobDescription, String tone, String focus) {
        this.resumeText = resumeText;
        this.jobDescription = jobDescription;
        this.tone = tone;
        this.focus = focus;
    }

    public String getResumeText() {
        return resumeText;
    }

    public void setResumeText(String resumeText) {
        this.resumeText = resumeText;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }

    public String getTone() {
        return tone;
    }

    public void setTone(String tone) {
        this.tone = tone;
    }

    public String getFocus() {
        return focus;
    }

    public void setFocus(String focus) {
        this.focus = focus;
    }
}
