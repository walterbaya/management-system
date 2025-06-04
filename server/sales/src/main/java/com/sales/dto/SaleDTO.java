package com.sales.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.ZonedDateTime;

@Data
@Schema(
        name = "facturas",
        description = "Schema to hold Sales information"
)
public class SaleDTO {
	private Long id;

    @NotEmpty(message = "Emission date cannot be a null or empty")
    @Schema(type = "string", format = "date-time", example = "2022-11-10T20:00:00Z")
    private ZonedDateTime emissionDate;

    @Schema(type = "string", example = "John Doe")
    private String clientNameAndSurname;

    @Schema(type = "string", example = "12345678")
    @NotEmpty(message = "Client dni cannot be a null or empty")
    @Pattern(regexp="(^$|[0-9]{2}\\.[0-9]{3}\\.[0-9]{3})",message = "Client DNI must have the format XX.XXX.XXX")
    private String clientDni;

    @NotEmpty(message = "Id product cannot be a null or empty")
	private Long idProduct;

    @Schema(type = "string", example = "1234")
    @NotEmpty(message = "Name cannot be a null or empty")
    @Size(min = 1, max = 10, message = "The length of the product name should be between 5 and 30")
    private String name;

    @Schema(type = "string", example = "10")
    @NotEmpty(message = "Size cannot be a null or empty")
    @PositiveOrZero(message = "Size used should be equal or greater than zero")
    private Double size;

    @Schema(type = "string", example = "Negro")
    @NotEmpty(message = "Color cannot be a null or empty")
    private String color;

    @Schema(type = "string", example = "Wanama")
    @NotEmpty(message = "Leather type cannot be a null or empty")
    private String leatherType;

    @Schema(type = "string", example = "Bota")
    @NotEmpty(message = "Shoe type cannot be a null or empty")
    private String shoeType;

    @Schema(type = "string", example = "true", description = "true for male, false for female")
    @NotEmpty(message = "Gender cannot be a null or empty")
    private Boolean gender;

    @Schema(type = "string", example = "1000")
    @NotEmpty(message = "Price cannot be a null or empty")
    @Min(value = 0, message = "The price should be at least 0")
    private Double price;

    @Schema(type = "string", example = "5")
    @NotEmpty(message = "Number of elements cannot be a null or empty")
    @Min(value = 1, message = "The number of elements should be at least 1")
    private Integer numberOfElements;
}
