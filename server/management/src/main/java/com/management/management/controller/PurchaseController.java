package com.management.management.controller;

import com.management.management.model.Purchase;
import com.management.management.repository.PurchaseRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("api/public/purchase")
@RequiredArgsConstructor
public class PurchaseController {

    @Autowired
    PurchaseRepo repo;

    @GetMapping("/get_facturas")
    public List<Purchase> getAllFacturas(){
        return repo.findAll();
    };

    // Ruta para obtener facturas entre dos fechas (tu código original)
    @GetMapping("/get_facturas_between/:fecha_desde/:fecha_hasta")
    public List<Purchase> getPurchasesBetween(@Param("fecha_desde") Date firstDate, @Param("fecha_hasta")Date endDate){
        return repo.getPurchasesBetween(firstDate, endDate);
    }

    @PostMapping("/guardar_factura")
    public void savePurchase(Purchase purchase){
        repo.save(purchase);
    }


}
