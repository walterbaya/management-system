package com.sales.service.impl;

import com.sales.config.DateTimeConfig;
import com.sales.dto.SaleDto;
import com.sales.mapper.SaleMapper;
import com.sales.model.Sale;
import com.sales.repository.SalesRepo;
import com.sales.service.SaleService;
import lombok.AllArgsConstructor;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.slf4j.Logger;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
@AllArgsConstructor
public class ISaleService implements SaleService {

    private final DateTimeConfig dateTimeConfig;
    private final SaleMapper saleMapper;

    private final Logger logger = org.slf4j.LoggerFactory.getLogger(ISaleService.class);

    SalesRepo repo;

    public List<SaleDto> getAllSales(){
        return repo.findAll().stream().map(saleMapper::toDto).toList();
    };

    public List<SaleDto> getSalesBetweenDates(String startDate, String endDate) {
        // Crear un formateador para la fecha
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        // Parsear las fechas desde las cadenas
        LocalDate startDateLocal = LocalDate.parse(startDate, dateFormatter);
        LocalDate endDateLocal = LocalDate.parse(endDate, dateFormatter);

        // Ajustar la hora a las 00:00:00 para el inicio y 23:59:59 para el final
        ZonedDateTime start = startDateLocal.atStartOfDay(ZoneId.of("America/Argentina/Buenos_Aires"));
        ZonedDateTime end = endDateLocal.atTime(23, 59, 59).atZone(ZoneId.of("America/Argentina/Buenos_Aires"));

        // Aquí llamas al repositorio con las fechas ajustadas
        return repo.getSalesBetween(start, end).stream().map(saleMapper::toDto).toList();
    }


    @Transactional
    public String saveSales(List<SaleDto> salesList) {
        // Obtengo la hora local corregida según configuración
        ZonedDateTime jdbcTime = ZonedDateTime
                .now(dateTimeConfig.getZone())
                .minus(dateTimeConfig.getMysqlOffset());

        List<Sale> entities = salesList.stream()
                .map(dto -> {

                    logger.info("SaleDto: {}", dto);


                    Sale sale = saleMapper.toEntity(dto, jdbcTime);

                    logger.info("Sale: {}", sale);
                    return sale;
                })
                .toList();

        repo.saveAll(entities);
        return "ok";
    }

    public ResponseEntity<byte[]> generateExcelReport(String startDate, String endDate) {

        // Obtener las facturas desde el servicio
        HashMap<Long, SaleDto> saleByIdProduct = new HashMap<>();

        getSalesBetweenDates(startDate, endDate).forEach(sale -> {
            Long id = sale.getIdProduct();
            if (saleByIdProduct.get(id) == null) {
                saleByIdProduct.put(id, sale);
            } else {
                SaleDto saleDto = saleByIdProduct.get(id);
                saleDto.setNumberOfElements(sale.getNumberOfElements() + saleDto.getNumberOfElements());
                saleByIdProduct.put(id, saleDto);
            }
        });

        List<SaleDto> data = new ArrayList<>(saleByIdProduct.values());

        // Crear un libro de trabajo de Excel
        Workbook workbook = new HSSFWorkbook();
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
        for (SaleDto purchase : data) {
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


}
