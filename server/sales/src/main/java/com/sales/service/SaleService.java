package com.sales.service;

import com.sales.dto.SaleDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;


public interface SaleService {

    List<SaleDTO> getAllSales();

    List<SaleDTO> getSalesBetweenDates(String startDate, String endDate);

    String saveSales(List<SaleDTO> salesList);

    ResponseEntity<byte[]> generateExcelReport(String startDate, String endDate);

}
