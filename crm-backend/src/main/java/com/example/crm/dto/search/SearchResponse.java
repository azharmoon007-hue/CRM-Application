package com.example.crm.dto.search;

import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.UUID;

@Getter
@Builder
public class SearchResponse {
    private List<SearchHit> customers;
    private List<SearchHit> leads;
    private List<SearchHit> deals;
    private List<SearchHit> contacts;
    private List<SearchHit> activities;

    @Getter
    @Builder
    public static class SearchHit {
        private UUID id;
        private String title;
        private String subtitle;
        private String type;
    }
}
