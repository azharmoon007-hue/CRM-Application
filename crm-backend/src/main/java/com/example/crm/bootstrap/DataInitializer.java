package com.example.crm.bootstrap;

import com.example.crm.config.CrmProperties;
import com.example.crm.entity.Role;
import com.example.crm.entity.User;
import com.example.crm.entity.enums.RoleName;
import com.example.crm.entity.enums.UserStatus;
import com.example.crm.repository.RoleRepository;
import com.example.crm.repository.UserRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {
    @Bean
    ApplicationRunner initRolesAndAdmin(CrmProperties properties, RoleRepository roleRepository,
                                       UserRepository userRepository, PasswordEncoder encoder) {
        return args -> {
            if (userRepository.findByEmailIgnoreCase(properties.getBootstrap().getAdminEmail()).isEmpty()) {
                Role adminRole = roleRepository.findByName(RoleName.SUPER_ADMIN).orElse(null);
                if (adminRole == null) {
                    adminRole = new Role();
                    adminRole.setName(RoleName.SUPER_ADMIN);
                    adminRole.setDescription("Super admin");
                    adminRole = roleRepository.save(adminRole);
                }
                User admin = new User();
                admin.setFirstName(properties.getBootstrap().getAdminFirstName());
                admin.setLastName(properties.getBootstrap().getAdminLastName());
                admin.setEmail(properties.getBootstrap().getAdminEmail());
                admin.setPassword(encoder.encode(properties.getBootstrap().getAdminPassword()));
                admin.setStatus(UserStatus.ACTIVE);
                admin.setEmailVerified(true);
                admin.getRoles().add(adminRole);
                userRepository.save(admin);
            }
        };
    }
}
