package com.example.demo.dto;

public class InterviewFeedbackRequest {
    private String resumeText;
    private String jobDescription;
    private String question;
    private String answer;

    public InterviewFeedbackRequest() {}

    public InterviewFeedbackRequest(String resumeText, String jobDescription, String question, String answer) {
        this.resumeText = resumeText;
        this.jobDescription = jobDescription;
        this.question = question;
        this.answer = answer;
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

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }
}
