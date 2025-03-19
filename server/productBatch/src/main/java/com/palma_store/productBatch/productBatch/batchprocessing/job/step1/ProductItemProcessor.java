package com.palma_store.productBatch.productBatch.batchprocessing.job.step1;

import com.management.management.model.Product;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.ItemProcessor;

public class ProductItemProcessor implements ItemProcessor<Product, Product> {

    private static final Logger log = LoggerFactory.getLogger(ProductItemProcessor.class);

    @Override
    public Product process(final Product product) {

        //log.info("Converting (" + product + ") into (" + product + ")");

        return product;
    }

}
