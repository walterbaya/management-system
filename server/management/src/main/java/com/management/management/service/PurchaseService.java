package com.management.management.service;

import java.util.List;
import org.springframework.http.ResponseEntity;
import com.management.management.dto.PurchaseDto;

@Deprecated
public interface PurchaseService {

    List<PurchaseDto> getAllPurchases();

    List<PurchaseDto> getPurchasesBetween(String firstDate, String endDate);

    String savePurchase(List<PurchaseDto> purchaseList);

    ResponseEntity<byte[]> getExcel(String fechaDesde, String fechaHasta);

}
