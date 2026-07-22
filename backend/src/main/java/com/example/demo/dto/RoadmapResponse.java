package com.example.demo.dto;

public class RoadmapResponse {
    private String roadmap;

    public RoadmapResponse() {}

    public RoadmapResponse(String roadmap) {
        this.roadmap = roadmap;
    }

    public String getRoadmap() { return roadmap; }
    public void setRoadmap(String roadmap) { this.roadmap = roadmap; }
}
