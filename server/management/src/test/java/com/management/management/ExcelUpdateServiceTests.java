package com.management.management;

import com.management.management.model.Product;
import com.management.management.model.Purchase;
import com.management.management.repository.ProductRepo;
import com.management.management.service.ExcelUpdateService;
import com.management.management.util.ExcelUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

import static org.junit.jupiter.api.Assertions.assertEquals;


@SpringBootTest
class ExcelUpdateServiceTests {

	@Autowired
	ExcelUpdateService excelUpdateService;

	@Autowired
	ProductRepo productRepo;

	@Test
	void writeBota() {
		List products = new ArrayList<Product>();

		Product bota = new Product();
		bota.setName(1849);
		bota.setShoeType("BOTAS");
		bota.setColor("NEGRO");
		bota.setLeatherType("WANAMA");
		bota.setGender(false); // Assuming 'true' indicates male
		bota.setSize(35); // Example size
		bota.setInFactory(true);
		bota.setNumberOfElements(666); // Example stock quantity

		products.add(bota);

		ExcelUtils excelUtils = new ExcelUtils(false);

		excelUpdateService.updateExcelStock(products);

		// Verify the updated data in the Excel file
		List<Product> updatedProducts = excelUtils.readExcelFile();
		Product updatedBota = null;
		for (Product p : updatedProducts) {
			if (bota.sameProduct(p)			) {
				updatedBota = p;
				break;
			}
		}

		assertEquals(666, updatedBota.getNumberOfElements());
	}

@Test
	void writeAllFemaleBotasProductsData() {
	List<Product> products = productRepo.findProductByGenderAndShoeTypeAndName(false, "botas", 1849);
	List<Product> updatedProducts = new ArrayList<>();

	for (Product p : products) {
			p.setNumberOfElements(11);
			updatedProducts.add(p);
	}

	ExcelUtils excelUtils = new ExcelUtils(false);

	excelUpdateService.updateExcelStock(updatedProducts);

	List<Product> excelProducts = excelUtils.readExcelFile();

	int counter = 0;

	for(Product updatedProduct : updatedProducts){
		for (Product excelProduct : excelProducts) {
			if (updatedProduct.sameProduct(excelProduct)) {
				counter++;
				break;
			}
		}
	}
	assertEquals(counter, updatedProducts.size());
	}


	@Test
	void writeMaleAndFemaleDifferentCategoriesProductsData() {
		List<Product> products = productRepo.findAll();
		List<Product> updatedProducts = new ArrayList<>();

		for (Product p : products) {
			if(Objects.equals(p.getShoeType(), "sandalias")|| Objects.equals(p.getShoeType(), "borcegos")
					|| p.getShoeType().equals("zapatillas") || p.getShoeType().equals("zapatos") || p.getShoeType().equals("zuecos - mocasin")){
				p.setNumberOfElements(1111);
				updatedProducts.add(p);
			}
		}

		ExcelUtils excelUtilsFemale = new ExcelUtils(false);
		ExcelUtils excelUtilsMale = new ExcelUtils(true);

		excelUpdateService.updateExcelStock(updatedProducts);

		List<Product> femaleExcelProducts = excelUtilsFemale.readExcelFile();
		List<Product> maleExcelProducts = excelUtilsMale.readExcelFile();

		int counter = 0;
		for (Product updatedProduct : updatedProducts) {
			if (femaleExcelProducts.stream().anyMatch(p -> p.sameProduct(updatedProduct)) ||
					maleExcelProducts.stream().anyMatch(p -> p.sameProduct(updatedProduct))) {
				counter++;
			}
		}

		assertEquals(counter, updatedProducts.size());
	}


	@Test
	void saleBota() {
		List<Purchase> purchases = new ArrayList<>();

		Purchase bota = new Purchase();
		bota.setName("1849");
		bota.setShoeType("BOTAS");
		bota.setColor("NEGRO");
		bota.setLeatherType("WANAMA");
		bota.setGender(false); // Assuming 'true' indicates male
		bota.setSize(35.0); // Example size
		bota.setNumberOfElements(2); // Example stock quantity


		// Define el formato del DateTimeFormatter
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d/M/yyyy");

		// Parsear la fecha como LocalDate
		LocalDate localDate = LocalDate.parse("18/4/2024", formatter);

		// Convertir LocalDate a ZonedDateTime usando una zona horaria específica
		ZonedDateTime zonedDateTime = localDate.atStartOfDay(ZoneId.of("America/Argentina/Buenos_Aires"));

		// Asignar el ZonedDateTime a la fecha de emisión de bota
		bota.setEmissionDate(zonedDateTime);

		purchases.add(bota);

		excelUpdateService.updateVentas(purchases);
	}

	@Test
	void saleManyZapatos() {

		List<Product> products = productRepo.findAll();
		List<Purchase> purchases = new ArrayList<>();

		for (Product p : products) {
			if(Objects.equals(p.getShoeType(), "sandalias")|| Objects.equals(p.getShoeType(), "borcegos")
					|| p.getShoeType().equals("zapatillas") || p.getShoeType().equals("zapatos") || p.getShoeType().equals("zuecos - mocasin")){

				Purchase purchase = new Purchase();
				purchase.setName(p.getName().toString());
				purchase.setColor(p.getColor());
				purchase.setSize(p.getSize().doubleValue());
				purchase.setGender(p.getGender());

				DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d/M/yyyy");
				int day = ThreadLocalRandom.current().nextInt(1, 29);
				LocalDate localDate = LocalDate.parse(day + "/4/2024", formatter);
				ZonedDateTime zonedDateTime = localDate.atStartOfDay(ZoneId.of("America/Argentina/Buenos_Aires"));
				purchase.setEmissionDate(zonedDateTime);

				purchases.add(purchase);
			}
		}

		// Define el formato del DateTimeFormatter


		excelUpdateService.updateVentas(purchases);
	}
}
