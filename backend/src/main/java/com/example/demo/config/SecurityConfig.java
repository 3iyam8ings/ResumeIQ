package com.example.demo.config;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserRepository userRepository;

    public SecurityConfig(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable()) // Disable CSRF for simplified React integration
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/login/**", "/oauth2/**").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .userInfoEndpoint(userInfo -> userInfo.userService(this.oauth2UserService()))
                .successHandler(this.oauth2SuccessHandler())
                .failureHandler(this.oauth2FailureHandler())
            )
            // We'll handle local auth manually in AuthController to return JSON
            .logout(logout -> logout
                .logoutUrl("/api/auth/logout")
                .logoutSuccessHandler((request, response, authentication) -> {
                    response.setStatus(200);
                })
                .permitAll()
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173")); // React app
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true); // Allow cookies (JSESSIONID)

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    private OAuth2UserService<OAuth2UserRequest, OAuth2User> oauth2UserService() {
        DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();
        return request -> {
            OAuth2User oAuth2User = delegate.loadUser(request);
            String provider = request.getClientRegistration().getRegistrationId();
            
            String email = null;
            if ("github".equals(provider)) {
                // GitHub doesn't always guarantee email in standard profile depending on privacy settings,
                // but let's try. Sometimes it's under 'login'. Let's use 'login' if email is missing.
                email = oAuth2User.getAttribute("email");
                if (email == null) {
                    email = oAuth2User.getAttribute("login") + "@github.com";
                }
            } else if ("google".equals(provider)) {
                email = oAuth2User.getAttribute("email");
            }

            if (email == null) {
                throw new RuntimeException("OAuth2 email not found");
            }

            final String finalEmail = email;
            
            // Handle picture (Google uses 'picture', GitHub uses 'avatar_url')
            String picture = oAuth2User.getAttribute("picture");
            if (picture == null) {
                picture = oAuth2User.getAttribute("avatar_url");
            }

            User user = userRepository.findByEmail(finalEmail).orElse(new User());
            user.setEmail(finalEmail);
            user.setProvider(provider);
            if (picture != null) {
                user.setAvatarUrl(picture);
            }
            userRepository.save(user);

            // Wrap the OAuth2User to include our DB authorities or details if needed
            return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                oAuth2User.getAttributes(),
                "github".equals(provider) && oAuth2User.getAttribute("email") == null ? "login" : "email"
            );
        };
    }

    private AuthenticationSuccessHandler oauth2SuccessHandler() {
        return (request, response, authentication) -> {
            // Redirect back to the React app to set password
            response.sendRedirect("http://localhost:5173/set-password");
        };
    }

    private AuthenticationFailureHandler oauth2FailureHandler() {
        return (request, response, exception) -> {
            String errorMsg = exception instanceof OAuth2AuthenticationException ? 
                ((OAuth2AuthenticationException) exception).getError().getErrorCode() : "oauth2_error";
            response.sendRedirect("http://localhost:5173/signup?error=" + errorMsg);
        };
    }
}
