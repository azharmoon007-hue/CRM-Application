package com.example.crm.config;

import com.example.crm.config.CrmProperties;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisPassword;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.util.StringUtils;

@Configuration
public class CacheConfig {

    @Bean
    @ConditionalOnProperty(name = "crm.redis-enabled", havingValue = "false", matchIfMissing = true)
    public CacheManager simpleCacheManager() {
        return new ConcurrentMapCacheManager("pipelines", "dashboard", "roles");
    }

    @Bean
    @ConditionalOnProperty(name = "crm.redis-enabled", havingValue = "true")
    public LettuceConnectionFactory redisConnectionFactory(CrmProperties properties,
                                                           org.springframework.core.env.Environment env) {
        RedisStandaloneConfiguration configuration = new RedisStandaloneConfiguration(
                env.getProperty("spring.data.redis.host", "localhost"),
                env.getProperty("spring.data.redis.port", Integer.class, 6379));
        String password = env.getProperty("spring.data.redis.password", "");
        if (StringUtils.hasText(password)) {
            configuration.setPassword(RedisPassword.of(password));
        }
        return new LettuceConnectionFactory(configuration);
    }

    @Bean
    @ConditionalOnProperty(name = "crm.redis-enabled", havingValue = "true")
    public CacheManager redisCacheManager(LettuceConnectionFactory factory) {
        return RedisCacheManager.builder(factory).build();
    }
}
