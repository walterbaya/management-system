package com.management.management.batchprocessing.batchprocessinglocalstock;

import org.springframework.batch.item.file.mapping.FieldSetMapper;
import org.springframework.batch.item.file.transform.FieldSet;
import com.management.management.model.Product;


public class ProductFieldSetMapper implements FieldSetMapper<Product> {

    @Override
    public Product mapFieldSet(FieldSet fieldSet) {
        Product product = new Product();
        product.setName(fieldSet.readInt("articulo"));
        product.setLeatherType(fieldSet.readString("cuero"));
        product.setColor(fieldSet.readString("color"));
        product.setSize(fieldSet.readInt("talle"));
        product.setPrice(fieldSet.readDouble("precio"));
        product.setGender(fieldSet.readString("genero").equals("M"));
        product.setShoeType(fieldSet.readString("tipo"));
        product.setNumberOfElements(fieldSet.readInt("stock"));
        return product;
    }
}