package com.example.demo.dto;

public class RewriteResponse {
    private String rewrittenBulletPoint;

    public RewriteResponse() {
    }

    public RewriteResponse(String rewrittenBulletPoint) {
        this.rewrittenBulletPoint = rewrittenBulletPoint;
    }

    public String getRewrittenBulletPoint() {
        return rewrittenBulletPoint;
    }

    public void setRewrittenBulletPoint(String rewrittenBulletPoint) {
        this.rewrittenBulletPoint = rewrittenBulletPoint;
    }
}
