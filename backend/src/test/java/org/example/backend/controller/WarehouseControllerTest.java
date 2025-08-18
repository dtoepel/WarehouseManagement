package org.example.backend.controller;

import org.example.backend.model.Product;
import org.example.backend.repository.ProductRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@AutoConfigureMockMvc
class WarehouseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepo repo;

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
}