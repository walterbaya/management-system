package com.management.management.dto.external;

import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class ProductStockDTO {
    private Long idProduct;
    private Integer soldElements;
}
