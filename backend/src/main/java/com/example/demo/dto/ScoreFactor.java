package com.example.demo.dto;

public class ScoreFactor {
    private String factorName;
    private int pointValue;

    public ScoreFactor() {}

    public ScoreFactor(String factorName, int pointValue) {
        this.factorName = factorName;
        this.pointValue = pointValue;
    }

    public String getFactorName() { return factorName; }
    public void setFactorName(String factorName) { this.factorName = factorName; }

    public int getPointValue() { return pointValue; }
    public void setPointValue(int pointValue) { this.pointValue = pointValue; }
}
