package org.example.backend.service;

import org.example.backend.model.Product;
import org.example.backend.repository.ProductRepo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.Optional;

@Service
public class ProductService {
    private final ProductRepo productRepo;

    public ProductService(ProductRepo productRepo) {
        this.productRepo = productRepo;
    }

    public List<Product> getAllProducts() {
        return productRepo.findAll();
    }

    public Product addProduct(Product newProduct) {
        Product product = new Product(
                UUID.randomUUID().toString(),
                newProduct.name(),
                newProduct.description(),
                newProduct.stockKeepingUnit(),
                newProduct.quantity(),
                newProduct.price(),
                newProduct.location(),
                Instant.now().toString(),
                Instant.now().toString()
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
