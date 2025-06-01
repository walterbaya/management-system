package com.sales.mapper;

import com.sales.dto.SaleDto;
import com.sales.model.Sale;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import java.time.ZonedDateTime;

@AllArgsConstructor
@Component
public class SaleMapper {

    public SaleDto toDto(Sale sale) {
        SaleDto saleDto = new SaleDto();
        // Convertir Sale a SaleDto
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
        return saleDto; // Implementa la conversión de Sale a SaleDto
    }

    public Sale toEntity(SaleDto saleDto, ZonedDateTime jdbcTime) {

        Sale sale = new Sale();
        // Convertir SaleDto a Sale
        sale.setColor(saleDto.getColor());
        sale.setName(sale.getName());
        sale.setNumberOfElements(saleDto.getNumberOfElements());
        sale.setEmissionDate(jdbcTime);
        sale.setClientDni(saleDto.getClientDni());
        sale.setClientNameAndSurname(saleDto.getClientNameAndSurname());
        sale.setGender(saleDto.getGender());
        sale.setLeatherType(saleDto.getLeatherType());
        sale.setPrice(saleDto.getPrice());
        sale.setShoeType(saleDto.getShoeType());
        sale.setSize(saleDto.getSize());
        return sale; // Implementa la conversión de SaleDto a Sale
    }

}