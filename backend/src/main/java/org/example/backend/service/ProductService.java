package org.example.backend.service;

import org.example.backend.model.Product;
import org.example.backend.model.ProductDto;
import org.example.backend.repository.ProductRepo;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    private final ProductRepo productRepo;
    private final IdService idService;

    public ProductService(ProductRepo productRepo, IdService idService) {
        this.productRepo = productRepo;
        this.idService = idService;
    }

    public List<Product> getAllProducts() {
        return productRepo.findAll();
    }

    public Product addProduct(ProductDto newProduct) {
        Instant now = Instant.now();

        Product product = new Product(
                idService.generateId(),
                newProduct.name(),
                newProduct.description(),
                newProduct.stockKeepingUnit(),
                newProduct.quantity(),
                newProduct.price(),
                newProduct.location(),
                now.toString(),
                now.toString()
        );

        productRepo.save(product);

        return product;
    }

    public boolean deleteProduct(String productId) {
        Optional<Product> response = productRepo.findById(productId);
        if(response.isPresent()) {
            productRepo.deleteById(productId);
            return true;
        }
        return false;
    }
}
