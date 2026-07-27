package com.example.demo.controller;

import com.example.demo.dto.IqTestRequest;
import com.example.demo.dto.IqTestSummaryResponse;
import com.example.demo.service.IqTestService;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Exposes the IQ test cognitive-profile summary endpoint.
 * Rate-limited per client IP (5 requests/minute) to prevent abuse of the
 * underlying
 * Gemini call, and validates the incoming payload before generating a summary.
 */
@RestController
@RequestMapping("/api/iqtest")
public class IqTestController {

    /* ------------------------------------------------------------------ */
    /* Rate limit config */
    /* ------------------------------------------------------------------ */
    private static final int RATE_LIMIT_CAPACITY = 5;
    private static final Duration RATE_LIMIT_REFILL_PERIOD = Duration.ofMinutes(1);
    // Simple bound so the per-IP bucket cache can't grow forever under sustained
    // traffic
    // from many distinct IPs. Not a true LRU eviction — just a pragmatic safety
    // valve.
    private static final int MAX_CACHE_ENTRIES = 10_000;

    /* ------------------------------------------------------------------ */
    /* Dependencies */
    /* ------------------------------------------------------------------ */
    private final IqTestService iqTestService;

    // IP-based rate limiting cache
    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    @Autowired
    public IqTestController(IqTestService iqTestService) {
        this.iqTestService = iqTestService;
    }

    /* ------------------------------------------------------------------ */
    /* Endpoint */
    /* ------------------------------------------------------------------ */

    @PostMapping("/summary")
    public ResponseEntity<?> getSummary(@RequestBody IqTestRequest request, HttpServletRequest httpRequest) {
        String ip = getClientIP(httpRequest);
        Bucket bucket = resolveBucket(ip);

        if (!bucket.tryConsume(1)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body("Rate limit exceeded. Please try again later.");
        }

        if (request == null || !request.isValid()) {
            return ResponseEntity.badRequest().body("Invalid input data.");
        }

        String summary = iqTestService.generateSummary(request);
        return ResponseEntity.ok(new IqTestSummaryResponse(summary));
    }

    /* ------------------------------------------------------------------ */
    /* Rate limiting helpers */
    /* ------------------------------------------------------------------ */

    private Bucket resolveBucket(String ip) {
        if (cache.size() >= MAX_CACHE_ENTRIES) {
            // Pragmatic safety valve: reset the whole cache rather than let it grow
            // unbounded. This briefly resets everyone's rate limit, which is an
            // acceptable tradeoff versus an unbounded memory leak.
            cache.clear();
        }
        return cache.computeIfAbsent(ip, this::newBucket);
    }

    private Bucket newBucket(String ip) {
        // Limit to 5 requests per minute per IP to prevent API abuse
        Bandwidth limit = Bandwidth.builder()
                .capacity(RATE_LIMIT_CAPACITY)
                .refillGreedy(RATE_LIMIT_CAPACITY, RATE_LIMIT_REFILL_PERIOD)
                .build();
        return Bucket.builder().addLimit(limit).build();
    }

    /* ------------------------------------------------------------------ */
    /* Request helpers */
    /* ------------------------------------------------------------------ */

    /**
     * Returns the actual TCP connection IP. Deliberately does NOT trust the
     * X-Forwarded-For header, since that header is set by the client and can be
     * spoofed to a different value on every request, bypassing the rate limiter.
     * If this app is later deployed behind a trusted reverse proxy/load balancer
     * that overwrites X-Forwarded-For with the real client IP, that header can be
     * reintroduced safely at that point.
     */
    private String getClientIP(HttpServletRequest request) {
        return request.getRemoteAddr();
    }
}