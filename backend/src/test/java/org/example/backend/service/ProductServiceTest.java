package org.example.backend.service;

import org.example.backend.exceptions.ProductNotFoundException;
import org.example.backend.model.Product;
import org.example.backend.repository.ProductRepo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepo productRepo;

    @InjectMocks
    private ProductService productService;

    @Test
    void getProductById_returnsProduct_whenFound() {
        // given
        String id = "p1";
        Product p = new Product(
                id, "USB-C Cable 1m", "USB-C to USB-C, 60W",
                "CAB-USBC-1M", 10, 6.90, "B2-R05-B04",
                "2025-08-02T08:30:00Z", "2025-08-12T14:02:00Z");
        when(productRepo.findById(id)).thenReturn(Optional.of(p));

        // when
        Product result = productService.getProductById(id).orElse(null);

        // then
        assertThat(result).isEqualTo(p);
        verify(productRepo, times(1)).findById(id);
        verifyNoMoreInteractions(productRepo);
    }

    @Test
    void getProductById_throwsProductNotFound_whenMissing() {
        // given
        String id = "missing";
        when(productRepo.findById(id)).thenReturn(Optional.empty());

        // when/then
        assertThatThrownBy(() -> productService.getProductById(id))
                .isInstanceOf(ProductNotFoundException.class)
                .hasMessageContaining(id);

        verify(productRepo, times(1)).findById(id);
        verifyNoMoreInteractions(productRepo);
    }
}