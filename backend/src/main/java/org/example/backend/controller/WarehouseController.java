package org.example.backend.controller;

import org.example.backend.exceptions.InvalidRequestException;
import org.example.backend.model.Product;
import org.example.backend.model.ProductDto;
import org.example.backend.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class WarehouseController {
    private final ProductService productService;

    public WarehouseController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{productId}")
    public ResponseEntity<Product> getProductById(@PathVariable String productId) {
        return ResponseEntity.of(productService.getProductById(productId));
    }

    @PostMapping("/add")
    public Product addProduct(@RequestBody ProductDto product) {
        return productService.addProduct(product);
    }

    @DeleteMapping("{productId}")
    public void deleteProduct(@PathVariable("productId") String productId) {
        if (!productService.deleteProduct(productId))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Object does not exist");
    }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable String id,
                                 @RequestBody ProductDto newProduct)
            throws InvalidRequestException {
        return productService.updateProduct(id, newProduct);
    }

}
