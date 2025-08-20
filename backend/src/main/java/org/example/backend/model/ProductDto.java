package org.example.backend.model;

public record ProductDto (
        String name,
        String description,
        String stockKeepingUnit,
        int quantity,
        double price,
        String location) {
}