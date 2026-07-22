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

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
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

    private void loginUserSession(User user, HttpServletRequest request) {
        UsernamePasswordAuthenticationToken authReq
                = new UsernamePasswordAuthenticationToken(user.getEmail(), null, Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")));
        
        SecurityContext sc = SecurityContextHolder.getContext();
        sc.setAuthentication(authReq);
        HttpSession session = request.getSession(true);
        session.setAttribute("SPRING_SECURITY_CONTEXT", sc);
    }
}
