package com.management.management.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.management.management.dto.ProductDto;
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

    boolean addProduct(ProductDto productDto);
    boolean addProducts(List<ProductDto> products);
    boolean deleteProduct(Long id);

    ProductDto getProduct(int id);
    List<ProductDto> getProducts();
    List<ProductDto> getProductsNotInFactory();

    String guardarJson(List<Map<String, Object>> jsonData);


}
