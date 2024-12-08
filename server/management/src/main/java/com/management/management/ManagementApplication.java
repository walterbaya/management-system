package com.management.management;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.management.management.batchprocessing.JobRunner;

@SpringBootApplication
@EnableTransactionManagement
public class ManagementApplication {
	
	public static void main(String[] args) {
		SpringApplication.run(ManagementApplication.class, args);
		
	}

}
