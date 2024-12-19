package com.management.management.batchprocessing.batchprocessingfactorystock.step1;

import com.management.management.model.Product;
import com.management.management.model.ProductInFactory;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.ItemReader;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Component
public class ExcelFactoryProductReader implements ItemReader<Product> {

    private List<ProductInFactory> productList;
    private int nextProductIndex;
    private static final Logger log = LoggerFactory.getLogger(ExcelFactoryProductReader.class);

    private final String filePath = "D:\\Documentos\\GitHub\\palma-store\\server\\management\\src\\main\\resources\\stock ejemplo2.xlsx";

    public void resetReader() {
        this.productList = readExcelFile(filePath);  // Recarga el archivo cada vez
        this.nextProductIndex = 0;  // Reinicia el índice de productos;
    }

    public ExcelFactoryProductReader() {
        this.productList = readExcelFile(filePath);  // Recarga el archivo cuando se crea una nueva instancia
        this.nextProductIndex = 0;
    }

    @Override
    public Product read() {

        ProductInFactory nextProduct = null;

        if (nextProductIndex < productList.size()) {
            nextProduct = productList.get(nextProductIndex);
            log.info("Reading " + nextProduct);
            nextProductIndex++;
        }

        return nextProduct;
    }



    public List<ProductInFactory> readExcelFile(String filePath) {
        List<ProductInFactory> productList = new ArrayList<>();

        try (FileInputStream fis = new FileInputStream(new File(filePath));
             Workbook workbook = new XSSFWorkbook(fis)) {

            for (Sheet sheet : workbook) {
                String shoeType = sheet.getSheetName();

                Iterator<Row> rowIterator = sheet.iterator();
                while (rowIterator.hasNext()) {
                    Row row = rowIterator.next();

                    // Skip irrelevant rows based on known structure
                    if (row.getCell(2) == null || row.getCell(2).getCellType() != CellType.STRING) {
                        continue;
                    }

                    String article = row.getCell(2).getStringCellValue();
                    if (!article.startsWith("ART.")) {
                        continue;
                    }

                    // Extract the article number
                    String articleNumberStr = article.replace("ART.", "").trim();
                    int articleNumber;
                    try {
                        articleNumber = Integer.parseInt(articleNumberStr);
                    } catch (NumberFormatException e) {
                        // Skip rows with invalid article numbers
                        continue;
                    }

                    // Extract product details from subsequent rows
                    while (rowIterator.hasNext()) {
                        row = rowIterator.next();
                        if (row.getCell(1) != null && row.getCell(1).getCellType() == CellType.STRING
                                && row.getCell(1).getStringCellValue().equalsIgnoreCase("CUERO")) {
                            String leatherType = row.getCell(2).getStringCellValue();
                            String color = row.getCell(3).getStringCellValue();

                            for (int col = 4; col < row.getLastCellNum(); col++) {
                                if (row.getCell(col) != null && row.getCell(col).getCellType() == CellType.NUMERIC) {
                                    int size = (int) sheet.getRow(1).getCell(col).getNumericCellValue();
                                    int quantity = (int) row.getCell(col).getNumericCellValue();

                                    if (quantity > 0) {
                                        ProductInFactory product = new ProductInFactory();
                                        product.setName(articleNumber);
                                        product.setLeatherType(leatherType);
                                        product.setColor(color);
                                        product.setSize(size);
                                        product.setNumberOfElements(quantity);
                                        product.setShoeType(shoeType);

                                        productList.add(product);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return productList;
    }
}
