package com.palma_store.productBatch.productBatch.config;

import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.HashMap;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
        entityManagerFactoryRef = "StandardEntityManagerFactory",
        basePackages = {"com.management.management.repository"},
        transactionManagerRef = "transactionEntityManager"
)
public class DatabaseConfig {

    @Bean(name = "StandardDataSource")
    public DataSource dataSource(@Value("${standard.datasource.url}") String url,
                                 @Value("${standard.datasource.username}") String username,
                                 @Value("${standard.datasource.password}") String password,
                                 @Value("${standard.datasource.driver-class-name}") String driverClassName) {
        DriverManagerDataSource ds = new DriverManagerDataSource();
        ds.setUrl(url);
        ds.setUsername(username);
        ds.setPassword(password);
        ds.setDriverClassName(driverClassName);
        return ds;
    }

    @Bean(name = "StandardEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean entityManager(@Qualifier("StandardDataSource") DataSource datasource) {
        LocalContainerEntityManagerFactoryBean bean = new LocalContainerEntityManagerFactoryBean();
        bean.setDataSource(datasource);
        JpaVendorAdapter adapter = new HibernateJpaVendorAdapter();
        bean.setJpaVendorAdapter(adapter);
        HashMap<String, Object> properties = new HashMap<String, Object>();
        properties.put("hibernate.hbm2ddl.auto", "update");
        bean.setJpaPropertyMap(properties);
        bean.setPackagesToScan("com.management.management.model");
        return bean;
    }

    @Bean(name = "transactionEntityManager")
    public PlatformTransactionManager transactionManager(@Qualifier("StandardEntityManagerFactory") EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }

}