package com.management.management.dto;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.ZonedDateTime;

@Data
public class PurchaseDto {
    private String name;
    private Double size;
    private String color;
    private String leatherType;
    private String shoeType;
    private Boolean gender;
    private Double price;
    private ZonedDateTime emissionDate;
    private String clientNameAndSurname;
    private String clientDni;
    private Integer numberOfElements;
}
