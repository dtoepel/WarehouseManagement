package org.example.backend.controller;

import org.example.backend.model.Product;
import org.example.backend.repository.ProductRepo;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
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
    void deleteProduct_returns200_whenExisting() throws Exception {
        // given
        Product p = new Product(
                "del-1","To Be Deleted","desc",
                "DEL-1",1,1.00,"A1-R01-B01",
                "2025-08-01T09:00:00Z","2025-08-01T09:00:00Z");
        repo.save(p);

        // when/then
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/products/{id}", "del-1"))
                .andExpect(status().isOk());

        // optional: verify it is really gone
        mockMvc.perform(get("/api/products/{id}", "del-1").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void addProduct_createsAndReturnsProduct() throws Exception {
        // given
        String body = """
        {
          "name": "HDMI Cable 2m",
          "description": "4K@60Hz",
          "stockKeepingUnit": "CAB-HDMI-2M",
          "quantity": 5,
          "price": 5.49,
          "location": "B3-R03-B02"
        }
        """;

        // when/then
        mockMvc.perform(
                        MockMvcRequestBuilders.post("/api/products/add")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(body)
                )
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("HDMI Cable 2m"))
                .andExpect(jsonPath("$.stockKeepingUnit").value("CAB-HDMI-2M"))
                .andExpect(jsonPath("$.quantity").value(5))
                .andExpect(jsonPath("$.price").value(5.49))
                .andExpect(jsonPath("$.createdAt").exists())
                .andExpect(jsonPath("$.updatedAt").exists());
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