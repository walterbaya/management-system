package com.management.management.batchprocessing.config;

import com.management.management.batchprocessing.JobCompletionNotificationListener;
import com.management.management.batchprocessing.job.step1.ProductItemProcessor;
import com.management.management.batchprocessing.job.step1.ProductItemWriter;
import com.management.management.stepProcesses.ExcelProductReader;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.launch.support.TaskExecutorJobLauncher;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

import com.management.management.model.Product;


@Configuration
public class BatchConfiguration {

    @Bean
    public ItemReader<Product> reader() {
        return new ExcelProductReader("D:\\Documentos\\GitHub\\palma-store\\server\\stock-control\\src\\main\\resources\\stock ejemplo.xlsx");
    }

    @Bean
    public ProductItemProcessor processor() {
        return new ProductItemProcessor();
    }

    @Bean
    public ItemWriter<Product> writer() {
        return new ProductItemWriter();
    }

    @Bean
    public Job importUserJob(JobRepository jobRepository, Step step1, JobCompletionNotificationListener listener) {
        return new JobBuilder("importUserJob", jobRepository)
                .listener(listener)
                .start(step1)
                .build();
    }

    @Bean
    public Step step1(JobRepository jobRepository, DataSourceTransactionManager transactionManager,
                      ItemReader<Product> reader, ItemProcessor<Product, Product> processor, ItemWriter<Product> writer) {
        return new StepBuilder("step1", jobRepository)
                .<Product, Product>chunk(3, transactionManager)
                .reader(reader)
                .processor(processor)
                .writer(writer)
                .build();
    }



}