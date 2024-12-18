package com.management.management.service;

import com.management.management.model.Product;
import com.management.management.model.util.ProductRow;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExcelUpdateService {

    private static final Logger log = LoggerFactory.getLogger(ExcelUpdateService.class);

    @Autowired
    ExcelUpdateWatcherManager excelUpdateWatcherManager;

    private String filePath = "D:\\Documentos\\GitHub\\palma-store\\server\\management\\src\\main\\resources\\stock ejemplo.xlsx";

    public synchronized void updateExcel(List<Product> products) {
        // Solo puede actualizar de a una vez
        if (!excelUpdateWatcherManager.isAppUpdatingFile()) {
            excelUpdateWatcherManager.setAppUpdatingFile(true);
            try {
                // Crear un nuevo Workbook (sin leer un archivo existente)
                Workbook workbook = new XSSFWorkbook(); // Se crea un nuevo workbook para sobrescribir el archivo existente
                Sheet sheet = workbook.createSheet("Productos"); // Crear una nueva hoja (o puedes usar un nombre específico)

                // Crear la fila de encabezado
                Row headerRow = sheet.createRow(0);
                headerRow.createCell(0).setCellValue("ARTICULO");
                headerRow.createCell(1).setCellValue("CUERO");
                headerRow.createCell(2).setCellValue("COLOR");
                headerRow.createCell(3).setCellValue("35");
                headerRow.createCell(4).setCellValue("36");
                headerRow.createCell(5).setCellValue("37");
                headerRow.createCell(6).setCellValue("38");
                headerRow.createCell(7).setCellValue("39");
                headerRow.createCell(8).setCellValue("40");
                headerRow.createCell(9).setCellValue("41");
                headerRow.createCell(10).setCellValue("42");
                headerRow.createCell(11).setCellValue("43");
                headerRow.createCell(12).setCellValue("44");
                headerRow.createCell(13).setCellValue("45");
                headerRow.createCell(14).setCellValue("PRECIO");
                headerRow.createCell(15).setCellValue("GENERO");
                headerRow.createCell(16).setCellValue("TIPO");

                // Agrupar productos por combinación única de name, leatherType, color
                Map<String, ProductRow> productMap = new HashMap<>();
                for (Product product : products) {
                    String key = product.getName() + "|" + product.getLeatherType() + "|" + product.getColor();
                    if (!productMap.containsKey(key)) {
                        // Crear un nuevo registro para esta combinación única
                        ProductRow newRow = new ProductRow(product);
                        productMap.put(key, newRow);
                    }
                    // Actualizar la cantidad para el talle específico
                    productMap.get(key).updateSize(product.getSize(), product.getNumberOfElements());
                }

                // Escribir las filas en la hoja
                int rowNum = 1; // Comenzar desde la fila 1 (debido al encabezado)
                for (ProductRow productRow : productMap.values()) {
                    Row row = sheet.createRow(rowNum++);

                    row.createCell(0).setCellValue(productRow.getName());
                    row.createCell(1).setCellValue(productRow.getLeatherType());
                    row.createCell(2).setCellValue(productRow.getColor());
                    for (int i = 0; i < productRow.getSizes().length; i++) {
                        row.createCell(3 + i).setCellValue(productRow.getSizes()[i]);
                    }
                    row.createCell(14).setCellValue(productRow.getPrice());
                    row.createCell(15).setCellValue(productRow.getGender());
                    row.createCell(16).setCellValue(productRow.getShoeType());
                }

                // Sobrescribir el archivo Excel con los nuevos datos
                try (FileOutputStream fos = new FileOutputStream(filePath)) {
                    workbook.write(fos); // Esto sobrescribe el archivo
                }

                log.info("Archivo Excel actualizado correctamente.");

            } catch (IOException e) {
                log.error("Error al procesar el archivo Excel: ", e);
            } finally {
                excelUpdateWatcherManager.setAppUpdatingFile(false); // Restablecer el estado al final
            }
        } else {
            log.warn("El archivo está siendo actualizado por otro proceso. Intente más tarde.");
        }
    }
}
