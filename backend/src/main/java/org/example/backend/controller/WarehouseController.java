package org.example.backend.controller;

import org.example.backend.model.Product;
import org.example.backend.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
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

    @PostMapping("/add")
    public Product addProduct(@RequestBody Product product) {
        return productService.addProduct(product);
    }

    @DeleteMapping("{productId}")
    public void deleteProduct(@PathVariable("productId") String productId) {
        if(!productService.deleteProduct(productId))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Object does not exist");
    }

}
