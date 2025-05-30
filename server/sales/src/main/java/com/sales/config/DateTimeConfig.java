package com.sales.config;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import java.time.Duration;
import java.time.ZoneId;

@ConfigurationProperties("app.datetime")
@Getter
@AllArgsConstructor
public class DateTimeConfig {
    private final ZoneId zone;
    private final Duration mysqlOffset;
}
