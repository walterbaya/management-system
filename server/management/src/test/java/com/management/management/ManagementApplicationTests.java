package com.management.management;

import com.management.management.batchprocessing.job.step1.ExcelProductReader;
import com.management.management.model.Product;
import com.management.management.repository.ProductRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.ArrayList;
import java.util.List;

@SpringBootTest
class ManagementApplicationTests {

	@Autowired
	ProductRepo productRepo;

	@Test
	void contextLoads() {
	}


	@Test
	void createProductReader() {
		List products = new ArrayList<Product>();
		ExcelProductReader excelReader = new ExcelProductReader();

		products.add(excelReader.read());

		assertEquals(1, products.size());
	}

	/*
	@Test
	void readManyProducts() {
		List products = new ArrayList<Product>();
		ExcelProductReader excelReader = new ExcelProductReader();

		for (int i = 0; i < 33; i++) {
			products.add(excelReader.read());
		}

		assertEquals(33, products.size());
	}
	*/

}
