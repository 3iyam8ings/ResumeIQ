package com.example.demo.dto;

public class InterviewFeedbackResponse {
    private String feedback;

    public InterviewFeedbackResponse() {}

    public InterviewFeedbackResponse(String feedback) {
        this.feedback = feedback;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
}
