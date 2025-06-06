package com.management.management.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.management.management.dto.ProductDto;
import com.management.management.dto.external.ProductStockDTO;
import com.management.management.model.Product;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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

    void updateNumberOfElements(List<ProductStockDTO> productStockDTOS);

}
