package com.sales.service;

import com.sales.dto.SaleDto;
import org.springframework.http.ResponseEntity;

import java.util.List;


public interface SaleService {

    List<SaleDto> getAllSales();

    List<SaleDto> getSalesBetweenDates(String startDate, String endDate);

    String saveSales(List<SaleDto> purchaseList);

    ResponseEntity<byte[]> generateExcelReport(String startDate, String endDate);

}
