package com.example.demo.dto;

public class PortfolioResponse {
    private String feedback;

    public PortfolioResponse() {}

    public PortfolioResponse(String feedback) {
        this.feedback = feedback;
    }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
}
