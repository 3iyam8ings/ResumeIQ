package com.example.demo.service;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Service;
import java.io.IOException;

@Service
public class PortfolioService {

    public String extractTextFromUrl(String url) throws IOException {
        // Fetch the HTML document from the URL
        // A timeout of 10 seconds is used, and user-agent is set to mimic a browser
        Document doc = Jsoup.connect(url)
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                .timeout(10000)
                .get();

        // Extract and return plain text, stripping out all HTML tags
        return doc.text();
    }
}
