package com.management.management.batchprocessing.job.step1;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.ItemProcessor;
import com.management.management.model.Product;

public class ProductItemProcessor implements ItemProcessor<Product, Product> {

    private static final Logger log = LoggerFactory.getLogger(ProductItemProcessor.class);

    @Override
    public Product process(final Product product) {

        //log.info("Converting (" + product + ") into (" + product + ")");

        return product;
    }

}
