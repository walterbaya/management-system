package com.management.management.dto;

import lombok.Data;

@Data
public class ProductDto {
    private Long id;
    private Integer name;
    private Integer size;
    private String color;
    private String leatherType;
    private String shoeType;
    private Boolean gender;
    private Double factoryPrice;
    private Double salesPrice;
    private Integer numberOfElements;
    private Boolean inFactory;
}
