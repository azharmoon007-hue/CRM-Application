package com.example.crm.specification;

import com.example.crm.entity.Activity;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ActivitySpecification {
    public Specification<Activity> search(String search) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("subject")), pattern));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
