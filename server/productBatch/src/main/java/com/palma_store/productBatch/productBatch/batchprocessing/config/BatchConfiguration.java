package com.palma_store.productBatch.productBatch.batchprocessing.config;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

import com.palma_store.productBatch.productBatch.batchprocessing.JobCompletionNotificationListener;
import com.palma_store.productBatch.productBatch.batchprocessing.job.step1.ExcelProductReader;
import com.palma_store.productBatch.productBatch.batchprocessing.job.step1.ProductItemProcessor;
import com.palma_store.productBatch.productBatch.batchprocessing.job.step1.ProductItemWriter;
import com.palma_store.productBatch.productBatch.model.Product;


@Configuration
public class BatchConfiguration {

    // PRODUCT
    @Bean
    public ExcelProductReader excelProductReader() {
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

//    // PRODUCT PRICE
//    @Bean(name = "priceReader")
//    @StepScope
//    public ExcelProductPriceReader priceReader() {
//        return new ExcelProductPriceReader();
//    }
//
//    @Bean(name = "priceProcessor")
//    @StepScope
//    public ProductPriceItemProcessor priceProcessor() {
//        return new ProductPriceItemProcessor();
//    }
//
//    @Bean(name = "priceWriter")
//    @StepScope
//    public ItemWriter<ProductPrice> priceWriter() {
//        return new ProductPriceItemWriter();
//    }

    @Bean
    @Primary
    public Job updateProductsJob(JobRepository jobRepository, Step step1, Step step2, JobCompletionNotificationListener listener) {
    	return new JobBuilder("updateProductsJob", jobRepository)
                .listener(listener)
                .start(step1)
                .next(step2)
                .build();
    }

    @Bean
    public Job updatePreciosJob(JobRepository jobRepository, Step step2, JobCompletionNotificationListener listener) {
        return new JobBuilder("updatePreciosJob", jobRepository)
                .listener(listener)
                .start(step2)
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

//    @Bean
//    public Step step2(JobRepository jobRepository, DataSourceTransactionManager transactionManager,
//                      @Qualifier("priceReader") ItemReader<ProductPrice> priceReader,
//                      @Qualifier("priceProcessor") ItemProcessor<ProductPrice, ProductPrice> priceProcessor,
//                      @Qualifier("priceWriter") ItemWriter<ProductPrice> priceWriter) {
//        return new StepBuilder("step2", jobRepository)
//                .<ProductPrice, ProductPrice>chunk(100, transactionManager)
//                .reader(priceReader)
//                .processor(priceProcessor)
//                .writer(priceWriter)
//                .allowStartIfComplete(true)
//                .build();
//    }
}
