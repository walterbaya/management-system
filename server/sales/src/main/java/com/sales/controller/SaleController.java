package com.sales.controller;

import com.sales.dto.SaleDTO;
import com.sales.service.impl.ISaleService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/public/purchase")
@AllArgsConstructor
public class SaleController {

	ISaleService iSaleService;
	
    @GetMapping("/get_facturas")
    public List<SaleDTO> getAllPurchases(){
        return iSaleService.getAllSales();
    };

    @GetMapping("/get_facturas_between")
    public List<SaleDTO> getPurchasesBetween(@RequestParam("fecha_desde") String firstDate, @RequestParam("fecha_hasta") String endDate) {
        return iSaleService.getSalesBetweenDates(firstDate, endDate);
    }


    @PostMapping("/add_purchase")
    public String savePurchase(@RequestBody List<SaleDTO> purchaseList){
        return iSaleService.saveSales(purchaseList);
    }

    @GetMapping("/get_excel")
    public ResponseEntity<byte[]> getExcel(
            @RequestParam(value = "fecha_desde", required = false) String fechaDesde,
            @RequestParam(value = "fecha_hasta", required = false) String fechaHasta){
    	
    		return iSaleService.generateExcelReport(fechaDesde, fechaHasta);
    }

}
