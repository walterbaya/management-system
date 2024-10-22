package com.management.management.controller;

import com.management.management.model.Product;
import com.management.management.model.Purchase;
import com.management.management.repository.ProductRepo;
import com.management.management.repository.PurchaseRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/public/purchase")
@RequiredArgsConstructor
public class PurchaseController {

    @Autowired
    PurchaseRepo repo;

    @Autowired
    ProductRepo productRepo;

    @GetMapping("/get_facturas")
    public List<Purchase> getAllFacturas(){
        return repo.findAll();
    };

    // Ruta para obtener facturas entre dos fechas (tu código original)
    @GetMapping("/get_facturas_between")
    public List<Purchase> getPurchasesBetween(@RequestParam("fecha_desde") String firstDate, @RequestParam("fecha_hasta") String endDate) throws ParseException {

        // Crear un formateador para la fecha
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        // Parsear las fechas desde las cadenas
        LocalDate startDate = LocalDate.parse(firstDate, dateFormatter);
        LocalDate endDateLocal = LocalDate.parse(endDate, dateFormatter);

        // Ajustar la hora a las 00:00:00 para el inicio y 23:59:59 para el final
        ZonedDateTime start = startDate.atStartOfDay(ZoneId.of("America/Argentina/Buenos_Aires"));
        ZonedDateTime end = endDateLocal.atTime(23, 59, 59).atZone(ZoneId.of("America/Argentina/Buenos_Aires"));

        // Aquí llamas al repositorio con las fechas ajustadas
        return repo.getPurchasesBetween(start, end);
    }


    @PostMapping("/add_purchase")
    public void savePurchase(@RequestBody List<Purchase> purchaseList){
        purchaseList.forEach(purchase -> {
            ZonedDateTime emissionDate = purchase.getEmissionDate();

            // Extraer día, mes y año
            int day = emissionDate.getDayOfMonth();
            int month = emissionDate.getMonthValue();
            int year = emissionDate.getYear();

            // Obtener la hora actual en Buenos Aires hubo que ajustarlo a 3 horas antes ya que el formato de mysql lo toma como 3 horas despues.
            ZonedDateTime nowInBuenosAires = ZonedDateTime.now(ZoneId.of("America/Argentina/Buenos_Aires")).minusHours(3);

            // Crear un nuevo ZonedDateTime combinando la fecha y la hora actual
            ZonedDateTime newEmissionDate = ZonedDateTime.of(year, month, day, nowInBuenosAires.getHour(),
                    nowInBuenosAires.getMinute(), nowInBuenosAires.getSecond(), nowInBuenosAires.getNano(),
                    ZoneId.of("America/Argentina/Buenos_Aires"));

            // Establecer la nueva fecha de emisión en la entidad Purchase
            purchase.setEmissionDate(newEmissionDate);
        });

        purchaseList.forEach(System.out::println);
        repo.saveAll(purchaseList);

        List<Product> products = new ArrayList<>();

        Map<Integer, Product> productMap = productRepo.findAll().stream().collect(Collectors.toMap(Product::getId, product -> product));

        for (Purchase purchase : purchaseList) {
            Product product = productMap.get(purchase.getIdProduct());
            product.setNumberOfElements(product.getNumberOfElements() - purchase.getNumberOfElements());
            products.add(product);
        }

        productRepo.saveAll(products);
    }

}
