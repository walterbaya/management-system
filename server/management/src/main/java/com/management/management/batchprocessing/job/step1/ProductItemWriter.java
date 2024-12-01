package com.management.management.batchprocessing.job.step1;

import com.management.management.model.Product;
import com.management.management.repository.ProductRepo;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;

public class ProductItemWriter implements ItemWriter<Product> {

    @Autowired
    ProductRepo productRepo;

    @Override
    public void write(Chunk<? extends Product> chunk) throws Exception {
        productRepo.saveAll(chunk);
    }
}
