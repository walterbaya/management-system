package com.management.management.batchprocessing.batchprocessingfactorystock.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;

@Configuration
@EnableTransactionManagement
public class BatchFactoryDatabaseConfig {

    @Bean(name = "batchFactoryStockDataSource")
    public DataSource batchDataSource(
            @Value("${batchFactoryStock.datasource.url}") String url,
            @Value("${batchFactoryStock.datasource.username}") String username,
            @Value("${batchFactoryStock.datasource.password}") String password,
            @Value("${batchFactoryStock.datasource.driver-class-name}") String driverClassName) {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setUrl(url);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        dataSource.setDriverClassName(driverClassName);
        return dataSource;
    }

    @Bean(name = "batchFactoryStockTransactionManager")
    public PlatformTransactionManager batchFactoryManager(@Qualifier("batchFactoryStockDataSource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

}