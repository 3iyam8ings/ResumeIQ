package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender emailSender;
    
    @Value("${spring.mail.username:}")
    private String fromEmail;

    @Autowired
    public EmailService(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    @Async
    public void sendPasswordResetEmail(String to, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage(); 
        
        if (fromEmail != null && !fromEmail.isEmpty()) {
            message.setFrom(fromEmail);
        }
        
        message.setTo(to); 
        message.setSubject("Reset your ResumeIQ password"); 
        message.setText("Click the link below to reset your password. It expires in 15 minutes.\n\n" + resetLink);
        
        try {
            emailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            // Log it but don't crash, the token was still generated
        }
    }
}
