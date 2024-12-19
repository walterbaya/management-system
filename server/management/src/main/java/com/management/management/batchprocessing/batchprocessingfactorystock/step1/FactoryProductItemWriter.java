package com.management.management.batchprocessing.batchprocessingfactorystock.step1;

import com.management.management.model.ProductInFactory;
import com.management.management.repository.ProductRepo;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class FactoryProductItemWriter implements ItemWriter<ProductInFactory> {

    @Autowired
    ProductRepo productRepo;

    @Override
    public void write(Chunk<? extends ProductInFactory> chunk) throws Exception {
        // Obtener los productos del chunk
        List<ProductInFactory> productList = (List<ProductInFactory>)chunk.getItems();

        // Comprobar y procesar cada producto
        productList.forEach(product -> {
            ProductInFactory existingProduct = (ProductInFactory) productRepo.findProductByAttributes(product.getName(), product.getSize(), product.getColor(), product.getShoeType(), product.getLeatherType(), product.getGender());
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
