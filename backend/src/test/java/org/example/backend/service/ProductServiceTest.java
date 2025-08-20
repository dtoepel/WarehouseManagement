package org.example.backend.service;

import org.example.backend.exceptions.ProductNotFoundException;
import org.example.backend.model.Product;
import org.example.backend.model.ProductDto;
import org.example.backend.repository.ProductRepo;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.within;
import static org.mockito.Mockito.*;


@Nested
@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepo productRepo;
    @Mock
    private IdService idService;

    @InjectMocks
    private ProductService productService;

    @Test
    void getProductById_returnsProduct_whenFound() {
        // given
        String id = "p1";
        Product p = new Product(
                id, "USB-C Cable 1m", "USB-C to USB-C, 60W",
    void addProduct_buildsAndSavesProduct_withGeneratedId_andTimestamps() {
        // Arrange
        ProductDto dto = new ProductDto(
                "USB-C Cable 1m", "USB-C to USB-C, 60W",
                "CAB-USBC-1M", 10, 6.90, "B2-R05-B04"
        );
        when(idService.generateId()).thenReturn("gen-123");

        // capture a time window around the call to validate timestamps
        Instant before = Instant.now();

        // Act
        Product result = productService.addProduct(dto);

        Instant after = Instant.now();

        // Assert: repo.save was called once with the built Product
        ArgumentCaptor<Product> captor = ArgumentCaptor.forClass(Product.class);
        verify(productRepo, times(1)).save(captor.capture());

        // Assert: id generation happens before save
        InOrder order = inOrder(idService, productRepo);
        order.verify(idService).generateId();
        order.verify(productRepo).save(any(Product.class));

        Product saved = captor.getValue();
        // Returned product should be the same content as saved (record: value-based equals)
        assertThat(result).isEqualTo(saved);

        // Field assertions
        assertThat(saved.id()).isEqualTo("gen-123");
        assertThat(saved.name()).isEqualTo(dto.name());
        assertThat(saved.description()).isEqualTo(dto.description());
        assertThat(saved.stockKeepingUnit()).isEqualTo(dto.stockKeepingUnit());
        assertThat(saved.quantity()).isEqualTo(dto.quantity());
        assertThat(saved.price()).isCloseTo(dto.price(), within(1e-9));
        assertThat(saved.location()).isEqualTo(dto.location());

        // Timestamp assertions: ISO-8601 strings within the [before, after] window
        Instant created = Instant.parse(saved.createdAt());
        Instant updated = Instant.parse(saved.updatedAt());
        assertThat(updated).isEqualTo(created);
        assertThat(created).isBetween(before.minusSeconds(1), after.plusSeconds(1));

        verifyNoMoreInteractions(productRepo, idService);
    }

    @Test
    void deleteProduct_shouldRemoveProduct_whenCalledWithValidId() {
        Product existing = new Product( "p1", "USB-C Cable 1m", "USB-C to USB-C, 60W",
                "CAB-USBC-1M", 10, 6.90, "B2-R05-B04",
                "2025-08-02T08:30:00Z", "2025-08-12T14:02:00Z");
        when(productRepo.findById(id)).thenReturn(Optional.of(p));

        // when
        Product result = productService.getProductById(id).orElse(null);
        when(productRepo.findById("p1")).thenReturn(Optional.of(existing));

        // then
        assertThat(result).isEqualTo(p);
        verify(productRepo, times(1)).findById(id);
        verifyNoMoreInteractions(productRepo);
    }
        productService.deleteProduct("p1");

    @Test
    void getProductById_throwsProductNotFound_whenMissing() {
        // given
        String id = "missing";
        when(productRepo.findById(id)).thenReturn(Optional.empty());
        verify(productRepo,times(1)).deleteById("p1");

        // when/then
        assertThatThrownBy(() -> productService.getProductById(id))
                .isInstanceOf(ProductNotFoundException.class)
                .hasMessageContaining(id);

        verify(productRepo, times(1)).findById(id);
        verifyNoMoreInteractions(productRepo);
    }
}