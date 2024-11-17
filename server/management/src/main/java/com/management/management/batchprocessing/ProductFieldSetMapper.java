package com.management.management.batchprocessing;

import org.springframework.batch.item.file.mapping.FieldSetMapper;
import org.springframework.batch.item.file.transform.FieldSet;
import com.management.management.model.Product;


public class ProductFieldSetMapper implements FieldSetMapper<Product> {

    @Override
    public Product mapFieldSet(FieldSet fieldSet) {
        Product product = new Product();
        product.setName(fieldSet.readString("articulo"));
        product.setLeatherType(fieldSet.readString("cuero"));
        product.setColor(fieldSet.readString("color"));
        product.setSize(fieldSet.readDouble("talle"));
        product.setPrice(fieldSet.readDouble("precio"));
        product.setGender(fieldSet.readString("genero").equals("M"));
        product.setShoeType(fieldSet.readString("tipo"));
        product.setNumberOfElements(fieldSet.readDouble("stock"));
        return product;
    }
}