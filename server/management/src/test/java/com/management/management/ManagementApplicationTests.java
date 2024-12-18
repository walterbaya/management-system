package com.management.management;

import com.management.management.model.ProductInFactory;
import com.management.management.repository.ProductRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class ManagementApplicationTests {

	@Autowired
	ProductRepo productRepo;

	@Test
	void contextLoads() {
	}

	@Test
	void ProductInFactoryTest(){
		ProductInFactory pif = new ProductInFactory();
		pif.setName(1111);
		pif.setLeatherType("Cuero");
		pif.setColor("Negro");
		pif.setPrice(100.0);
		pif.setGender(true);
		pif.setShoeType("Zapatilla");
		pif.setNumberOfElements(10);

		ProductInFactory saved = productRepo.save(pif);

		ProductInFactory recovered = (ProductInFactory) productRepo.findById((long) saved.getId()).orElseThrow();

		assertAll(
			() -> assertEquals(pif.getName(), recovered.getName()),
			() -> assertEquals(pif.getLeatherType(), recovered.getLeatherType()),
			() -> assertEquals(pif.getColor(), recovered.getColor()),
			() -> assertEquals(pif.getPrice(), recovered.getPrice()),
			() -> assertEquals(pif.getGender(), recovered.getGender()),
			() -> assertEquals(pif.getShoeType(), recovered.getShoeType()),
			() -> assertEquals(pif.getNumberOfElements(), recovered.getNumberOfElements())
		);
	}

}
