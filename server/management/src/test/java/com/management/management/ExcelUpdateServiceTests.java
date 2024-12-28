package com.management.management;

import com.management.management.model.Product;
import com.management.management.repository.ProductRepo;
import com.management.management.service.ExcelUpdateService;
import com.management.management.util.ExcelUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

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
			if(Objects.equals("ZAPATOS", p.getShoeType().toUpperCase())){
				p.setNumberOfElements(17);
				updatedProducts.add(p);
			}
		}


		ExcelUtils excelUtilsFemale = new ExcelUtils(false);
		ExcelUtils excelUtilsMale = new ExcelUtils(true);

		excelUpdateService.updateExcelStock(updatedProducts);

		List<Product> femaleExcelProducts = excelUtilsFemale.readExcelFile();
		List<Product> maleExcelProducts = excelUtilsMale.readExcelFile();

		int counter = 0;

		for(Product updatedProduct : updatedProducts){
			for (Product excelProduct : femaleExcelProducts) {
				if (updatedProduct.sameProduct(excelProduct)) {
					counter++;
					femaleExcelProducts.remove(excelProduct);
				}
			}

			for (Product excelProduct : maleExcelProducts) {
				if (updatedProduct.sameProduct(excelProduct)) {
					counter++;
					femaleExcelProducts.remove(excelProduct);
				}
			}
		}

		assertEquals(0,femaleExcelProducts.size());
		assertEquals(0, maleExcelProducts.size());
		assertEquals(counter, updatedProducts.size());
	}



}
