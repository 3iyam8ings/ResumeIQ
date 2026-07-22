package com.example.demo.service;

import com.example.demo.dto.ResumeParseResult;
import com.example.demo.service.extractor.FileTextExtractor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ResumeParserService {
    
    private final List<FileTextExtractor> extractors;

    public ResumeParserService(List<FileTextExtractor> extractors) {
        this.extractors = extractors;
    }

    public ResumeParseResult parseResume(MultipartFile file) throws IOException {
        String contentType = file.getContentType();
        String originalFilename = file.getOriginalFilename();
        
        FileTextExtractor extractor = extractors.stream()
            .filter(e -> e.supports(contentType, originalFilename))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Unsupported file type: " + originalFilename));
            
        String rawText = extractor.extractText(file);
        
        return buildResult(rawText);
    }
    
    private ResumeParseResult buildResult(String rawText) {
        ResumeParseResult result = new ResumeParseResult();
        result.setRawText(rawText);
        
        String normalizedText = rawText.replaceAll("\\r\\n", "\n");
        
        String contactInfo = extractSection(normalizedText, "(?i)(contact|profile|about me|summary)", "(?i)(experience|employment|work history|education|skills|projects|certifications)");
        if (contactInfo == null) {
            // Fallback: If no explicit 'Contact' header is found, assume contact info is at the very top of the resume.
            Matcher firstHeading = Pattern.compile("(?i)^(experience|employment|work history|education|skills|projects|certifications)", Pattern.MULTILINE).matcher(normalizedText);
            if (firstHeading.find()) {
                contactInfo = normalizedText.substring(0, firstHeading.start()).trim();
            } else {
                contactInfo = normalizedText.substring(0, Math.min(normalizedText.length(), 300)).trim();
            }
        }
        result.setContactInfo(contactInfo);
        
        // Added "projects" to experience fallback since many students use Projects instead of Work Experience
        result.setExperience(extractSection(normalizedText, "(?i)(experience|employment|work history|projects)", "(?i)(education|skills|certifications|achievements)"));
        result.setEducation(extractSection(normalizedText, "(?i)(education|academic)", "(?i)(skills|projects|certifications|experience|employment)"));
        result.setSkills(extractSection(normalizedText, "(?i)(skills|technologies|tools)", "(?i)(education|projects|certifications|experience|employment|achievements)"));
        
        return result;
    }
    
    private String extractSection(String text, String startRegex, String endRegex) {
        Pattern startPattern = Pattern.compile("^\\s*" + startRegex + ".*$", Pattern.MULTILINE);
        Matcher startMatcher = startPattern.matcher(text);
        
        if (!startMatcher.find()) {
            return null;
        }
        
        int startIndex = startMatcher.end();
        
        Pattern endPattern = Pattern.compile("^\\s*" + endRegex + ".*$", Pattern.MULTILINE);
        Matcher endMatcher = endPattern.matcher(text);
        
        int endIndex = text.length();
        while (endMatcher.find()) {
            if (endMatcher.start() > startIndex) {
                endIndex = endMatcher.start();
                break;
            }
        }
        
        String extracted = text.substring(startIndex, endIndex).trim();
        return extracted.isEmpty() ? null : extracted;
    }
}
