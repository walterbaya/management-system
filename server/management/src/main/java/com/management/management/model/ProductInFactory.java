package com.management.management.model;

import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@DiscriminatorValue("true")
@Table(name = "articulos")
@Entity
public class ProductInFactory extends Product{

}
