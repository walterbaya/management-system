package com.management.management.repository;

import com.management.management.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ProductRepo extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE p.inFactory = false")
    List<Product> findAllNotInFactory();

    //delete_articulo
    void deleteById(Long id);

    //get_all_articulos,
    public List<Product> findAll();

    //get_articulo
    Product getProductByName(int name);

    //get_articulo_by_id,
    Product getProductById(Long id);
    
    //find without knowing the id,
    @Query("SELECT p FROM Product p WHERE p.name = :name AND p.size = :size AND p.color = :color AND p.shoeType = :shoeType AND p.leatherType = :leatherType AND p.gender = :gender AND p.inFactory = :inFactory")
    Product findProductByAttributes(
        @Param("name") Integer name,
        @Param("size") Integer size,
        @Param("color") String color,
        @Param("shoeType") String shoeType,
        @Param("leatherType") String leatherType,
        @Param("gender") Boolean gender,
        @Param("inFactory") Boolean inFactory
    );

    List<Product> findProductByGenderAndShoeTypeAndName(Boolean gender, String shoeType, Integer name);

    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.factoryPrice = :factoryPrice WHERE p.name = :name")
    void updateProductPriceByName(@Param("name") Integer name, @Param("factoryPrice") Double price);


    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.numberOfElements = :cantidad WHERE p.id = :id")
    void updateNumberOfElementsById(@Param("id") Long id,
                                   @Param("cantidad") Integer cantidad);


}
