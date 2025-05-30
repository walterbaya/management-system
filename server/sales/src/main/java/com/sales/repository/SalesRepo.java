package com.sales.repository;

import com.sales.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SalesRepo extends JpaRepository<Sale, Long> {

    List<Sale> findAll();

    Optional<Sale> getSaleById(Long id);

    @Query("SELECT p FROM Sale p WHERE p.emissionDate BETWEEN :fechaDesde AND :fechaHasta")
    List<Sale> getSalesBetween(@Param("fechaDesde") ZonedDateTime firstDate, @Param("fechaHasta") ZonedDateTime secondDate);


}
