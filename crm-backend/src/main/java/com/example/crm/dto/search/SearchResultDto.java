package com.example.crm.dto.search;

import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.Map;

@Getter
@Builder
public class SearchResultDto {
    private Map<String, List<Object>> results;
}
