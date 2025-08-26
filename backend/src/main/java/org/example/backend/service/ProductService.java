package org.example.backend.service;

import org.example.backend.exceptions.InvalidRequestException;
import org.example.backend.exceptions.ProductNotFoundException;
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

    public Optional<Product> getProductById(String id) {
        return Optional.ofNullable(productRepo.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id)));
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

    public Product updateProduct(String id, ProductDto newProduct) throws InvalidRequestException {
        Product existingProduct = productRepo.findById(id)
                .orElseThrow(() -> new InvalidRequestException(
                        "The Product ID is invalid. It can not be edit."));

        existingProduct.withName(newProduct.name());
        existingProduct.withDescription(newProduct.description());
        existingProduct.withStockKeepingUnit(newProduct.stockKeepingUnit());
        existingProduct.withQuantity(newProduct.quantity());
        existingProduct.withPrice(newProduct.price());
        existingProduct.withLocation(newProduct.location());

        return productRepo.save(existingProduct);
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
