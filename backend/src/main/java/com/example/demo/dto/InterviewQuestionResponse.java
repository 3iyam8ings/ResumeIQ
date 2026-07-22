package com.example.demo.dto;

public class InterviewQuestionResponse {
    private String question;

    public InterviewQuestionResponse() {}

    public InterviewQuestionResponse(String question) {
        this.question = question;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }
}
