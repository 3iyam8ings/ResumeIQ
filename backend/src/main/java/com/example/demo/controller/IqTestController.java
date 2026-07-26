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

@RestController
@RequestMapping("/api/iqtest")
public class IqTestController {

    private final IqTestService iqTestService;

    // IP-based rate limiting cache
    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    @Autowired
    public IqTestController(IqTestService iqTestService) {
        this.iqTestService = iqTestService;
    }

    private Bucket resolveBucket(String ip) {
        return cache.computeIfAbsent(ip, this::newBucket);
    }

    private Bucket newBucket(String ip) {
        // Limit to 5 requests per minute per IP to prevent API abuse
        Bandwidth limit = Bandwidth.builder()
                .capacity(5)
                .refillGreedy(5, Duration.ofMinutes(1))
                .build();
        return Bucket.builder().addLimit(limit).build();
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }

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
}
