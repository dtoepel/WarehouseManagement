package org.example.backend.model;

import lombok.With;
import org.springframework.data.mongodb.core.mapping.Document;

@With
@Document(collection = "products")
public record Product (String id, String name) {

}
