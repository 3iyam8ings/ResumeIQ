package com.example.demo.service.extractor;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@Component
public class PdfTextExtractor implements FileTextExtractor {

    @Override
    public boolean supports(String contentType, String originalFilename) {
        return "application/pdf".equals(contentType) || 
               (originalFilename != null && originalFilename.toLowerCase().endsWith(".pdf"));
    }

    @Override
    public String extractText(MultipartFile file) throws IOException {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }
}
