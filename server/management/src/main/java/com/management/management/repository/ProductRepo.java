package com.management.management.repository;

import com.management.management.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepo extends JpaRepository<Product, Long> {

    //delete_articulo
    void deleteById(int id);

    //get_all_articulos,
    public List<Product> findAll();

    //get_articulo
    Product getProductByName(String name);

    //get_articulo_by_id,
    Product getProductById(int id);

/*function get_date() {
  const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }

    console.log(day + "/" + month + "/" + date.getFullYear());
    return date.getFullYear() + "/" + month + "/" + day;
}*/

}
