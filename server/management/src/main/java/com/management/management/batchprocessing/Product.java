package com.management.management.batchprocessing;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name = "articulos")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "nombre_articulo")
    private String name;

    @Column(name = "talle")
    private Double size;

    @Column(name = "color")
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

    @Column(name = "cantidad")
    private Double numberOfElements;

}
