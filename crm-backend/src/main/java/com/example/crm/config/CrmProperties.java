package com.example.crm.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "crm")
public class CrmProperties {
    private final Jwt jwt = new Jwt();
    private final Cors cors = new Cors();
    private final Storage storage = new Storage();
    private final Bootstrap bootstrap = new Bootstrap();
    private final Scheduler scheduler = new Scheduler();
    private final Mail mail = new Mail();
    private boolean redisEnabled;

    @Getter
    @Setter
    public static class Jwt {
        private String secret;
        private long accessTokenExpirationMs = 900000;
        private long refreshTokenExpirationMs = 604800000;
    }

    @Getter
    @Setter
    public static class Cors {
        private String allowedOrigins = "http://localhost:4200";
    }

    @Getter
    @Setter
    public static class Storage {
        private String localPath = "./uploads";
    }

    @Getter
    @Setter
    public static class Bootstrap {
        private String adminEmail = "admin@crm.local";
        private String adminPassword = "Admin@12345";
        private String adminFirstName = "Super";
        private String adminLastName = "Admin";
    }

    @Getter
    @Setter
    public static class Scheduler {
        private boolean enabled = true;
        private String overdueTasksCron = "0 0 * * * *";
        private String taskRemindersCron = "0 0/15 * * * *";
        private String followUpCron = "0 0/30 * * * *";
        private String dealCloseCron = "0 0 8 * * *";
        private String leadFollowUpCron = "0 0 9 * * *";
        private String tokenCleanupCron = "0 0 3 * * *";
        private String dailySalesCron = "0 0 18 * * *";
    }

    @Getter
    @Setter
    public static class Mail {
        private String from = "noreply@crm.local";
        private String frontendBaseUrl = "http://localhost:4200";
    }
}
