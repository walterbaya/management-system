package com.palma_store.purchase.purchase.model.util;

import com.management.management.model.Product;
import lombok.Getter;
import lombok.Setter;

// Clase auxiliar para agrupar productos
@Getter
@Setter
public class ProductRow {
    private int name;
    private String leatherType;
    private String color;
    private double factoryPrice;
    private double salesPrice;
    private String gender;
    private String shoeType;
    private int[] sizes = new int[11]; // Talles de 35 a 45

    public ProductRow(Product product) {
        this.name = product.getName();
        this.leatherType = product.getLeatherType();
        this.color = product.getColor();
        this.factoryPrice = product.getFactoryPrice();
        this.salesPrice = product.getSalesPrice();
        this.gender = product.getGender() ? "M" : "F";
        this.shoeType = product.getShoeType();
    }

    public void updateSize(int size, int quantity) {
        if (size >= 35 && size <= 45) {
            sizes[size - 35] += quantity; // Actualizar la cantidad para el talle correspondiente
        }
    }
}