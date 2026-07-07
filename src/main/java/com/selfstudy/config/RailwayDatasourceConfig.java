package com.selfstudy.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;

@Configuration
public class RailwayDatasourceConfig {

    @Value("${SPRING_DATASOURCE_URL:}")
    private String databaseUrl;

    @PostConstruct
    public void init() {
        if (databaseUrl != null && databaseUrl.startsWith("postgres://")) {
            System.setProperty("SPRING_DATASOURCE_URL", convertPostgresUrl(databaseUrl));
        }
    }

    private String convertPostgresUrl(String url) {
        String[] parts = url.replace("postgres://", "").split("@");
        String credentials = parts[0];
        String hostPortDb = parts[1];
        
        String[] credParts = credentials.split(":");
        String username = credParts[0];
        String password = credParts[1];
        
        String[] hostParts = hostPortDb.split("/");
        String hostPort = hostParts[0];
        String dbName = hostParts[1];
        
        String[] hpParts = hostPort.split(":");
        String host = hpParts[0];
        String port = hpParts.length > 1 ? hpParts[1] : "5432";
        
        return String.format("jdbc:postgresql://%s:%s/%s?user=%s&password=%s", 
                host, port, dbName, username, password);
    }
}
