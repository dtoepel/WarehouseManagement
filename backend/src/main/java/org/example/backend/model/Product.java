package org.example.backend.model;

import lombok.With;
import org.springframework.data.mongodb.core.mapping.Document;

@With
@Document(collection = "products")
public record Product (
        String id, // uuid
        String name,
        String description,
        String stockKeepingUnit, // kind of human-readable id
        int quantity,
        double price,
        String location,
        String createdAt,
        String updatedAt) {
}