package com.example.demo.service;

import com.example.demo.dto.ResumeParseResult;
import com.example.demo.service.extractor.FileTextExtractor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ResumeParserServiceTest {

    private ResumeParserService parserService;

    @BeforeEach
    void setUp() {
        FileTextExtractor mockExtractor = new FileTextExtractor() {
            @Override
            public boolean supports(String contentType, String filename) {
                return true;
            }

            @Override
            public String extractText(org.springframework.web.multipart.MultipartFile file) throws IOException {
                return new String(file.getBytes());
            }
        };

        parserService = new ResumeParserService(Collections.singletonList(mockExtractor));
    }

    @Test
    void testParseResumeWithExplicitHeaders() throws IOException {
        String rawText = "Contact\n" +
                "john.doe@example.com | 555-1234\n" +
                "Experience\n" +
                "Software Engineer at Tech Corp\n" +
                "Education\n" +
                "B.S. Computer Science\n" +
                "Skills\n" +
                "Java, Spring, React";
        
        MockMultipartFile mockFile = new MockMultipartFile("file", "resume.txt", "text/plain", rawText.getBytes());
        
        ResumeParseResult result = parserService.parseResume(mockFile);
        
        assertEquals(rawText, result.getRawText());
        assertEquals("john.doe@example.com | 555-1234", result.getContactInfo());
        assertEquals("Software Engineer at Tech Corp", result.getExperience());
        assertEquals("B.S. Computer Science", result.getEducation());
        assertEquals("Java, Spring, React", result.getSkills());
    }

    @Test
    void testParseResumeWithoutContactHeader() throws IOException {
        String rawText = "Jane Doe\n" +
                "jane@example.com\n" +
                "Projects\n" +
                "Built an AI Resume Analyzer\n" +
                "Education\n" +
                "M.S. Data Science\n" +
                "Skills\n" +
                "Python, ML";
        
        MockMultipartFile mockFile = new MockMultipartFile("file", "resume.txt", "text/plain", rawText.getBytes());
        
        ResumeParseResult result = parserService.parseResume(mockFile);
        
        assertEquals("Jane Doe\njane@example.com", result.getContactInfo());
        assertEquals("Built an AI Resume Analyzer", result.getExperience());
        assertEquals("M.S. Data Science", result.getEducation());
        assertEquals("Python, ML", result.getSkills());
    }
}
