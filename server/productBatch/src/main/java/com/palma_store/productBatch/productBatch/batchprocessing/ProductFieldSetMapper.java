package com.palma_store.productBatch.productBatch.batchprocessing;

import com.management.management.model.Product;
import org.springframework.batch.item.file.mapping.FieldSetMapper;
import org.springframework.batch.item.file.transform.FieldSet;


public class ProductFieldSetMapper implements FieldSetMapper<Product> {

    @Override
    public Product mapFieldSet(FieldSet fieldSet) {
        Product product = new Product();
        product.setName(fieldSet.readInt("articulo"));
        product.setLeatherType(fieldSet.readString("cuero"));
        product.setColor(fieldSet.readString("color"));
        product.setSize(fieldSet.readInt("talle"));
        product.setFactoryPrice(fieldSet.readDouble("precio_fabrica"));
        product.setSalesPrice(fieldSet.readDouble("precio_venta"));
        product.setGender(fieldSet.readString("genero").equals("M"));
        product.setShoeType(fieldSet.readString("tipo"));
        product.setNumberOfElements(fieldSet.readInt("stock"));
        return product;
    }
}