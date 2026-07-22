package com.example.demo.service.extractor;

import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@Component
public class DocxTextExtractor implements FileTextExtractor {

    @Override
    public boolean supports(String contentType, String originalFilename) {
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document".equals(contentType) || 
               (originalFilename != null && originalFilename.toLowerCase().endsWith(".docx"));
    }

    @Override
    public String extractText(MultipartFile file) throws IOException {
        try (XWPFDocument doc = new XWPFDocument(file.getInputStream());
             XWPFWordExtractor extractor = new XWPFWordExtractor(doc)) {
            return extractor.getText();
        }
    }
}
