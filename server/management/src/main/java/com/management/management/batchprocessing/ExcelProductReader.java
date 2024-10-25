package com.management.management.batchprocessing;

import com.management.management.model.Product;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.batch.item.ItemReader;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class ExcelProductReader implements ItemReader<Product> {

    private List<Product> productList;
    private int nextProductIndex;

    public ExcelProductReader(String filePath) {
        this.productList = readExcelFile(filePath); // Pasamos la ruta del archivo
        this.nextProductIndex = 0;
    }

    @Override
    public Product read() {
        Product nextProduct = null;
        if (nextProductIndex < productList.size()) {
            nextProduct = productList.get(nextProductIndex);
            nextProductIndex++;
        }
        return nextProduct;
    }

    private List<Product> readExcelFile(String filePath) {
        List<Product> products = new ArrayList<>();
        try (FileInputStream fis = new FileInputStream(new File(filePath));
             Workbook workbook = new XSSFWorkbook(fis)) {

            Sheet sheet = workbook.getSheetAt(0);
            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue; // Saltar la cabecera

                String articulo = getCellValueAsString(row.getCell(0));
                String cuero = getCellValueAsString(row.getCell(1));
                String color = getCellValueAsString(row.getCell(2));
                String precioString = getCellValueAsString(row.getCell(13));
                double precio = precioString.isEmpty() ? 0.0 : Double.parseDouble(precioString);
                String genero = getCellValueAsString(row.getCell(14));
                String tipo = getCellValueAsString(row.getCell(15));

                for (int i = 3; i <= 12; i++) {
                    Cell talleCell = row.getCell(i);
                    if (talleCell != null && talleCell.getCellType() == CellType.NUMERIC) {
                        double stock = talleCell.getNumericCellValue();
                        if (stock > 0) {
                            Product product = new Product();
                            product.setName(articulo);
                            product.setLeatherType(cuero);
                            product.setColor(color);
                            product.setPrice(precio);
                            product.setGender(genero.equals("M"));
                            product.setShoeType(tipo);
                            product.setSize((double) (i + 32));
                            product.setNumberOfElements(stock);
                            products.add(product);
                        }
                    }
                }
            }
        } catch (IOException e) {
            throw new IllegalStateException("Error reading Excel file: " + filePath, e);
        }
        return products;
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return "";
        }
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf(cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            default:
                return "";
        }
    }
}