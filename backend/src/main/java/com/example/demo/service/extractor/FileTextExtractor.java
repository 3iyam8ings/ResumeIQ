package com.example.demo.service.extractor;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface FileTextExtractor {
    String extractText(MultipartFile file) throws IOException;
    boolean supports(String contentType, String originalFilename);
}
