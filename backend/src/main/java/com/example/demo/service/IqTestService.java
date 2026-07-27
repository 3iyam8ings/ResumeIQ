package com.example.demo.service;

import com.example.demo.dto.IqTestRequest;
import dev.langchain4j.model.chat.ChatLanguageModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Generates a short, personalized cognitive profile summary for a completed IQ
 * test,
 * using the configured Gemini chat model via LangChain4j.
 *
 * Falls back to a generic summary if the model call fails for any reason, so
 * the
 * frontend always receives a usable string.
 */
@Service
public class IqTestService {

    private static final Logger logger = LoggerFactory.getLogger(IqTestService.class);

    /* ------------------------------------------------------------------ */
    /* Config */
    /* ------------------------------------------------------------------ */
    private static final String FALLBACK_SUMMARY = "Cognitive profile suggests strong abstract reasoning skills.";

    private static final String PROMPT_TEMPLATE = "Based on an IQ test score of %d (Percentile: %d%%), with category scores out of 5: "
            +
            "Logical (%d), Numerical (%d), Verbal (%d), Spatial (%d), " +
            "generate a short, professional, 2-line personalized cognitive profile summary.";

    /* ------------------------------------------------------------------ */
    /* Dependencies */
    /* ------------------------------------------------------------------ */
    private final ChatLanguageModel chatLanguageModel;

    @Autowired
    public IqTestService(ChatLanguageModel chatLanguageModel) {
        this.chatLanguageModel = chatLanguageModel;
    }

    /* ------------------------------------------------------------------ */
    /* Public API */
    /* ------------------------------------------------------------------ */

    /**
     * Generates a personalized cognitive profile summary for the given test result.
     * Returns {@link #FALLBACK_SUMMARY} if the model call fails or returns an empty
     * response.
     */
    public String generateSummary(IqTestRequest request) {
        try {
            String prompt = buildPrompt(request);
            String response = chatLanguageModel.generate(prompt);

            if (response != null && !response.trim().isEmpty()) {
                return response.trim();
            }
        } catch (Exception e) {
            logger.error("Error generating IQ test summary from Gemini", e);
        }

        return FALLBACK_SUMMARY;
    }

    /* ------------------------------------------------------------------ */
    /* Internal helpers */
    /* ------------------------------------------------------------------ */

    private String buildPrompt(IqTestRequest request) {
        return String.format(
                PROMPT_TEMPLATE,
                request.getIqScore(),
                request.getPercentile(),
                request.getCategories().getOrDefault("Logical", 0),
                request.getCategories().getOrDefault("Numerical", 0),
                request.getCategories().getOrDefault("Verbal", 0),
                request.getCategories().getOrDefault("Spatial", 0));
    }
}