package com.management.management.dto.external;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ProductStockDTO {
    private Long idProduct;
    private Integer soldElements;
}
