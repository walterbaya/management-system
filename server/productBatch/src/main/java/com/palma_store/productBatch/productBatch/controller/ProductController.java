package com.palma_store.productBatch.productBatch.controller;

import com.management.management.dto.ProductDto;
import com.management.management.service.impl.IProductService;
import lombok.AllArgsConstructor;
import org.springframework.data.repository.query.Param;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "api/public/product", produces = MediaType.APPLICATION_JSON_VALUE)
@AllArgsConstructor
@Transactional
public class ProductController {

    IProductService iProductService;

    @GetMapping("/get_products")
    public List<ProductDto> getProducts() {
        return iProductService.getProducts();
    }

    @GetMapping("/get_products_not_in_factory")
    public List<ProductDto> getProductsNotInFactory() {
        return iProductService.getProductsNotInFactory();
    }

    @GetMapping("/get_articulo/:id")
    public ProductDto getProduct(@Param("id") Long id) {
        return iProductService.getProduct(id);
    }

    @PostMapping("/update_catalogue")
    public ResponseEntity<String> guardarJson(@RequestBody List<Map<String, Object>> jsonData) {
        return iProductService.guardarJson(jsonData);
    }

    @PostMapping("/add_product")
    public String addProduct(@RequestBody ProductDto productDto) {
        iProductService.addProduct(productDto);
        return "ok";
    }

    @PostMapping("/add_products")
    public String addProducts(@RequestBody List<ProductDto> products) {
        iProductService.addProducts(products);
        return "ok";
    }

    @DeleteMapping("/delete_product")
    public void deleteProduct(@RequestParam("id") Long id) {
        iProductService.deleteProduct(id);
    }

    private String validate(ProductDto product) {
        System.out.println(product);
        if (product.getName() == null) {
            return "Error, se debe ingresar el nombre del articulo";
        }

        if (product.getNumberOfElements() == null || product.getNumberOfElements() <= 0) {
            return "Error, se debe ingresar la cantidad y debe ser mayor a 0";
        }
        if (product.getSize() == null || product.getSize() <= 0) {
            return "Error, se debe ingresar el talle y debe ser mayor a 0";
        }
        if (product.getColor().isEmpty()) {
            return "Error, se debe ingresar el color ";
        }

        return "ok";
    }


}
