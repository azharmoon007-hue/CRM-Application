package com.example.crm.specification;

import com.example.crm.entity.Customer;
import com.example.crm.entity.enums.CustomerStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class CustomerSpecification {
    public Specification<Customer> search(String search, CustomerStatus status, String industry) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("firstName")), pattern),
                        cb.like(cb.lower(root.get("lastName")), pattern),
                        cb.like(cb.lower(root.get("companyName")), pattern),
                        cb.like(cb.lower(root.get("email")), pattern),
                        cb.like(cb.lower(root.get("phone")), pattern)
                ));
            }
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (industry != null && !industry.isBlank()) {
                predicates.add(cb.equal(root.get("industry"), industry));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
