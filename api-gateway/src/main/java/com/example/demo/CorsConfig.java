package com.example.demo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        // Must be true so session cookies (JSESSIONID) are sent on OAuth2 callbacks
        config.setAllowCredentials(true);
        // Explicit origins required when allowCredentials=true (wildcard not allowed)
        config.setAllowedOrigins(List.of(
                "https://resume-iq-teal.vercel.app",
                "http://localhost:5173"));
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        // Expose Set-Cookie and Location so the browser sees OAuth2 redirects
        config.addExposedHeader("Set-Cookie");
        config.addExposedHeader("Location");
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
