package com.management.management.repository;

import com.management.management.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepo extends JpaRepository<Product, Long> {
    List<Product>

    //get_all_articulos,
    //get_articulo,
    //get_articulo_by_id,
    //create_articulo,
    //delete_articulo,


}
