package com.management.management.service;

import com.management.management.model.Product;
import com.management.management.model.util.ProductRow;
import lombok.RequiredArgsConstructor;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


//El metodo debe tener una funcion que crea nuevos articulos a partir de la imagen del mismo
//Por ahora cuando hacemos update va a ser unicamente cuando se realicen ventas, el resto del codigo
//queda a manera de sistema de administracion de la empresa palma shoes, que son quienes tienen permiso de administrador
//y van a subir 

@Service
@RequiredArgsConstructor
public class ExcelUpdateService {

	private static final Logger log = LoggerFactory.getLogger(ExcelUpdateService.class);

	@Autowired
	ExcelUpdateWatcherManager excelUpdateWatcherManager;

	private String filePathHombre = "C:\\Users\\walte\\Documents\\GitHub\\palma-store\\server\\management\\src\\main\\resources\\STOCK HOMBRE.xlsx";
	private String filePathDama = "C:\\Users\\walte\\Documents\\GitHub\\palma-store\\server\\management\\src\\main\\resources\\STOCK DAMA.xlsx";

	
	public synchronized void updateExcelStock(List<Product> products) {
		List<Product> maleProducts = products.stream().filter(product -> product.getGender())
				.collect(Collectors.toList());

		List<Product> femaleProducts = products.stream().filter(product -> !product.getGender())
				.collect(Collectors.toList());

		updateExcelStockAux(filePathHombre, maleProducts, true);
		updateExcelStockAux(filePathDama, femaleProducts, false);

	}

	public synchronized void updateExcelStockAux(String filePath, List<Product> products, Boolean gender) {
    	if (!excelUpdateWatcherManager.isAppUpdatingFile()) {
            excelUpdateWatcherManager.setAppUpdatingFile(true);
            try (FileInputStream fis = new FileInputStream(filePath)) {
                
               Workbook workbook = new XSSFWorkbook(fis);
               HashMap<String, Product> productByType = new HashMap();
                
               //Seteamos los productos por tipo
               
               for(Product p: products) {
            	   productByType.put(p.getShoeType(), p);
               }
               
               for(String shoeType: productByType.keySet()) {
                   
            	   //Entramos en la hoja
            	   Sheet sheet = workbook.getSheet(shoeType.toUpperCase());

                   
                   if (sheet == null) {
                       log.error("La hoja " + shoeType.toUpperCase() + " no existe en el archivo.");
                       return;
                   }

                   // Encontramos el producto 
                   for (Product product : products) {
                       boolean updated = false;

                       // Iterar sobre las filas para encontrar el producto

                       
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
                           if (currentArticle != null && currentArticle.equals(product)) {
                               if (isHeaderRow(row)) {
                                   continue;
                               } else if (isFactoryRow(row) || isStoreRow(row)) {
                                   boolean isFactory = isFactoryRow(row);
                                   
                                   //Acá seteamos el valor, hasta entonces ya sabe cual es el articulo que tiene que cambiar
                                   //Ahora faltaria que lo cambie
                                    
                                   

                                  for (int i = 4; i <= 11; i++) { // Columnas de tallas (39 a 46)
                                	   Cell stockCell = row.getCell(i);
                                	   if (stockCell == null) {
                                           stockCell = row.createCell(i);
                                       }
                                       int stock = (int) stockCell.getNumericCellValue();
                                       
                                       Product inSheetProduct = new Product();
                                       inSheetProduct.setName(Integer.parseInt(currentArticle));
                                       inSheetProduct.setLeatherType(getCellValueAsString(row.getCell(2)));
                                       inSheetProduct.setColor(getCellValueAsString(row.getCell(3)));
                                       inSheetProduct.setSize(i + 35); // Ajustar la talla según la columna
                                       inSheetProduct.setNumberOfElements(stock);

                                       inSheetProduct.setShoeType(shoeType);  // Tipo de zapato (nombre de la hoja)
                                       inSheetProduct.setGender(gender);  // 0 para hombre, 1 para mujer
                                       inSheetProduct.setInFactory(isFactory);
                                       
                                       //Solo podemos actualizar la cantidad de elementos pero no mas
                                       //Dado que la fabrica es quien maneja el stock
                                       if (inSheetProduct.sameProduct(product)) {
                                    	   stockCell.setCellValue(product.getNumberOfElements());
                                    	   updated = true;
                                    	   }
                                       }
                                   }
                               }
                           }
                       }
                   }
               } catch (FileNotFoundException e) {
				log.error("Error, no se encontro el archivo al intentar actualizar archivos excel desde el sistema.");
				e.printStackTrace();
			} catch (IOException e) {
				log.error("Error de tipo I/O, causado al intentar actualizar archivos excel desde el sistema.");
				e.printStackTrace();
			}
            finally{
            	excelUpdateWatcherManager.setAppUpdatingFile(false);
            }
           }
    	}

	// Método para encontrar el índice de la columna de un talle específico
	private int getSizeColumnIndex(Sheet sheet, int size) {
		Row headerRow = sheet.getRow(0); // Fila de encabezado
		if (headerRow != null) {
			for (Cell cell : headerRow) {
				if (cell.getCellType() == CellType.NUMERIC && cell.getNumericCellValue() == size) {
					return cell.getColumnIndex();
				}
			}
		}
		return -1; // No se encontró la columna del talle
	}

	private boolean isArticleRow(Row row) {
		Cell cell = row.getCell(2);
		return cell != null && cell.getCellType() == CellType.STRING && cell.getStringCellValue().startsWith("ART.");
	}

	private boolean isHeaderRow(Row row) {
		Cell cell = row.getCell(1);
		return cell != null && cell.getCellType() == CellType.STRING
				&& cell.getStringCellValue().equalsIgnoreCase("CUERO");
	}

	private boolean isFactoryRow(Row row) {
		Cell cell = row.getCell(1);
		return cell != null && cell.getCellType() == CellType.STRING
				&& cell.getStringCellValue().equalsIgnoreCase("FABRICA");
	}

	private boolean isStoreRow(Row row) {
		Cell cell = row.getCell(1);
		return cell != null && cell.getCellType() == CellType.STRING
				&& cell.getStringCellValue().equalsIgnoreCase("TIENDA");
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
