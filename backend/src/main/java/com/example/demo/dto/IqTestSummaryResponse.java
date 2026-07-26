package com.example.demo.dto;

public class IqTestSummaryResponse {
    private String summary;

    public IqTestSummaryResponse() {}

    public IqTestSummaryResponse(String summary) {
        this.summary = summary;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }
}
