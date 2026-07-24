package com.example.demo.controller;

import com.example.demo.entity.PasswordResetToken;
import com.example.demo.entity.User;
import com.example.demo.repository.PasswordResetTokenRepository;
import com.example.demo.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import com.example.demo.service.EmailService;

import java.time.LocalDateTime;
import java.util.Base64;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for {@link AuthController}.
 *
 * Uses the H2 in-memory database (active via the "test" Spring profile) and
 * mocks the {@link EmailService} so no real SMTP server is required.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional // Each test rolls back — no cross-test pollution
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Mock the email service so no real SMTP call is attempted
    @MockitoBean
    private EmailService emailService;

    // -----------------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------------

    private User createUser(String email, String rawPassword) {
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setProvider("local");
        user.setName("Test User");
        return userRepository.save(user);
    }

    private String hashToken(String raw) throws Exception {
        java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
        byte[] encoded = digest.digest(raw.getBytes(java.nio.charset.StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder(2 * encoded.length);
        for (byte b : encoded) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) sb.append('0');
            sb.append(hex);
        }
        return sb.toString();
    }

    // -----------------------------------------------------------------------
    // /api/auth/signup
    // -----------------------------------------------------------------------

    @Test
    void signup_withValidCredentials_returns200() throws Exception {
        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Alice\",\"email\":\"alice@test.com\",\"password\":\"password123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered successfully"))
                .andExpect(jsonPath("$.email").value("alice@test.com"));

        assertTrue(userRepository.existsByEmail("alice@test.com"));
    }

    @Test
    void signup_withDuplicateEmail_returns409() throws Exception {
        createUser("dup@test.com", "password");

        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"dup@test.com\",\"password\":\"password123\"}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("Email is already registered"));
    }

    @Test
    void signup_withMissingEmail_returns400() throws Exception {
        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"password\":\"password123\"}"))
                .andExpect(status().isBadRequest());
    }

    // -----------------------------------------------------------------------
    // /api/auth/login
    // -----------------------------------------------------------------------

    @Test
    void login_withCorrectCredentials_returns200() throws Exception {
        createUser("bob@test.com", "secret123");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"bob@test.com\",\"password\":\"secret123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Login successful"));
    }

    @Test
    void login_withWrongPassword_returns401() throws Exception {
        createUser("carol@test.com", "rightpassword");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"carol@test.com\",\"password\":\"wrongpassword\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Invalid email or password"));
    }

    @Test
    void login_withUnknownEmail_returns401() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"ghost@test.com\",\"password\":\"any\"}"))
                .andExpect(status().isUnauthorized());
    }

    // -----------------------------------------------------------------------
    // /api/auth/forgot-password
    // -----------------------------------------------------------------------

    @Test
    void forgotPassword_forExistingUser_returns200WithGenericMessage() throws Exception {
        createUser("dave@test.com", "pass");

        mockMvc.perform(post("/api/auth/forgot-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"dave@test.com\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").exists());

        // A token should have been saved in the DB
        User dave = userRepository.findByEmail("dave@test.com").orElseThrow();
        assertFalse(tokenRepository.findAll().stream()
                .filter(t -> t.getUser().getId().equals(dave.getId()))
                .toList().isEmpty(), "A password reset token should have been saved");
    }

    @Test
    void forgotPassword_forNonExistentUser_stillReturns200_noEnumeration() throws Exception {
        // Security: must return 200 even for unknown emails (prevents user enumeration)
        mockMvc.perform(post("/api/auth/forgot-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"nobody@test.com\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void forgotPassword_withEmptyEmail_returns400() throws Exception {
        mockMvc.perform(post("/api/auth/forgot-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"\"}"))
                .andExpect(status().isBadRequest());
    }

    // -----------------------------------------------------------------------
    // /api/auth/reset-password
    // -----------------------------------------------------------------------

    @Test
    void resetPassword_withValidToken_updatesPasswordAndReturns200() throws Exception {
        User user = createUser("eve@test.com", "oldpassword");

        // Simulate what AuthController does: create a raw token, hash it, save the hash
        String rawToken = Base64.getUrlEncoder().withoutPadding()
                .encodeToString("test-raw-token-deterministic".getBytes());
        String tokenHash = hashToken(rawToken);

        PasswordResetToken resetToken = new PasswordResetToken(
                tokenHash, user, LocalDateTime.now().plusMinutes(15));
        tokenRepository.save(resetToken);

        mockMvc.perform(post("/api/auth/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"token\":\"" + rawToken + "\",\"newPassword\":\"newpassword99\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").exists());

        // Password should be updated
        User updated = userRepository.findByEmail("eve@test.com").orElseThrow();
        assertTrue(passwordEncoder.matches("newpassword99", updated.getPassword()),
                "Password should have been updated");

        // Token should be marked as used
        PasswordResetToken usedToken = tokenRepository.findByTokenHash(tokenHash).orElseThrow();
        assertTrue(usedToken.isUsed(), "Token should be marked as used after reset");
    }

    @Test
    void resetPassword_withExpiredToken_returns400() throws Exception {
        User user = createUser("frank@test.com", "oldpassword");
        String rawToken = "expiredtoken123";
        String tokenHash = hashToken(rawToken);

        PasswordResetToken expiredToken = new PasswordResetToken(
                tokenHash, user, LocalDateTime.now().minusMinutes(1)); // Already expired
        tokenRepository.save(expiredToken);

        mockMvc.perform(post("/api/auth/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"token\":\"expiredtoken123\",\"newPassword\":\"newpassword99\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("This reset token has expired"));
    }

    @Test
    void resetPassword_withAlreadyUsedToken_returns400() throws Exception {
        User user = createUser("grace@test.com", "oldpassword");
        String rawToken = "usedtoken456";
        String tokenHash = hashToken(rawToken);

        PasswordResetToken usedToken = new PasswordResetToken(
                tokenHash, user, LocalDateTime.now().plusMinutes(15));
        usedToken.setUsed(true);
        tokenRepository.save(usedToken);

        mockMvc.perform(post("/api/auth/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"token\":\"usedtoken456\",\"newPassword\":\"newpassword99\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("This reset token has already been used"));
    }

    @Test
    void resetPassword_withShortPassword_returns400() throws Exception {
        mockMvc.perform(post("/api/auth/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"token\":\"sometoken\",\"newPassword\":\"short\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Password must be at least 8 characters long"));
    }

    @Test
    void resetPassword_withInvalidToken_returns400() throws Exception {
        mockMvc.perform(post("/api/auth/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"token\":\"totallyfaketoken\",\"newPassword\":\"validpassword123\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Invalid or expired reset token"));
    }

    // -----------------------------------------------------------------------
    // /api/auth/me
    // -----------------------------------------------------------------------

    @Test
    void me_whenNotAuthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }
}
