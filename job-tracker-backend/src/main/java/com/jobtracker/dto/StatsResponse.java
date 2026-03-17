package com.jobtracker.dto;

public class StatsResponse {
    private long totalApplications;
    private long interviews;
    private long offers;
    private long rejections;

    public StatsResponse() {
    }

    public StatsResponse(long totalApplications, long interviews, long offers, long rejections) {
        this.totalApplications = totalApplications;
        this.interviews = interviews;
        this.offers = offers;
        this.rejections = rejections;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public long getInterviews() {
        return interviews;
    }

    public void setInterviews(long interviews) {
        this.interviews = interviews;
    }

    public long getOffers() {
        return offers;
    }

    public void setOffers(long offers) {
        this.offers = offers;
    }

    public long getRejections() {
        return rejections;
    }

    public void setRejections(long rejections) {
        this.rejections = rejections;
    }
}
