package com.example.demo.service;

import com.example.demo.dto.IqTestRequest;
import dev.langchain4j.model.chat.ChatLanguageModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class IqTestService {
    private static final Logger logger = LoggerFactory.getLogger(IqTestService.class);

    private final ChatLanguageModel chatLanguageModel;
    private static final String FALLBACK_SUMMARY = "Cognitive profile suggests strong abstract reasoning skills.";

    @Autowired
    public IqTestService(ChatLanguageModel chatLanguageModel) {
        this.chatLanguageModel = chatLanguageModel;
    }

    public String generateSummary(IqTestRequest request) {
        try {
            String prompt = String.format(
                    "Based on an IQ test score of %d (Percentile: %d%%), with category scores out of 5: " +
                            "Logical (%d), Numerical (%d), Verbal (%d), Spatial (%d), " +
                            "generate a short, professional, 2-line personalized cognitive profile summary.",
                    request.getIqScore(),
                    request.getPercentile(),
                    request.getCategories().getOrDefault("Logical", 0),
                    request.getCategories().getOrDefault("Numerical", 0),
                    request.getCategories().getOrDefault("Verbal", 0),
                    request.getCategories().getOrDefault("Spatial", 0));

            String response = chatLanguageModel.generate(prompt);
            if (response != null && !response.trim().isEmpty()) {
                return response.trim();
            }
        } catch (Exception e) {
            logger.error("Error generating IQ test summary from Gemini", e);
        }

        return FALLBACK_SUMMARY;
    }
}
