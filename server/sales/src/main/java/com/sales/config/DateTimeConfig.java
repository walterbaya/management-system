package com.sales.config;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.ConstructorBinding;

import java.time.Duration;
import java.time.ZoneId;

@ConstructorBinding
@ConfigurationProperties(prefix = "app.datetime")
@Getter
@AllArgsConstructor
public class DateTimeConfig {
    private final ZoneId zone;
    private final Duration mysqlOffset;
}

