package com.palma_store.productBatch.productBatch.service;

import com.management.management.dto.PurchaseDto;
import org.springframework.http.ResponseEntity;

import java.util.List;


public interface PurchaseService {

    List<PurchaseDto> getAllPurchases();

    List<PurchaseDto> getPurchasesBetween(String firstDate, String endDate);

    String savePurchase(List<PurchaseDto> purchaseList);

    ResponseEntity<byte[]> getExcel(String fechaDesde, String fechaHasta);

}
