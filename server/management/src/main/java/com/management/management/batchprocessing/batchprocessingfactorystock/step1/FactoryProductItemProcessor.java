package com.management.management.batchprocessing.batchprocessingfactorystock.step1;

import com.management.management.model.Product;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.ItemProcessor;

public class FactoryProductItemProcessor implements ItemProcessor<Product, Product> {

    private static final Logger log = LoggerFactory.getLogger(FactoryProductItemProcessor.class);

    @Override
    public Product process(final Product product) {

        log.info("Converting product from factory stock (" + product + ") into (" + product + ")");

        return product;
    }

}
