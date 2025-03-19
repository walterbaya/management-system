package com.palma_store.productBatch.productBatch.service.impl;

import com.management.management.dto.PurchaseDto;
import com.management.management.mapper.PurchaseMapper;
import com.management.management.model.Product;
import com.management.management.repository.ProductRepo;
import com.management.management.repository.PurchaseRepo;
import com.management.management.service.ExcelUpdateService;
import com.management.management.service.ExcelUpdateWatcherManager;
import com.management.management.service.PurchaseService;
import lombok.AllArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class IPurchaseService implements PurchaseService{
	
    PurchaseRepo repo;

    ProductRepo productRepo;

    ExcelUpdateService excelUpdateService;

    ExcelUpdateWatcherManager  excelUpdateWatcherManager;

    public List<PurchaseDto> getAllPurchases(){
        return repo.findAll().stream().map(PurchaseMapper::toDto).toList();
    };

    public List<PurchaseDto> getPurchasesBetween(String firstDate, String endDate) {
        return getPurchasesBetweenAux(firstDate, endDate);
    }

    public String savePurchase(List<PurchaseDto> purchaseList){
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

        repo.saveAll(purchaseList.stream().map(PurchaseMapper::toEntity).toList());

        List<Product> products = new ArrayList<>();

        Map<Long, Product> productMap = productRepo.findAll().stream().collect(Collectors.toMap(Product::getId, product -> product));

        for (PurchaseDto purchase : purchaseList) {
            Product product = productMap.get(purchase.getIdProduct());
            product.setNumberOfElements(product.getNumberOfElements() - purchase.getNumberOfElements());
            products.add(product);
        }

        productRepo.saveAll(products);

        excelUpdateWatcherManager.setAppUpdatingFile(true);
        excelUpdateService.updateExcelStock(productRepo.findAll());
        excelUpdateService.updateVentas(purchaseList.stream().map(PurchaseMapper::toEntity).toList());
        excelUpdateWatcherManager.setAppUpdatingFile(false);

        return "ok";
    }


    public ResponseEntity<byte[]> getExcel(String fechaDesde, String fechaHasta) {

        // Obtener las facturas desde el servicio
        HashMap<Long, PurchaseDto> dataMap = new HashMap<>();

        getPurchasesBetweenAux(fechaDesde, fechaHasta).forEach(purchase -> {
            Long id = purchase.getIdProduct();
            if (dataMap.get(id) == null) {
                dataMap.put(id, purchase);
            } else {
                PurchaseDto p = dataMap.get(id);
                p.setNumberOfElements(purchase.getNumberOfElements() + p.getNumberOfElements());
                dataMap.put(id, p);
            }
        });

        List<PurchaseDto> data = new ArrayList<>(dataMap.values());

        // Crear un libro de trabajo de Excel
        Workbook workbook = new XSSFWorkbook();
        var sheet = workbook.createSheet("Facturas");

        // Crear estilo para encabezados de columna
        CellStyle headerStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerFont.setColor(IndexedColors.WHITE.getIndex()); // Texto blanco
        headerStyle.setFont(headerFont);

        // Establecer color de fondo azul para el encabezado
        headerStyle.setFillForegroundColor(IndexedColors.BLUE.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        // Crear encabezados de columna con el nuevo estilo
        var headerRow = sheet.createRow(0);
        String[] columnHeaders = {"Nombre Artículo", "Tipo", "Género", "Talle", "Color", "Cuero", "Cantidad", "Fecha"}; // Ajusta los encabezados
        for (int i = 0; i < columnHeaders.length; i++) {
            var cell = headerRow.createCell(i);
            cell.setCellValue(columnHeaders[i]);
            cell.setCellStyle(headerStyle); // Aplicar el estilo a las celdas de encabezado
        }

        // Llenar la hoja de trabajo con los datos
        int rowNum = 1;
        for (PurchaseDto purchase : data) {
            var excelRow = sheet.createRow(rowNum++);
            excelRow.createCell(0).setCellValue(purchase.getName());
            excelRow.createCell(1).setCellValue(purchase.getShoeType());

            String gender = purchase.getGender() ?  "Hombre" : "Dama";

            excelRow.createCell(2).setCellValue(gender);
            excelRow.createCell(3).setCellValue(purchase.getSize());
            excelRow.createCell(4).setCellValue(purchase.getColor());
            excelRow.createCell(5).setCellValue(purchase.getLeatherType());
            excelRow.createCell(6).setCellValue(purchase.getNumberOfElements());
            excelRow.createCell(7).setCellValue(purchase.getEmissionDate().toString().substring(0,10));
        }

        // Ajustar el ancho de las columnas automáticamente
        for (int i = 0; i < columnHeaders.length; i++) {
            sheet.autoSizeColumn(i); // Ajustar el tamaño de cada columna según el contenido
        }

        // Escribir el archivo a un flujo de salida
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            workbook.write(outputStream);
            workbook.close();
            byte[] bytes = outputStream.toByteArray();

            // Establecer los encabezados de respuesta
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=archivo.xlsx");
            headers.add(HttpHeaders.CONTENT_TYPE, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

            return new ResponseEntity<>(bytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            // Manejo de errores
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    private List<PurchaseDto> getPurchasesBetweenAux(String firstDate, String endDate) {

        // Crear un formateador para la fecha
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        // Parsear las fechas desde las cadenas
        LocalDate startDate = LocalDate.parse(firstDate, dateFormatter);
        LocalDate endDateLocal = LocalDate.parse(endDate, dateFormatter);

        // Ajustar la hora a las 00:00:00 para el inicio y 23:59:59 para el final
        ZonedDateTime start = startDate.atStartOfDay(ZoneId.of("America/Argentina/Buenos_Aires"));
        ZonedDateTime end = endDateLocal.atTime(23, 59, 59).atZone(ZoneId.of("America/Argentina/Buenos_Aires"));

        // Aquí llamas al repositorio con las fechas ajustadas
        return repo.getPurchasesBetween(start, end).stream().map(PurchaseMapper::toDto).toList();
    }
}
