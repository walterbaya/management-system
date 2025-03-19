package com.palma_store.product.product.service;

import com.management.management.dto.ProductDto;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface ProductService {

    void addProduct(ProductDto productDto);
    void addProducts(List<ProductDto> productDtos);
    void deleteProduct(Long id);

    ProductDto getProduct(Long id);
    List<ProductDto> getProducts();
    List<ProductDto> getProductsNotInFactory();

    ResponseEntity<String> guardarJson(List<Map<String, Object>> jsonData);


}
