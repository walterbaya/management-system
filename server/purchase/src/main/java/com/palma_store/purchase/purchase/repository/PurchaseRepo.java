package com.palma_store.purchase.purchase.repository;

import com.management.management.model.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;

@Repository
public interface PurchaseRepo extends JpaRepository<Purchase, Long> {

    List<Purchase> findAll();

    Purchase getPurchaseById(Long id);

    @Query("SELECT p FROM Purchase p WHERE p.emissionDate BETWEEN :fechaDesde AND :fechaHasta")
    List<Purchase> getPurchasesBetween(@Param("fechaDesde") ZonedDateTime firstDate, @Param("fechaHasta") ZonedDateTime secondDate);

}
