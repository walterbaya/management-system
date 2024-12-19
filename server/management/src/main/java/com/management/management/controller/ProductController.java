package com.management.management.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.management.management.model.Product;
import com.management.management.repository.ProductRepo;
import com.management.management.service.shop.ExcelUpdateService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/public/product")
@RequiredArgsConstructor
@Transactional
public class ProductController {

    @Autowired
    ProductRepo repo;

    @Autowired
    ExcelUpdateService excelUpdateService;

    @PostMapping("/add_product")
    public String addProduct(@RequestBody Product product) {
        if (validate(product).equals("ok")) {
            repo.save(product);
            //Actualizamos el Excel
            excelUpdateService.updateExcel(repo.findAll());
        }

        return validate(product);
    }
    // Ruta para obtener todos los artículos (tu código original)

    @GetMapping("/get_products")
    public List<Product> getProducts() {
        return repo.findAll();
    }
    // Ruta para obtener artículo por ID (tu código original)

    @GetMapping("/get_articulo/:id")
    public void getProduct(@Param("id") int id) {

    }

    @PostMapping("/update_catalogue")
    public ResponseEntity<String> guardarJson(@RequestBody List<Map<String, Object>> jsonData) {
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

    // Ruta para registrar varios artículos (tu código original)
    @PostMapping("/add_products")
    public String addProducts(@RequestBody List<Product> products) {

        String res = "ok";

        for (int i = 0; i < products.size(); i++) {
            if (!validate(products.get(i)).equals("ok")) {
                res = validate(products.get(i));
            }
        }

        if (res.equals("ok")) {
            products.forEach(product -> {
                repo.save(product);
            });

            //Actualizamos el Excel
            excelUpdateService.updateExcel(repo.findAll());
        }
        return res;
    }

    @DeleteMapping("/delete_product")
    public void deleteProduct(@RequestParam("id") int id) {
        repo.deleteById(id);

        //Actualizamos el Excel
        excelUpdateService.updateExcel(repo.findAll());
    }

    private String validate(Product product) {
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
