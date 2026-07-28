package com.example.demo;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Enumeration;

@RestController
public class FallbackProxyController {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${BACKEND_URL:http://localhost:8082}")
    private String backendUrl;

    @RequestMapping({"/api/**", "/oauth2/**", "/login/oauth2/**"})
    public ResponseEntity<byte[]> proxy(HttpServletRequest request, @RequestBody(required = false) byte[] body) {
        String targetUrl = backendUrl + request.getRequestURI();
        if (request.getQueryString() != null) {
            targetUrl += "?" + request.getQueryString();
        }
        
        HttpHeaders headers = new HttpHeaders();
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            if (!headerName.equalsIgnoreCase("host") && !headerName.equalsIgnoreCase("transfer-encoding")) {
                headers.add(headerName, request.getHeader(headerName));
            }
        }

        HttpEntity<byte[]> entity = new HttpEntity<>(body, headers);
        return restTemplate.exchange(targetUrl, HttpMethod.valueOf(request.getMethod()), entity, byte[].class);
    }
}
