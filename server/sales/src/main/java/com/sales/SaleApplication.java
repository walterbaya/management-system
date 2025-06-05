package com.sales;

import com.sales.config.DateTimeConfig;
import io.swagger.v3.oas.annotations.ExternalDocumentation;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@OpenAPIDefinition(
		info = @Info(
				title = "Sales microservice REST API Documentation",
				description = "Management-System Sales microservice REST API Documentation",
				version = "v1",
				contact = @Contact(
						name = "Walter Ariel Baya",
						email = "walterbaya@yahoo.com",
						url = ""
				),
				license = @License(
						name = "",
						url = ""
				)
		),
		externalDocs = @ExternalDocumentation(
				description = "Management-System Sales microservice REST API Documentation",
				url = ""
		)
)
@EnableJpaAuditing(auditorAwareRef = "auditAwareImpl")
@SpringBootApplication
@EnableConfigurationProperties(DateTimeConfig.class)
public class SaleApplication {

	public static void main(String[] args) {
		SpringApplication.run(SaleApplication.class, args);
	}

}
