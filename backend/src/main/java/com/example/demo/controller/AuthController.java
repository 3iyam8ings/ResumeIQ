package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;
import com.example.demo.entity.PasswordResetToken;
import com.example.demo.repository.PasswordResetTokenRepository;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository tokenRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, PasswordResetTokenRepository tokenRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenRepository = tokenRepository;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> request, HttpServletRequest httpRequest) {
        String email = request.get("email");
        String password = request.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
        }

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Email is already registered"));
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setProvider("local");
        userRepository.save(user);

        // Auto login after signup
        loginUserSession(user, httpRequest);

        return ResponseEntity.ok(Map.of("message", "User registered successfully", "email", email));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request, HttpServletRequest httpRequest) {
        String emailOrUsername = request.get("email");
        String password = request.get("password");

        User user = userRepository.findByEmail(emailOrUsername).orElse(null);
        
        // If not found, and doesn't look like an email, try adding @github.com for GitHub usernames
        if (user == null && emailOrUsername != null && !emailOrUsername.contains("@")) {
            user = userRepository.findByEmail(emailOrUsername + "@github.com").orElse(null);
        }

        if (user == null || user.getPassword() == null || !passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid email or password"));
        }

        // Create session
        loginUserSession(user, httpRequest);

        return ResponseEntity.ok(Map.of("message", "Login successful", "email", user.getEmail()));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
        }

        String email = null;
        String name = null;
        String picture = null;
        
        if (authentication instanceof OAuth2AuthenticationToken oauthToken) {
            email = oauthToken.getPrincipal().getAttribute("email");
            if (email == null) {
                email = oauthToken.getPrincipal().getAttribute("login") + "@github.com"; // Fallback for github
            }
            name = oauthToken.getPrincipal().getAttribute("name");
            
            // Handle picture (Google uses 'picture', GitHub uses 'avatar_url')
            picture = oauthToken.getPrincipal().getAttribute("picture");
            if (picture == null) {
                picture = oauthToken.getPrincipal().getAttribute("avatar_url");
            }
        } else {
            email = authentication.getName(); // For UsernamePasswordAuthenticationToken
        }

        if (email != null) {
            User dbUser = userRepository.findByEmail(email).orElse(null);
            if (dbUser != null && dbUser.getAvatarUrl() != null) {
                picture = dbUser.getAvatarUrl();
            }
        }

        Map<String, String> response = new HashMap<>();
        response.put("email", email != null ? email : "unknown");
        if (name != null) response.put("name", name);
        if (picture != null) response.put("picture", picture);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/set-password")
    public ResponseEntity<?> setPassword(@RequestBody Map<String, String> request, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
        }

        String email = null;
        if (authentication instanceof OAuth2AuthenticationToken oauthToken) {
            email = oauthToken.getPrincipal().getAttribute("email");
            if (email == null) {
                email = oauthToken.getPrincipal().getAttribute("login") + "@github.com"; // Fallback for github
            }
        } else {
            email = authentication.getName(); // For UsernamePasswordAuthenticationToken
        }

        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Email not found"));
        }

        String password = request.get("password");
        if (password == null || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password is required"));
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }

        if (user.getPassword() != null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password already set"));
        }

        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password set successfully"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }

        User user = userRepository.findByEmail(email).orElse(null);
        
        // Always return generic success to prevent email enumeration
        Map<String, String> genericResponse = Map.of(
            "message", "If an account matches that email, we have sent a password reset link."
        );

        if (user != null) {
            // 1. Invalidate previous unused tokens for this user
            tokenRepository.invalidateAllTokensForUser(user);

            // 2. Generate a secure random token
            byte[] randomBytes = new byte[32];
            secureRandom.nextBytes(randomBytes);
            String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);

            // 3. Hash the token for storage
            String tokenHash = hashString(rawToken);

            // 4. Save the hashed token with a 15-minute expiration
            LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(15);
            PasswordResetToken resetToken = new PasswordResetToken(tokenHash, user, expiryDate);
            tokenRepository.save(resetToken);

            // 5. Simulate sending the email (print to console for testing)
            String resetLink = "http://localhost:5173/reset-password?token=" + rawToken;
            System.out.println("=================================================");
            System.out.println("SIMULATED EMAIL DISPATCH:");
            System.out.println("To: " + user.getEmail());
            System.out.println("Subject: Reset your ResumeIQ password");
            System.out.println("Body: Click the link below to reset your password. It expires in 15 minutes.");
            System.out.println(resetLink);
            System.out.println("=================================================");
        }

        return ResponseEntity.ok(genericResponse);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String rawToken = request.get("token");
        String newPassword = request.get("newPassword");

        if (rawToken == null || newPassword == null || newPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Token and new password are required"));
        }

        if (newPassword.length() < 8) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 8 characters long"));
        }

        String tokenHash = hashString(rawToken);
        PasswordResetToken tokenEntity = tokenRepository.findByTokenHash(tokenHash).orElse(null);

        if (tokenEntity == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Invalid or expired reset token"));
        }

        if (tokenEntity.isUsed()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "This reset token has already been used"));
        }

        if (tokenEntity.getExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "This reset token has expired"));
        }

        // Token is valid, update user's password
        User user = tokenEntity.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Mark token as used
        tokenEntity.setUsed(true);
        tokenRepository.save(tokenEntity);

        return ResponseEntity.ok(Map.of("message", "Password has been reset successfully. You can now log in."));
    }

    private String hashString(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedhash = digest.digest(input.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            return bytesToHex(encodedhash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not found", e);
        }
    }

    private String bytesToHex(byte[] hash) {
        StringBuilder hexString = new StringBuilder(2 * hash.length);
        for (int i = 0; i < hash.length; i++) {
            String hex = Integer.toHexString(0xff & hash[i]);
            if(hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }

    private void loginUserSession(User user, HttpServletRequest request) {
        UsernamePasswordAuthenticationToken authReq
                = new UsernamePasswordAuthenticationToken(user.getEmail(), null, Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")));
        
        SecurityContext sc = SecurityContextHolder.getContext();
        sc.setAuthentication(authReq);
        HttpSession session = request.getSession(true);
        session.setAttribute("SPRING_SECURITY_CONTEXT", sc);
    }
}
