package com.palma_store.purchase.purchase.service;

import com.management.management.model.Product;
import com.management.management.model.Purchase;
import com.management.management.service.ExcelUpdateWatcherManager;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;
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

	private String filePathHombre = "D:\\Documentos\\GitHub\\palma-store\\server\\management\\src\\main\\resources\\STOCK HOMBRE.xlsx";
	private String filePathDama = "D:\\Documentos\\GitHub\\palma-store\\server\\management\\src\\main\\resources\\STOCK DAMA.xlsx";
	//private String filePathHombre = "C:\\Users\\walte\\Documents\\GitHub\\palma-store\\server\\management\\src\\main\\resources\\STOCK HOMBRE.xlsx";
	//private String filePathDama = "C:\\Users\\walte\\Documents\\GitHub\\palma-store\\server\\management\\src\\main\\resources\\STOCK DAMA.xlsx";

	
	public synchronized void updateExcelStock(List<Product> products) {
		List<Product> maleProducts = products.stream().filter(Product::getGender)
				.collect(Collectors.toList());

		List<Product> femaleProducts = products.stream().filter(product -> !product.getGender())
				.collect(Collectors.toList());

		updateExcelStockAux(filePathHombre, maleProducts, true);
		updateExcelStockAux(filePathDama, femaleProducts, false);

	}

	private synchronized void updateExcelStockAux(String filePath, List<Product> products, Boolean gender) {
    	if (!excelUpdateWatcherManager.isAppUpdatingFile()) {
            //excelUpdateWatcherManager.setAppUpdatingFile(true);
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
                           if (Objects.equals(currentArticle, product.getName().toString())) {
                               if (isHeaderRow(row)) {
                                   continue;
                               } else if (isFactoryRow(row) || isStoreRow(row)) {
                                   boolean isFactory = isFactoryRow(row);
                                   
                                   //Acá seteamos el valor, hasta entonces ya sabe cual es el articulo que tiene que cambiar
                                   //Ahora faltaria que lo cambie

                                  for (int i = 4; i <= 11; i++) { // Columnas de tallas
                                	   Cell stockCell = row.getCell(i);
                                	   if (stockCell == null) {
                                           stockCell = row.createCell(i);
                                       }
                                       int stock = (int) stockCell.getNumericCellValue();
                                       
                                       Product inSheetProduct = new Product();
                                       inSheetProduct.setName(Integer.parseInt(currentArticle));
                                       inSheetProduct.setLeatherType(getCellValueAsString(row.getCell(2)));
                                       inSheetProduct.setColor(getCellValueAsString(row.getCell(3)));

									   if(gender){
										   inSheetProduct.setSize(i + 35); // Ajustar la talla según la columna
									   }
									   else{
										   if(i != 11){
											   inSheetProduct.setSize(i + 31);
										   }
									   }


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


				try (FileOutputStream fos = new FileOutputStream(filePath)) {
					workbook.write(fos);
				} catch (IOException e) {
					log.error("Error al guardar los cambios en el archivo Excel.", e);
				}

			} catch (FileNotFoundException e) {
				log.error("Error, no se encontro el archivo al intentar actualizar archivos excel desde el sistema.");
				e.printStackTrace();
			} catch (IOException e) {
				log.error("Error de tipo I/O, causado al intentar actualizar archivos excel desde el sistema.");
				e.printStackTrace();
			} finally{
            	//excelUpdateWatcherManager.setAppUpdatingFile(false);
            }
           }
    	}

	public synchronized void updateVentas(List<Purchase> purchases) {
		List<Purchase> maleProducts = purchases.stream().filter(Purchase::getGender)
				.collect(Collectors.toList());

		List<Purchase> femaleProducts = purchases.stream().filter(purchase -> !purchase.getGender())
				.collect(Collectors.toList());

		updateExcelVentasAux(filePathHombre, maleProducts, true);
		updateExcelVentasAux(filePathDama, femaleProducts, false);

	}

	private synchronized void updateExcelVentasAux(String filePath, List<Purchase> purchases, Boolean gender) {
		if (!excelUpdateWatcherManager.isAppUpdatingFile()) {
			//excelUpdateWatcherManager.setAppUpdatingFile(true);
			try (FileInputStream fis = new FileInputStream(filePath);
				 Workbook workbook = new XSSFWorkbook(fis)) {

				// Obtenemos la hoja "VENTAS"
				Sheet sheet = workbook.getSheet("VENTAS");
				if (sheet == null) {
					log.error("La hoja de VENTAS no existe en el archivo.");
					return;
				}

				// Determinamos la última fila ocupada
				int lastRowNum = sheet.getLastRowNum();

				// Agregamos las compras en nuevas filas
				for (Purchase purchase : purchases) {
					Row row = sheet.createRow(++lastRowNum);

					// Configuramos el formato de fecha
					DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
					DateTimeFormatter outputFormatter = DateTimeFormatter.ofPattern("dd-MMM");

					// Convertimos y formateamos la fecha
					String formattedDate = ZonedDateTime
							.parse(purchase.getEmissionDate().toString()) // Parsea la fecha completa
							.toLocalDate() // Extrae solo la parte de la fecha
							.format(outputFormatter); // Formatea la fecha

					// Creamos y llenamos las celdas
					row.createCell(0).setCellValue(formattedDate);
					row.createCell(1).setCellValue(purchase.getName());
					row.createCell(2).setCellValue(purchase.getColor());
					row.createCell(3).setCellValue(purchase.getSize());
					row.createCell(4).setCellValue("Flor");
				}

				// Guardamos los cambios en el archivo
				try (FileOutputStream fos = new FileOutputStream(filePath)) {
					workbook.write(fos);
				}

			} catch (FileNotFoundException e) {
				log.error("No se encontró el archivo al intentar actualizarlo: {}", filePath, e);
			} catch (IOException e) {
				log.error("Error de tipo I/O al intentar actualizar el archivo Excel: {}", filePath, e);
			} finally {
				//excelUpdateWatcherManager.setAppUpdatingFile(false);
			}
		}
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
