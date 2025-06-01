package com.sales.dto;

import lombok.Data;

import java.time.ZonedDateTime;

@Data
public class SaleDTO {
	private Long id;
    private ZonedDateTime emissionDate;
    private String clientNameAndSurname;
    private String clientDni;
	private Long idProduct;
    private String name;
    private Double size;
    private String color;
    private String leatherType;
    private String shoeType;
    private Boolean gender;
    private Double price;
    private Integer numberOfElements;
}
