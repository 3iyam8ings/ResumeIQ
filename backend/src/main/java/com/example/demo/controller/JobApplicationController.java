package com.example.demo.controller;

import com.example.demo.entity.JobApplication;
import com.example.demo.repository.JobApplicationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class JobApplicationController {

    private final JobApplicationRepository repository;

    public JobApplicationController(JobApplicationRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<JobApplication> getAllApplications() {
        return repository.findAll();
    }

    @PostMapping
    public JobApplication createApplication(@RequestBody JobApplication application) {
        return repository.save(application);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobApplication> updateApplication(@PathVariable Long id, @RequestBody JobApplication applicationDetails) {
        return repository.findById(id)
                .map(application -> {
                    application.setCompanyName(applicationDetails.getCompanyName());
                    application.setJobTitle(applicationDetails.getJobTitle());
                    application.setStatus(applicationDetails.getStatus());
                    application.setAppliedDate(applicationDetails.getAppliedDate());
                    application.setMatchScore(applicationDetails.getMatchScore());
                    application.setNotes(applicationDetails.getNotes());
                    JobApplication updatedApplication = repository.save(application);
                    return ResponseEntity.ok(updatedApplication);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        return repository.findById(id)
                .map(application -> {
                    repository.delete(application);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
