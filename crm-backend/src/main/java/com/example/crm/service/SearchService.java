package com.example.crm.service;

import com.example.crm.dto.search.SearchResultDto;

public interface SearchService {
    SearchResultDto globalSearch(String query);
}
