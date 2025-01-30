package com.management.management.batchprocessing.config;

import com.management.management.batchprocessing.JobCompletionNotificationListener;
import com.management.management.batchprocessing.ReaderResetListener;
import com.management.management.batchprocessing.job.step1.ExcelProductReader;
import com.management.management.batchprocessing.job.step1.ProductItemProcessor;
import com.management.management.batchprocessing.job.step1.ProductItemWriter;

import com.management.management.batchprocessing.job.step2.ExcelProductPriceReader;
import com.management.management.util.ProductPrice;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

import com.management.management.model.Product;


@Configuration
public class BatchConfiguration {

    @Bean
    @StepScope
    public ItemReader<ProductPrice> reader(@Qualifier("excelProductPriceReader") ExcelProductPriceReader excelProductPriceReader) {
        return excelProductPriceReader;
    }

    @Bean
    public ExcelProductReader excelProductReader(){
        return new ExcelProductReader();
    }


    @Bean
    @StepScope
    public ProductItemProcessor processor() {
        return new ProductItemProcessor();
    }

    @Bean
    @StepScope
    public ItemWriter<Product> writer() {
        return new ProductItemWriter();
    }



    @Bean
    public Job importUserJob(JobRepository jobRepository, Step step1, JobCompletionNotificationListener listener, ReaderResetListener readerResetListener) {
        return new JobBuilder("importUserJob", jobRepository)
                .listener(listener)
                .start(step1)
                .build();
    }

    @Bean
    public Step step1(JobRepository jobRepository, DataSourceTransactionManager transactionManager,
                      ItemReader<Product> reader, ItemProcessor<Product, Product> processor, ItemWriter<Product> writer) {
        return new StepBuilder("step1", jobRepository)
                .<Product, Product>chunk(100, transactionManager)
                .reader(reader)
                .processor(processor)
                .writer(writer)
                .allowStartIfComplete(true)
                .build();
    }
}