package com.sales.controller;

import com.sales.constants.SalesConstants;
import com.sales.dto.ResponseDTO;
import com.sales.dto.SaleDTO;
import com.sales.model.Sale;
import com.sales.service.impl.ISaleService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/public/purchase")
@AllArgsConstructor
public class SaleController {

	ISaleService iSaleService;
	
    @GetMapping("/get_facturas")
    public ResponseEntity<List<SaleDTO>> getAllPurchases(){
        List<SaleDTO> allSales = iSaleService.getAllSales();
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(allSales);
    };

    @GetMapping("/get_facturas_between")
    public ResponseEntity<List<SaleDTO>> getPurchasesBetween(@RequestParam("fecha_desde") String firstDate, @RequestParam("fecha_hasta") String endDate) {
        List<SaleDTO> allSalesBetween = iSaleService.getSalesBetweenDates(firstDate, endDate);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(allSalesBetween);
    }


    @PostMapping("/add_purchase")
    public ResponseEntity<ResponseDTO> savePurchase(@RequestBody List<SaleDTO> purchaseList){
        iSaleService.saveSales(purchaseList);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ResponseDTO(SalesConstants.MESSAGE_201, SalesConstants.STATUS_201));


    }

    @GetMapping("/get_excel")
    public ResponseEntity<byte[]> getExcel(
            @RequestParam(value = "fecha_desde", required = false) String fechaDesde,
            @RequestParam(value = "fecha_hasta", required = false) String fechaHasta){
    	
    		return iSaleService.generateExcelReport(fechaDesde, fechaHasta);
    }

}
