package com.example.crm.service.impl;

import com.example.crm.dto.search.SearchResultDto;
import com.example.crm.repository.*;
import com.example.crm.service.SearchService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional(readOnly = true)
public class SearchServiceImpl implements SearchService {
    private final CustomerRepository customerRepository;
    private final LeadRepository leadRepository;
    private final DealRepository dealRepository;
    private final ContactRepository contactRepository;
    private final ActivityRepository activityRepository;

    public SearchServiceImpl(CustomerRepository customerRepository, LeadRepository leadRepository,
                            DealRepository dealRepository, ContactRepository contactRepository,
                            ActivityRepository activityRepository) {
        this.customerRepository = customerRepository;
        this.leadRepository = leadRepository;
        this.dealRepository = dealRepository;
        this.contactRepository = contactRepository;
        this.activityRepository = activityRepository;
    }

    @Override
    public SearchResultDto globalSearch(String query) {
        Map<String, List<Object>> results = new HashMap<>();
        results.put("customers", Collections.emptyList());
        results.put("leads", Collections.emptyList());
        results.put("deals", Collections.emptyList());
        results.put("contacts", Collections.emptyList());
        results.put("activities", Collections.emptyList());
        return SearchResultDto.builder().results(results).build();
    }
}
