package com.example.demo;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.DefaultResponseErrorHandler;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

import jakarta.servlet.http.HttpServletRequest;
import java.net.HttpURLConnection;
import java.io.IOException;
import java.util.Enumeration;

@RestController
public class FallbackProxyController {

    private final RestTemplate restTemplate;

    public FallbackProxyController() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory() {
            @Override
            protected void prepareConnection(HttpURLConnection connection, String httpMethod) throws IOException {
                super.prepareConnection(connection, httpMethod);
                // Do NOT follow redirects — the browser must handle them (critical for OAuth2 flow)
                connection.setInstanceFollowRedirects(false);
            }
        };
        this.restTemplate = new RestTemplate(factory);
        // Do NOT throw exceptions on 4xx/5xx — pass the response through to the browser as-is
        this.restTemplate.setErrorHandler(new DefaultResponseErrorHandler() {
            @Override
            public boolean hasError(org.springframework.http.client.ClientHttpResponse response) throws IOException {
                return false; // Never treat any response as an error; let it pass through
            }
        });
    }

    @Value("${BACKEND_URL:http://localhost:8082}")
    private String backendUrl;

    @RequestMapping({"/api/**", "/oauth2/**", "/login/oauth2/**"})
    public ResponseEntity<byte[]> proxy(HttpServletRequest request,
                                        @RequestBody(required = false) byte[] body) {

        String targetUrl = backendUrl + request.getRequestURI();
        if (request.getQueryString() != null) {
            targetUrl += "?" + request.getQueryString();
        }

        HttpHeaders headers = new HttpHeaders();

        // Copy all request headers except hop-by-hop headers
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            if (!headerName.equalsIgnoreCase("host")
                    && !headerName.equalsIgnoreCase("transfer-encoding")
                    && !headerName.equalsIgnoreCase("connection")
                    && !headerName.equalsIgnoreCase("keep-alive")) {
                headers.add(headerName, request.getHeader(headerName));
            }
        }

        // Ensure the backend knows the original host so Spring Security
        // builds the correct redirect_uri (e.g. resumeiq-gateway.onrender.com)
        if (!headers.containsHeader("X-Forwarded-Host")) {
            headers.set("X-Forwarded-Host", request.getServerName());
        }

        // Ensure HTTPS protocol is forwarded — without this Spring Security
        // generates http:// redirect URIs which Google/GitHub reject
        if (!headers.containsHeader("X-Forwarded-Proto")) {
            String scheme = request.getHeader("X-Forwarded-Proto");
            headers.set("X-Forwarded-Proto", scheme != null ? scheme : request.getScheme());
        }

        // Forward the real client IP
        if (!headers.containsHeader("X-Forwarded-For")) {
            headers.set("X-Forwarded-For", request.getRemoteAddr());
        }

        HttpEntity<byte[]> entity = new HttpEntity<>(body, headers);
        try {
            ResponseEntity<byte[]> response = restTemplate.exchange(
                    targetUrl, HttpMethod.valueOf(request.getMethod()), entity, byte[].class);

            // Build a clean response — pass through status and headers
            return ResponseEntity.status(response.getStatusCode())
                    .headers(response.getHeaders())
                    .body(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            String errorMsg = "Proxy Error: Unable to reach backend at " + targetUrl + ". Exception: " + e.getMessage();
            return ResponseEntity.status(502).body(errorMsg.getBytes());
        }
    }
}
