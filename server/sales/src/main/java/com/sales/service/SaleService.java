package com.sales.service;

import com.sales.dto.PurchaseDto;
import org.springframework.http.ResponseEntity;

import java.util.List;


public interface SaleService {

    List<PurchaseDto> getAllSales();

    List<PurchaseDto> getSalesBetweenDates(String startDate, String endDate);

    String saveSales(List<PurchaseDto> purchaseList);

    ResponseEntity<byte[]> generateExcelReport(String startDate, String endDate);

}
