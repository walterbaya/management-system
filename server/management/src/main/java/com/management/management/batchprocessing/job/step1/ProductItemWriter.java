package com.management.management.batchprocessing.job.step1;

import com.management.management.model.Product;
import com.management.management.repository.ProductRepo;

import java.util.List;

import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;

public class ProductItemWriter implements ItemWriter<Product> {

    @Autowired
    ProductRepo productRepo;

    @Override
    public void write(Chunk<? extends Product> chunk) throws Exception {
        // Obtener los productos del chunk
        List<Product> productList = (List<Product>)chunk.getItems();
        // Comprobar y procesar cada producto
        productList.forEach(product -> {	
            Product existingProduct = productRepo.findProductByAttributes(product.getName(), product.getSize(), product.getColor(), product.getShoeType(), product.getLeatherType(), product.getGender(), product.getInFactory());
            if (existingProduct != null) {
                
            	product.setId(existingProduct.getId());
                // Actualizar solo si algo ha cambiado
                if (!existingProduct.equals(product)) {
                    productRepo.save(product);
                }
            } else {
                // Si no existe, guardarlo como nuevo
                productRepo.save(product);
            }
        });
    }

}
