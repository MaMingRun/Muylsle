package com.selfstudy.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;

@Configuration
@Profile("prod")
public class RailwayDatasourceConfig {

    @Value("${DATABASE_URL:}")
    private String databaseUrl;

    @Bean
    public DataSource dataSource() {
        if (databaseUrl != null && databaseUrl.startsWith("postgres://")) {
            String jdbcUrl = databaseUrl.replace("postgres://", "jdbc:postgresql://");
            return DataSourceBuilder.create()
                    .url(jdbcUrl)
                    .build();
        }
        return DataSourceBuilder.create()
                .url("jdbc:postgresql://localhost:5432/postgres")
                .username("postgres")
                .build();
    }
}
