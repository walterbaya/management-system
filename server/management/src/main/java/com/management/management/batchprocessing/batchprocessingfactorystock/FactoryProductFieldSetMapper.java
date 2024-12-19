package com.management.management.batchprocessing.batchprocessingfactorystock;

import com.management.management.model.Product;
import com.management.management.model.ProductInFactory;
import org.springframework.batch.item.file.mapping.FieldSetMapper;
import org.springframework.batch.item.file.transform.FieldSet;


public class FactoryProductFieldSetMapper implements FieldSetMapper<Product> {

    @Override
    public ProductInFactory mapFieldSet(FieldSet fieldSet) {
        ProductInFactory product = new ProductInFactory();
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