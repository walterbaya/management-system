package com.management.management.batchprocessing.job.step1;

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
import java.util.Iterator;
import java.util.List;

@Component
public class ExcelProductReader implements ItemReader<Product> {

    private List<Product> productList;
    private int nextProductIndex;
    private static final Logger log = LoggerFactory.getLogger(ExcelProductReader.class);

    public void resetReader() {
        this.productList = readExcelFile(filePathHombre);  // Recarga el archivo cada vez
        this.productList.addAll(readExcelFile(filePathDama));
        this.nextProductIndex = 0;  // Reinicia el índice de productos;
    }

    private final Path filePathHombre = Paths.get("D:\\Documentos\\GitHub\\palma-store\\server\\management\\src\\main\\resources\\STOCK HOMBRE.xlsx");
    private final Path filePathDama = Paths.get("D:\\Documentos\\GitHub\\palma-store\\server\\management\\src\\main\\resources\\STOCK DAMA.xlsx");
    //private final Path filePathHombre = Paths.get("D:\\Documentos\\GitHub\\palma-store\\server\\management\\src\\main\\resources\\STOCK HOMBRE.xlsx");
    //private final Path filePathDama = Paths.get("D:\\Documentos\\GitHub\\palma-store\\server\\management\\src\\main\\resources\\STOCK DAMA.xlsx");
    
    public ExcelProductReader() {
        this.productList = readExcelFile(filePathHombre);
        this.productList.addAll(readExcelFile(filePathDama));
        this.nextProductIndex = 0;
    }

    @Override
    public Product read() {
        Product nextProduct = null;

        if (nextProductIndex < productList.size()) {
            nextProduct = productList.get(nextProductIndex);
            log.info("Reading product: {}", nextProduct);
            nextProductIndex++;
        }

        return nextProduct;
    }

    private List<Product> readExcelFile(Path filePath) {
        List<Product> products = new ArrayList<>();

        try (FileInputStream fis = new FileInputStream(filePath.toFile());
             Workbook workbook = new XSSFWorkbook(fis)) {

            // Obtener el nombre del archivo para determinar el género
            String fileName = filePath.getFileName().toString();
            Boolean gender = fileName.contains("STOCK HOMBRE");

            for (Sheet sheet : workbook) {
                if (sheet.getSheetName().equalsIgnoreCase("VENTAS")) {
                    continue; // Ignorar la hoja de ventas
                }

                // Establecer el tipo de zapato según el nombre de la hoja
                String shoeType = sheet.getSheetName().toLowerCase(); // ejemplo: borcego

                Iterator<Row> rowIterator = sheet.iterator();
                String currentArticle = null;
                int emptyRowCount = 0;

                while (rowIterator.hasNext()) {
                    Row row = rowIterator.next();

                    // Detectar el inicio de un nuevo artículo
                    if (isArticleRow(row)) {
                        String articleCellValue = getCellValueAsString(row.getCell(2));
                        if (articleCellValue != null && articleCellValue.startsWith("ART.")) {
                            currentArticle = articleCellValue.replace("ART.", "").trim();
                        }
                        emptyRowCount = 0; // Reiniciar contador de filas vacías
                        continue;
                    }

                    // Contar filas vacías consecutivas
                    if (isEmptyRow(row)) {
                        emptyRowCount++;
                        if (emptyRowCount >= 10) {
                            break; // Salir del bucle y pasar a la siguiente hoja
                        }
                        continue;
                    } else {
                        emptyRowCount = 0; // Reiniciar contador si la fila no está vacía
                    }

                    // Procesar filas de encabezado, fabrica y tienda
                    if (currentArticle != null) {
                        if (isHeaderRow(row)) {
                            continue;
                        } else if (isFactoryRow(row) || isStoreRow(row)) {
                            boolean isFactory = isFactoryRow(row);

                            for (int i = 4; i <= 11; i++) { // Columnas de tallas (39 a 46)
                                Cell stockCell = row.getCell(i);
                                if (stockCell != null && stockCell.getCellType() == CellType.NUMERIC) {
                                    int stock = (int) stockCell.getNumericCellValue();

                                    if (stock > 0) {
                                       
                                    	Product product = new Product();

                                        product.setName(Integer.parseInt(currentArticle));
                                        product.setLeatherType(getCellValueAsString(row.getCell(2)));
                                        product.setColor(getCellValueAsString(row.getCell(3)));
                                        if(gender){
                                            product.setSize(i + 35); // Ajustar la talla según la columna
                                        }
                                        else{
                                            if(i != 11){
                                                product.setSize(i + 31);
                                            }
                                        }
                                        product.setNumberOfElements(stock);

                                        // Agregar shoeType y gender
                                        product.setShoeType(shoeType);  // Tipo de zapato (nombre de la hoja)
                                        product.setGender(gender);  // 1 para hombre, 0 para mujer
                                        product.setInFactory(isFactory);
                                        products.add(product);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } catch (IOException e) {
            throw new IllegalStateException("Error reading Excel file: " + filePath.toString(), e);
        }

        return products;
    }



    private boolean isArticleRow(Row row) {
        Cell cell = row.getCell(2);
        return cell != null && cell.getCellType() == CellType.STRING && cell.getStringCellValue().startsWith("ART.");
    }

    private boolean isHeaderRow(Row row) {
        Cell cell = row.getCell(1);
        return cell != null && cell.getCellType() == CellType.STRING && cell.getStringCellValue().equalsIgnoreCase("CUERO");
    }

    private boolean isFactoryRow(Row row) {
        Cell cell = row.getCell(1);
        return cell != null && cell.getCellType() == CellType.STRING && cell.getStringCellValue().equalsIgnoreCase("FABRICA");
    }

    private boolean isStoreRow(Row row) {
        Cell cell = row.getCell(1);
        return cell != null && cell.getCellType() == CellType.STRING && cell.getStringCellValue().equalsIgnoreCase("TIENDA");
    }

    private boolean isEmptyRow(Row row) {
        for (Cell cell : row) {
            if (cell != null && cell.getCellType() != CellType.BLANK) {
                return false;
            }
        }
        return true;
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return null;
        }
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf((int) cell.getNumericCellValue());
            default:
                return null;
        }
    }
}