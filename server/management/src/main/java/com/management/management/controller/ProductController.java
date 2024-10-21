package com.management.management.controller;

import com.management.management.model.Product;
import com.management.management.repository.ProductRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("api/public/product")
@RequiredArgsConstructor
public class ProductController {

    @Autowired
    ProductRepo repo;

    @PostMapping("/add_product")
    public String addProduct(@RequestBody Product product){
        if(validate(product).equals("ok")){
            repo.save(product);
        }
        return validate(product);
    }
    // Ruta para obtener todos los artículos (tu código original)

    @GetMapping("/get_products")
    public List<Product> getProducts(){
        return repo.findAll();
    }
    // Ruta para obtener artículo por ID (tu código original)

    @GetMapping("/get_articulo/:id")
    public void getProduct(@Param("id") int id){

    }

    // Ruta para registrar varios artículos (tu código original)
    @PostMapping("/add_products")
    public String addProducts(@RequestBody List<Product> products){

        String res = "ok";

        for (int i = 0; i < products.size(); i++) {
            if (!validate(products.get(i)).equals("ok")) {
                res = validate(products.get(i));
            }
        }

        if(res.equals("ok")){
            products.forEach(product -> {
              repo.save(product);
            });
        }


        return res;


    }

    @DeleteMapping("/delete_articulo/:id")
    public void deleteProduct(@Param("id") int id){

    }

    private String validate(Product product) {
        System.out.println(product);
        if (product.getName() == null || product.getName().isEmpty()) {
            return "Error, se debe ingresar el nombre del articulo";
        }

        if (product.getNumberOfElements().isNaN() || product.getNumberOfElements() <= 0) {
            return "Error, se debe ingresar la cantidad y debe ser mayor a 0";
        }
        if (product.getSize().isNaN() || product.getSize() <= 0) {
            return "Error, se debe ingresar el talle y debe ser mayor a 0";
        }
        if (product.getColor().isEmpty()) {
            return "Error, se debe ingresar el color ";
        }

        return "ok";
    }


}
