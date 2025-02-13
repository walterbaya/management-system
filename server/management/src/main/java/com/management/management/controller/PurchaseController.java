package com.management.management.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.management.management.dto.PurchaseDto;
import com.management.management.service.impl.IPurchaseService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("api/public/purchase")
@AllArgsConstructor
public class PurchaseController {

	IPurchaseService purchaseService;
	
    @GetMapping("/get_facturas")
    public List<PurchaseDto> getAllPurchases(){
        return purchaseService.getAllPurchases();
    };

    @GetMapping("/get_facturas_between")
    public List<PurchaseDto> getPurchasesBetween(@RequestParam("fecha_desde") String firstDate, @RequestParam("fecha_hasta") String endDate) {
        return purchaseService.getPurchasesBetween(firstDate, endDate);
    }


    @PostMapping("/add_purchase")
    public String savePurchase(@RequestBody List<PurchaseDto> purchaseList){
        return purchaseService.savePurchase(purchaseList);
    }


    @GetMapping("/get_excel")
    public ResponseEntity<byte[]> getExcel(
            @RequestParam(value = "fecha_desde", required = false) String fechaDesde,
            @RequestParam(value = "fecha_hasta", required = false) String fechaHasta){
    	
    		return purchaseService.getExcel(fechaDesde, fechaHasta);
    }

}
