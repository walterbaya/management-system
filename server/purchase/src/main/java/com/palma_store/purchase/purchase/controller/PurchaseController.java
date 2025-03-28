package com.palma_store.purchase.purchase.controller;

import com.palma_store.purchase.purchase.dto.PurchaseDto;
import com.palma_store.purchase.purchase.service.impl.IPurchaseService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/public/purchase")
@AllArgsConstructor
public class PurchaseController {

	IPurchaseService purchaseService;
	
//    @GetMapping("/get_facturas")
//    public List<PurchaseDto> getAllPurchases(){
//        return purchaseService.getAllPurchases();
//    };

//    @GetMapping("/get_facturas_between")
//    public List<PurchaseDto> getPurchasesBetween(@RequestParam("fecha_desde") String firstDate, @RequestParam("fecha_hasta") String endDate) {
//        return purchaseService.getPurchasesBetween(firstDate, endDate);
//    }


//    @PostMapping("/add_purchase")
//    public String savePurchase(@RequestBody List<PurchaseDto> purchaseList){
//        return purchaseService.savePurchase(purchaseList);
//    }


    @GetMapping("/get_excel")
    public ResponseEntity<byte[]> getExcel(
            @RequestParam(value = "fecha_desde", required = false) String fechaDesde,
            @RequestParam(value = "fecha_hasta", required = false) String fechaHasta){
    	
    		return purchaseService.getExcel(fechaDesde, fechaHasta);
    }

}
