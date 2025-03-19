package com.palma_store.product.product.service.impl;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.management.management.dto.ProductDto;
import com.management.management.mapper.ProductMapper;
import com.management.management.model.Product;
import com.management.management.repository.ProductRepo;
import com.management.management.service.ExcelUpdateService;
import com.management.management.service.ExcelUpdateWatcherManager;
import com.management.management.service.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@AllArgsConstructor
@Service
public class IProductService implements ProductService {


    ProductRepo repo;
    ExcelUpdateService excelUpdateService;
    ExcelUpdateWatcherManager excelUpdateWatcherManager;

    @Override
    public void addProduct(ProductDto productDto) {
        Product product = ProductMapper.toEntity(productDto);
        boolean isValid = validate(product);

        if (isValid) {
            repo.save(product);
            //Actualizamos el Excel
            excelUpdateWatcherManager.setAppUpdatingFile(true);
            excelUpdateService.updateExcelStock(repo.findAll());
            excelUpdateWatcherManager.setAppUpdatingFile(false);
        }
    }

    @Override
    public void addProducts(List<ProductDto> productDtos) {

        boolean res = false;
        List<Product> products = productDtos.stream().map(ProductMapper::toEntity).toList();

        for (int i = 0; i < products.size(); i++) {
            if (!validate(products.get(i))) {
                res = validate(products.get(i));
            }
        }

        if (res) {
            repo.saveAll(products);
            //Actualizamos el Excel
            excelUpdateWatcherManager.setAppUpdatingFile(true);
            excelUpdateService.updateExcelStock(repo.findAll());
            excelUpdateWatcherManager.setAppUpdatingFile(false);
        }
    }

    @Override
    public void deleteProduct(Long id) {
        repo.deleteById(id);

        //Actualizamos el Excel
        excelUpdateWatcherManager.setAppUpdatingFile(true);
        excelUpdateService.updateExcelStock(repo.findAll());
        excelUpdateWatcherManager.setAppUpdatingFile(false);
    }

    @Override
    public ProductDto getProduct(Long id) {
        return repo.findById(id)
                .map(ProductMapper::toDto)
                .orElseThrow(() -> new NoSuchElementException("Producto con id " + id + " not found"));
    }

    @Override
    public List<ProductDto> getProducts() {
        return repo.findAll().stream().map(ProductMapper::toDto).toList();
    }

    @Override
    public List<ProductDto> getProductsNotInFactory() {
        return repo.findAllNotInFactory().stream().map(ProductMapper::toDto).toList();
    }


    //Hay que repensar en esto, pero por ahora lo dejamos asi.
    @Override
    public ResponseEntity<String> guardarJson(List<Map<String, Object>> jsonData) {

        try {
            // Verifica si la carpeta 'uploads' existe, si no, la crea
            Path uploadPath = Paths.get("uploads");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Ruta donde se guardará el archivo JSON
            Path filePath = uploadPath.resolve("articulos.json");

            // Guardar el archivo JSON
            String jsonContent = new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(jsonData);
            Files.write(filePath, jsonContent.getBytes());

            // Respuesta de éxito
            return ResponseEntity.ok("Archivo JSON guardado exitosamente en el servidor");

        } catch (IOException e) {
            // Manejo de errores al guardar el archivo
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al guardar el archivo");
        }
    }

    private boolean validate(Product product) {
        if (product.getName() == null) {
            return false;
        }

        if (product.getNumberOfElements() == null || product.getNumberOfElements() <= 0) {
            return false;
        }
        if (product.getSize() == null || product.getSize() <= 0) {
            return false;
        }
        if (product.getColor().isEmpty()) {
            return false;
        }

        return true;
    }


}
