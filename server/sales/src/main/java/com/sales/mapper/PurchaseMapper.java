package com.sales.mapper;

import com.sales.dto.PurchaseDto;
import com.sales.model.Sale;

public class PurchaseMapper {
    public static PurchaseDto toDto(Sale sale) {
        PurchaseDto purchaseDto = new PurchaseDto();
        // Convertir Sale a PurchaseDto
        purchaseDto.setColor(sale.getColor());
        purchaseDto.setEmissionDate(sale.getEmissionDate());
        purchaseDto.setClientDni(sale.getClientDni());
        purchaseDto.setClientNameAndSurname(sale.getClientNameAndSurname());
        purchaseDto.setGender(sale.getGender());
        purchaseDto.setLeatherType(sale.getLeatherType());
        purchaseDto.setPrice(sale.getPrice());
        purchaseDto.setShoeType(sale.getShoeType());
        purchaseDto.setSize(sale.getSize());
        return purchaseDto; // Implementa la conversión de Sale a PurchaseDto
    }

    public static Sale toEntity(PurchaseDto purchaseDto) {
        Sale sale = new Sale();
        // Convertir PurchaseDto a Sale
        sale.setColor(purchaseDto.getColor());
        sale.setEmissionDate(purchaseDto.getEmissionDate());
        sale.setClientDni(purchaseDto.getClientDni());
        sale.setClientNameAndSurname(purchaseDto.getClientNameAndSurname());
        sale.setGender(purchaseDto.getGender());
        sale.setLeatherType(purchaseDto.getLeatherType());
        sale.setPrice(purchaseDto.getPrice());
        sale.setShoeType(purchaseDto.getShoeType());
        sale.setSize(purchaseDto.getSize());
        return sale; // Implementa la conversión de PurchaseDto a Sale
    }

}