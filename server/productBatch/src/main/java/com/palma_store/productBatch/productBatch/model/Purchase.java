package com.palma_store.productBatch.productBatch.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.ZonedDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name = "facturas")
public class Purchase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "id_articulo")
    private Long idProduct;
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
    private ZonedDateTime emissionDate;
    @Column(name = "nombre_y_apellido")
    private String clientNameAndSurname;
    @Column(name = "dni_cliente")
    private String clientDni;
    @Column(name = "cantidad")
    private Integer numberOfElements;

}
