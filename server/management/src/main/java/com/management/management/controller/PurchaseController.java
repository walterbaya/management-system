package com.management.management.controller;

import com.management.management.model.Product;
import com.management.management.model.Purchase;
import com.management.management.repository.ProductRepo;
import com.management.management.repository.PurchaseRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/public/purchase")
@RequiredArgsConstructor
public class PurchaseController {

    @Autowired
    PurchaseRepo repo;

    @Autowired
    ProductRepo productRepo;

    @GetMapping("/get_facturas")
    public List<Purchase> getAllFacturas(){
        return repo.findAll();
    };

    // Ruta para obtener facturas entre dos fechas (tu código original)
    @GetMapping("/get_facturas_between/:fecha_desde/:fecha_hasta")
    public List<Purchase> getPurchasesBetween(@Param("fecha_desde") Date firstDate, @Param("fecha_hasta")Date endDate){
        return repo.getPurchasesBetween(firstDate, endDate);
    }

    @PostMapping("/add_purchase")
    public void savePurchase(@RequestBody List<Purchase> purchaseList){
        repo.saveAll(purchaseList);

        List<Product> products = new ArrayList<>();

        Map<Integer, Product> productMap = productRepo.findAll().stream().collect(Collectors.toMap(Product::getId, product -> product));

        for (Purchase purchase : purchaseList) {
            Product product = productMap.get(purchase.getIdProduct());
            product.setNumberOfElements(product.getNumberOfElements() - purchase.getNumberOfElements());
            products.add(product);
        }

        productRepo.saveAll(products);
    }

}
