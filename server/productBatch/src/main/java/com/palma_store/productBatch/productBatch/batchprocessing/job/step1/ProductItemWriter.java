package com.palma_store.productBatch.productBatch.batchprocessing.job.step1;

import java.util.List;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import com.palma_store.productBatch.productBatch.model.Product;


public class ProductItemWriter implements ItemWriter<Product> {

    //@Autowired
    //ProductRepo productRepo;

	@Override
	public void write(Chunk<? extends Product> chunk) throws Exception {
		// Obtener los productos del chunk
		List<Product> productList = (List<Product>) chunk.getItems();
		// Comprobar y procesar cada producto
		productList.forEach(product -> {
			// Es necesario llamar al servicio de productos
			// Product existingProduct =
			// productRepo.findProductByAttributes(product.getName(), product.getSize(),
			// product.getColor(), product.getShoeType(), product.getLeatherType(),
			// product.getGender(), product.getInFactory());
			Product existingProduct = null;
			if (existingProduct != null) {

				product.setId(existingProduct.getId());
				// Actualizar solo si algo ha cambiado
				if (!existingProduct.equals(product)) {
					// HAY QUE LLAMAR AL SERVICIO DE PRODUCT
					// productRepo.save(product);
				}
			} else {
				// Si no existe, guardarlo como nuevo
				// HAY QUE LLAMAR AL SERVICIO DE PRODUCT
				// productRepo.save(product);
			}
		});
	}

}
