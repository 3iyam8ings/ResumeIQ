package com.example.demo.dto;

import java.util.Map;

/**
 * Request payload for POST /api/iqtest/summary.
 * Carries the computed IQ test result (score, percentile, per-category
 * breakdown)
 * needed to generate a personalized cognitive profile summary.
 */
public class IqTestRequest {

    /* ------------------------------------------------------------------ */
    /* Validation bounds */
    /* ------------------------------------------------------------------ */
    private static final int MIN_IQ_SCORE = 0;
    private static final int MAX_IQ_SCORE = 200;
    private static final int MIN_PERCENTILE = 0;
    private static final int MAX_PERCENTILE = 100;
    private static final int MIN_CATEGORY_SCORE = 0;
    private static final int MAX_CATEGORY_SCORE = 5; // category scores are computed out of 5 (see IqTestService prompt)

    /* ------------------------------------------------------------------ */
    /* Fields */
    /* ------------------------------------------------------------------ */
    private int iqScore;
    private int percentile;
    private Map<String, Integer> categories;

    /* ------------------------------------------------------------------ */
    /* Constructors */
    /* ------------------------------------------------------------------ */
    public IqTestRequest() {
    }

    /* ------------------------------------------------------------------ */
    /* Getters / Setters */
    /* ------------------------------------------------------------------ */
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

    /* ------------------------------------------------------------------ */
    /* Validation */
    /* ------------------------------------------------------------------ */

    /**
     * Manually validates the input bounds to ensure they are safe for prompt
     * generation.
     */
    public boolean isValid() {
        if (iqScore < MIN_IQ_SCORE || iqScore > MAX_IQ_SCORE)
            return false;
        if (percentile < MIN_PERCENTILE || percentile > MAX_PERCENTILE)
            return false;
        if (categories == null || categories.isEmpty())
            return false;

        for (Integer score : categories.values()) {
            if (score == null || score < MIN_CATEGORY_SCORE || score > MAX_CATEGORY_SCORE)
                return false;
        }

        return true;
    }
}