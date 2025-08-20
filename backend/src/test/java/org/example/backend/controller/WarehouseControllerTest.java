package org.example.backend.controller;

import org.example.backend.model.Product;
import org.example.backend.repository.ProductRepo;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.springframework.http.MediaType.APPLICATION_PROBLEM_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class WarehouseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepo repo;

    @AfterEach
    void cleanUp() { repo.deleteAll(); }

    @Test
    void getAllProducts() throws Exception {

        Product character = new Product(
                "1",
                "Asterix",
                "",
                "AS-TE-RIX",
                0,
                19.95,
                "",
                "today",
                "a moment ago");

        repo.save(character);
        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/products"))
                //THEN
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json(
                    """ 
                                [
                                  {
                                    "id": "1",
                                    "name": "Asterix"
                                  }
                                ]
                                """));


    }

    @Test
    void getProductById_returns200_withBody() throws Exception {
        // given
        String id = "p1";
        Product p = new Product(
                id, "USB-C Cable 1m", "USB-C to USB-C, 60W",
                "CAB-USBC-1M", 10, 6.90, "B2-R05-B04",
                "2025-08-02T08:30:00Z", "2025-08-12T14:02:00Z");
        repo.save(p);

        // expect
        mockMvc.perform(get("/api/products/{id}", id).accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.name").value("USB-C Cable 1m"))
                .andExpect(jsonPath("$.stockKeepingUnit").value("CAB-USBC-1M"))
                .andExpect(jsonPath("$.quantity").value(10))
                .andExpect(jsonPath("$.price").value(6.90));
    }

    @Test
    void getProductById_returns404_problemJson_whenMissing() throws Exception {
        // given
        String id = "wrong-id";

        // expect
        mockMvc.perform(get("/api/products/{id}", id).accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(content().contentTypeCompatibleWith(APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.title").value("Product not found"))
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.detail").value("Product not found: " + id))
                .andExpect(jsonPath("$.errorCode").value("PRODUCT_NOT_FOUND"))
                .andExpect(jsonPath("$.productId").value(id))
                .andExpect(jsonPath("$.path").value("/api/products/" + id))
                .andExpect(jsonPath("$.timestamp").exists());
    }
}