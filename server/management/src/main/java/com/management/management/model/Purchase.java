package com.management.management.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "facturas")
public class Purchase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;
    @Column(name = "id_articulo")
    private int idProduct;
    @Column(name = "nombre_articulo")
    private String name;
    @Column(name = "talle")
    private Double size;
    private String color;
    @Column(name = "cuero")
    private String leatherType;
    @Column(name = "tipo")
    private String shoeType;
    //Esto deberia ser un enum por ejemplo
    @Column(name = "genero")
    private Boolean gender;
    @Column(name = "precio")
    private Double price;
    @Column(name = "fecha")
    private Date emissionDate;
    @Column(name = "nombre_y_apellido")
    private String clientNameAndSurname;
    @Column(name = "dni_cliente")
    private String clientDni;
    @Column(name = "cantidad")
    private Double numberOfElements;

}
