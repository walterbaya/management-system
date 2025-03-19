package com.palma_store.productBatch.productBatch.mapper;


import com.management.management.dto.ProductDto;
import com.management.management.model.Product;

public class ProductMapper {
    public static Product toEntity(ProductDto productDto) {
        Product product = new Product();
        // Convertir ProductDto a Product
        product.setId(productDto.getId());
        product.setName(productDto.getName());
        product.setSize(productDto.getSize());
        product.setColor(productDto.getColor());
        product.setLeatherType(productDto.getLeatherType());
        product.setShoeType(productDto.getShoeType());
        product.setGender(productDto.getGender());
        product.setFactoryPrice(productDto.getFactoryPrice());
        product.setSalesPrice(productDto.getSalesPrice());
        product.setNumberOfElements(productDto.getNumberOfElements());
        product.setInFactory(productDto.getInFactory());
        return product;
    }

    public static ProductDto toDto(Product product) {
        ProductDto productDto = new ProductDto();
        // Convertir Product a ProductDto
        productDto.setId(product.getId());
        productDto.setName(product.getName());
        productDto.setSize(product.getSize());
        productDto.setColor(product.getColor());
        productDto.setLeatherType(product.getLeatherType());
        productDto.setShoeType(product.getShoeType());
        productDto.setGender(product.getGender());
        productDto.setFactoryPrice(product.getFactoryPrice());
        productDto.setSalesPrice(product.getSalesPrice());
        productDto.setNumberOfElements(product.getNumberOfElements());
        productDto.setInFactory(product.getInFactory());
        return productDto;
    }
}
