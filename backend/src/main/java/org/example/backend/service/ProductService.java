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
        String timeValue = Instant.now().toString();

        Product product = new Product(
                idService.generateId(),
                newProduct.name(),
                newProduct.description(),
                newProduct.stockKeepingUnit(),
                newProduct.quantity(),
                newProduct.price(),
                newProduct.location(),
                timeValue,
                timeValue
        );

        productRepo.save(product);

        return product;
    }

    public Product updateProduct(String id, ProductDto newProduct) throws InvalidRequestException {
        Product existingProduct = productRepo.findById(id)
                .orElseThrow(() -> new InvalidRequestException(
                        "The Product ID is invalid. It can not be edit."));

        Product updatedProduct = existingProduct
                .withName(newProduct.name())
                .withDescription(newProduct.description())
                .withStockKeepingUnit(newProduct.stockKeepingUnit())
                .withQuantity(newProduct.quantity())
                .withPrice(newProduct.price())
                .withLocation(newProduct.location())
                .withUpdatedAt(Instant.now().toString());

        return productRepo.save(updatedProduct);
    }

    public boolean deleteProduct(String productId) {
        Optional<Product> response = productRepo.findById(productId);
        if (response.isPresent()) {
            productRepo.deleteById(productId);
            return true;
        }
        return false;
    }
}
