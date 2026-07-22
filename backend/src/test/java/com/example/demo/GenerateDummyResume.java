package com.example.demo;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;

import java.io.IOException;

public class GenerateDummyResume {
    public static void main(String[] args) {
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 16);
                contentStream.setLeading(14.5f);
                contentStream.newLineAtOffset(50, 700);
                
                contentStream.showText("John Doe");
                contentStream.newLine();
                contentStream.setFont(PDType1Font.HELVETICA, 12);
                contentStream.showText("john.doe@example.com | (555) 123-4567 | github.com/johndoe");
                contentStream.newLine();
                contentStream.newLine();
                
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 14);
                contentStream.showText("Summary");
                contentStream.newLine();
                contentStream.setFont(PDType1Font.HELVETICA, 12);
                contentStream.showText("Experienced software engineer with a passion for clean code.");
                contentStream.newLine();
                contentStream.newLine();
                
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 14);
                contentStream.showText("Experience");
                contentStream.newLine();
                contentStream.setFont(PDType1Font.HELVETICA, 12);
                contentStream.showText("Senior Developer at Tech Corp (2020 - Present)");
                contentStream.newLine();
                contentStream.showText("- Built scalable microservices using Java and Spring Boot.");
                contentStream.newLine();
                contentStream.showText("- Reduced API latency by 40%.");
                contentStream.newLine();
                contentStream.newLine();
                
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 14);
                contentStream.showText("Education");
                contentStream.newLine();
                contentStream.setFont(PDType1Font.HELVETICA, 12);
                contentStream.showText("B.S. in Computer Science, University of Technology (2016 - 2020)");
                contentStream.newLine();
                contentStream.newLine();
                
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 14);
                contentStream.showText("Skills");
                contentStream.newLine();
                contentStream.setFont(PDType1Font.HELVETICA, 12);
                contentStream.showText("Java, Spring Boot, React, PostgreSQL, Docker, AWS");
                
                contentStream.endText();
            }

            document.save("sample_resume.pdf");
            System.out.println("sample_resume.pdf created successfully.");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
