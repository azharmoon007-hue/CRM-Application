package com.example.crm.controller;

import com.example.crm.dto.common.ApiResponse;
import com.example.crm.dto.search.SearchResultDto;
import com.example.crm.service.SearchService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/search")
public class SearchController {
    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('SEARCH_VIEW')")
    public ResponseEntity<ApiResponse<SearchResultDto>> search(@RequestParam String query) {
        return ResponseEntity.ok(ApiResponse.ok("Search results", searchService.globalSearch(query)));
    }
}
