package com.sales.mapper;

import com.sales.dto.SaleDTO;
import com.sales.model.Sale;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@AllArgsConstructor
@Component
public class SaleMapper {

    public SaleDTO toDto(Sale sale) {
        SaleDTO saleDto = new SaleDTO();
        // Convertir Sale a SaleDTO
        saleDto.setId(sale.getId());
        saleDto.setIdProduct(sale.getIdProduct());
        saleDto.setColor(sale.getColor());
        saleDto.setName(sale.getName());
        saleDto.setNumberOfElements(sale.getNumberOfElements());
        saleDto.setEmissionDate(sale.getEmissionDate());
        saleDto.setClientDni(sale.getClientDni());
        saleDto.setClientNameAndSurname(sale.getClientNameAndSurname());
        saleDto.setGender(sale.getGender());
        saleDto.setLeatherType(sale.getLeatherType());
        saleDto.setPrice(sale.getPrice());
        saleDto.setShoeType(sale.getShoeType());
        saleDto.setSize(sale.getSize());
        return saleDto; // Implementa la conversión de Sale a SaleDTO
    }

    public Sale toEntity(SaleDTO saleDto, LocalDateTime jdbcTime) {

        Sale sale = new Sale();
        // Convertir SaleDTO a Sale
        sale.setId(saleDto.getId());
        sale.setIdProduct(saleDto.getIdProduct());
        sale.setColor(saleDto.getColor());
        sale.setName(saleDto.getName());
        sale.setNumberOfElements(saleDto.getNumberOfElements());
        sale.setEmissionDate(jdbcTime);
        sale.setClientDni(saleDto.getClientDni());
        sale.setClientNameAndSurname(saleDto.getClientNameAndSurname());
        sale.setGender(saleDto.getGender());
        sale.setLeatherType(saleDto.getLeatherType());
        sale.setPrice(saleDto.getPrice());
        sale.setShoeType(saleDto.getShoeType());
        sale.setSize(saleDto.getSize());
        return sale; // Implementa la conversión de SaleDTO a Sale
    }

}