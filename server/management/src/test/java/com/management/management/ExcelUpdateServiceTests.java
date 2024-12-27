package com.management.management;

import com.management.management.batchprocessing.job.step1.ExcelProductReader;
import com.management.management.model.Product;
import com.management.management.repository.ProductRepo;
import com.management.management.service.ExcelUpdateService;
import com.management.management.util.ExcelUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class ExcelUpdateServiceTests {

	@Autowired
	ExcelUpdateService excelUpdateService;

	@Test
	void writeBotaUppercaseData() {
		List products = new ArrayList<Product>();

		Product bota = new Product();
		bota.setName(1849);
		bota.setShoeType("BOTA");
		bota.setColor("NEGRO");
		bota.setLeatherType("WANAMA");
		bota.setGender(true); // Assuming 'true' indicates male
		bota.setSize(41); // Example size
		bota.setNumberOfElements(10000); // Example stock quantity

		products.add(bota);

		ExcelUtils excelUtils = new ExcelUtils();

		excelUpdateService.updateExcelStock(products);

		List<Product> productsAfterUpdate = excelUtils.readExcelFile();
		Product botaUpdated = productsAfterUpdate.stream()
				.filter(p -> p.getName().equals(bota.getName()) && p.getShoeType().equals(bota.getShoeType()) && p.getColor().equals(bota.getColor()) && p.getLeatherType().equals(bota.getLeatherType()) && p.getGender().equals(bota.getGender()))
				.findFirst().orElseThrow();
		assertEquals(10000, botaUpdated.getNumberOfElements());
	}


}
