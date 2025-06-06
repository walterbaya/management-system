package com.sales.dto.external;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Schema(
        name =  "ProductStockDTO",
        description = "This dto is used for sending how many products were sold and the id of the product"
)
@Data
@AllArgsConstructor
public class ProductStockDTO {

    @Schema(type = "string", description = "id of the product")
    private Long idProduct;

    @Schema(type = "string", description = "quantity of the product sold", example = "10")
    private Integer soldElements;
}
