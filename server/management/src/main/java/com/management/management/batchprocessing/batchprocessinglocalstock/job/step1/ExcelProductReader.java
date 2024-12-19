package com.management.management.batchprocessing.batchprocessinglocalstock.job.step1;

import com.management.management.model.Product;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.ItemReader;
import org.springframework.stereotype.Component;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Component
public class ExcelProductReader implements ItemReader<Product> {

    private List<Product> productList;
    private int nextProductIndex;
    private static final Logger log = LoggerFactory.getLogger(ExcelProductReader.class);

    private final Path filePath = Paths.get("D:\\Documentos\\GitHub\\palma-store\\server\\management\\src\\main\\resources\\stock ejemplo.xlsx");

    public void resetReader() {
        this.productList = readExcelFile(filePath);  // Recarga el archivo cada vez
        this.nextProductIndex = 0;  // Reinicia el índice de productos;
    }

    public ExcelProductReader() {
        this.productList = readExcelFile(filePath);  // Recarga el archivo cuando se crea una nueva instancia
        this.nextProductIndex = 0;
    }

    @Override
    public Product read() {

        Product nextProduct = null;

        if (nextProductIndex < productList.size()) {
            nextProduct = productList.get(nextProductIndex);
            log.info("Reading " + nextProduct);
            nextProductIndex++;
        }

        return nextProduct;
    }

    private List<Product> readExcelFile(Path filePath) {
        List<Product> products = new ArrayList<>();

        try (FileInputStream fis = new FileInputStream(filePath.toFile());  // Usa filePath como Path
             Workbook workbook = new XSSFWorkbook(fis)) {

            Sheet sheet = workbook.getSheetAt(0);
            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue; // Saltar la cabecera

                // Verificar si la fila está vacía (sin celdas con datos)
                boolean isEmpty = true;
                for (Cell cell : row) {
                    if (cell != null && !getCellValueAsString(cell).isEmpty()) {
                        isEmpty = false;
                        break;  // Si encontramos una celda con valor, la fila no está vacía
                    }
                }

                if (isEmpty) {
                    break;  // Detener la lectura si la fila está vacía
                }

                String articuloString = getCellValueAsString(row.getCell(0)).replace(".0", "");
                Integer articulo = articuloString.isEmpty() ? 0 : Integer.parseInt(articuloString);

                // Si el número de artículo es 0, no se hace nada y se salta a la siguiente fila
                if (articulo == 0) {
                    continue;
                }

                String cuero = getCellValueAsString(row.getCell(1));
                String color = getCellValueAsString(row.getCell(2));
                String precioString = getCellValueAsString(row.getCell(14));
                double precio = precioString.isEmpty() ? 0.0 : Double.parseDouble(precioString);
                String genero = getCellValueAsString(row.getCell(15));
                String tipo = getCellValueAsString(row.getCell(16));

                for (int i = 3; i <= 13; i++) {
                    Cell talleCell = row.getCell(i);
                    if (talleCell != null && talleCell.getCellType() == CellType.NUMERIC) {
                        String stockString = getCellValueAsString(talleCell).replace(".0", "");
                        int stock = stockString.isEmpty() ? 0 : Integer.parseInt(stockString);
                        if (stock > 0) {
                            Product product = new Product();
                            product.setName(articulo);
                            product.setLeatherType(cuero);
                            product.setColor(color);
                            product.setPrice(precio);
                            product.setGender(genero.equals("M"));
                            product.setShoeType(tipo);
                            product.setSize(i + 32);  // El tamaño de calzado es directamente i + 32
                            product.setNumberOfElements(stock);
                            products.add(product);
                        }
                    }
                }
            }
        } catch (IOException e) {
            throw new IllegalStateException("Error reading Excel file: " + filePath.toString(), e);
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
