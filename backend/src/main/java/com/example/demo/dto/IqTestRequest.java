package com.example.demo.dto;

import java.util.Map;

public class IqTestRequest {
    private int iqScore;
    private int percentile;
    private Map<String, Integer> categories;

    public IqTestRequest() {}

    public int getIqScore() {
        return iqScore;
    }

    public void setIqScore(int iqScore) {
        this.iqScore = iqScore;
    }

    public int getPercentile() {
        return percentile;
    }

    public void setPercentile(int percentile) {
        this.percentile = percentile;
    }

    public Map<String, Integer> getCategories() {
        return categories;
    }

    public void setCategories(Map<String, Integer> categories) {
        this.categories = categories;
    }

    /**
     * Manually validates the input bounds to ensure they are safe for prompt generation.
     */
    public boolean isValid() {
        if (iqScore < 0 || iqScore > 200) return false;
        if (percentile < 0 || percentile > 100) return false;
        if (categories == null || categories.isEmpty()) return false;
        
        for (Integer score : categories.values()) {
            if (score == null || score < 0 || score > 10) return false; // assuming max 10 for safety
        }
        
        return true;
    }
}
