package org.example.backend.service;

import org.example.backend.exceptions.InvalidRequestException;
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

import static org.assertj.core.api.Assertions.*;
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
        Product existing = new Product("p1", "USB-C Cable 1m", "USB-C to USB-C, 60W",
                "CAB-USBC-1M", 10, 6.90, "B2-R05-B04",
                "2025-08-02T08:30:00Z", "2025-08-12T14:02:00Z");

        when(productRepo.findById("p1")).thenReturn(Optional.of(existing));

        productService.deleteProduct("p1");

        verify(productRepo, times(1)).deleteById("p1");

        verifyNoMoreInteractions(productRepo);

    }

    @Test
    void getAllProducts_returnsListFromRepo() {
        // given
        Product p1 = new Product(
                "p1", "USB-C Cable 1m", "USB-C to USB-C, 60W",
                "CAB-USBC-1M", 10, 6.90, "B2-R05-B04",
                "2025-08-02T08:30:00Z", "2025-08-12T14:02:00Z");
        Product p2 = new Product(
                "p2", "HDMI Cable 2m", "4K@60Hz",
                "CAB-HDMI-2M", 5, 5.49, "B3-R03-B02",
                "2025-08-05T10:15:00Z", "2025-08-15T16:20:00Z");
        when(productRepo.findAll()).thenReturn(java.util.List.of(p1, p2));

        // when
        java.util.List<Product> result = productService.getAllProducts();

        // then
        assertThat(result).hasSize(2).containsExactly(p1, p2);
        verify(productRepo, times(1)).findAll();
        verifyNoMoreInteractions(productRepo);
    }

    @Test
    void deleteProduct_returnsFalse_whenIdMissing() {
        // given
        String id = "missing";
        when(productRepo.findById(id)).thenReturn(Optional.empty());

        // when
        boolean result = productService.deleteProduct(id);

        // then
        assertThat(result).isFalse();
        verify(productRepo, times(1)).findById(id);
        verify(productRepo, never()).deleteById(anyString());
        verifyNoMoreInteractions(productRepo);
    }

    @Test
    void getAllProducts_returnsEmptyList_whenRepoEmpty() {
        // given
        when(productRepo.findAll()).thenReturn(java.util.Collections.emptyList());

        // when
        java.util.List<Product> result = productService.getAllProducts();

        // then
        assertThat(result).isEmpty();
        verify(productRepo, times(1)).findAll();
        verifyNoMoreInteractions(productRepo);
    }


    @Test
    void getProductById_returnsProduct_whenFound() {
        // given
        String id = "p1";
        Product p = new Product(
                id, "USB-C Kablo 1m", "USB-C to USB-C, 60W",
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

    @Test
    void updateProduct_returnsUpdatedProduct_whenCalledWithValidIdAndValidData() {
        ProductRepo mockRepo = mock(ProductRepo.class);
        IdService mockIdService = mock(IdService.class);
        ProductService mockService = new ProductService(mockRepo, mockIdService);

        // Capture time windows
        Instant beforeUpdate = Instant.now();

        // given
        String id = "1";
        Instant originalCreatedTime = beforeUpdate.minusSeconds(3600); // 1 hour ago
        Product existingProduct = new Product(
                id, "USB-C Kablo 1m",
                "USB-C to USB-C, 60W",
                "CAB-USBC-1M",
                10, 6.90,
                "B2-R05-B04",
                originalCreatedTime.toString(),
                originalCreatedTime.toString()); // Initially same

        ProductDto updatedProductDto = new ProductDto(
                "USB-C Kablo 1m - updated",
                "USB-C to USB-C, 60W - updated",
                "CAB-USBC-1M - updated",
                100, 7.90,
                "B2-R05-B04 - updated");

        when(mockRepo.findById(id))
                .thenReturn(Optional.of(existingProduct));

        when(mockRepo.save(any(Product.class)))
                .thenAnswer(invocation -> {
                    Product savedProduct = invocation.getArgument(0);

                    // Assert properties are updated correctly
                    assertThat(savedProduct.id()).isEqualTo(id);
                    assertThat(savedProduct.name()).isEqualTo(updatedProductDto.name());
                    assertThat(savedProduct.description()).isEqualTo(updatedProductDto.description());
                    assertThat(savedProduct.stockKeepingUnit()).isEqualTo(updatedProductDto.stockKeepingUnit());
                    assertThat(savedProduct.quantity()).isEqualTo(updatedProductDto.quantity());
                    assertThat(savedProduct.price()).isEqualTo(updatedProductDto.price());
                    assertThat(savedProduct.location()).isEqualTo(updatedProductDto.location());

                    // Assert timestamps
                    assertThat(savedProduct.createdAt()).isEqualTo(originalCreatedTime.toString()); // Should stay same
                    // updatedAt should be newer than createdAt
                    Instant updatedAt = Instant.parse(savedProduct.updatedAt());
                    assertThat(updatedAt).isAfter(originalCreatedTime);

                    return savedProduct;
                });

        // when
        Product actualUpdatedProduct = mockService.updateProduct(id, updatedProductDto);
        Instant afterUpdate = Instant.now();

        // then
        assertThat(actualUpdatedProduct.id()).isEqualTo(id);
        assertThat(actualUpdatedProduct.name()).isEqualTo(updatedProductDto.name());
        assertThat(actualUpdatedProduct.description()).isEqualTo(updatedProductDto.description());
        assertThat(actualUpdatedProduct.stockKeepingUnit()).isEqualTo(updatedProductDto.stockKeepingUnit());
        assertThat(actualUpdatedProduct.quantity()).isEqualTo(updatedProductDto.quantity());
        assertThat(actualUpdatedProduct.price()).isEqualTo(updatedProductDto.price());
        assertThat(actualUpdatedProduct.location()).isEqualTo(updatedProductDto.location());

        // Timestamp assertions
        Instant createdAt = Instant.parse(actualUpdatedProduct.createdAt());
        Instant updatedAt = Instant.parse(actualUpdatedProduct.updatedAt());

        assertThat(createdAt).isEqualTo(originalCreatedTime); // createdAt should be unchanged
        assertThat(updatedAt).isBetween(beforeUpdate.minusSeconds(1), afterUpdate.plusSeconds(1)); // updatedAt should be recent
        assertThat(updatedAt).isAfter(createdAt); // updatedAt should be after createdAt

        verify(mockRepo).findById(id);
        verify(mockRepo).save(any(Product.class));
        verifyNoMoreInteractions(mockRepo, mockIdService);
    }

    @Test
    void updateProduct_throwsInvalidRequestException_whenProductNotFound() {
        ProductRepo mockRepo = mock(ProductRepo.class);
        IdService mockIdService = mock(IdService.class);
        ProductService mockService = new ProductService(mockRepo, mockIdService);

        // given
        String nonExistentId = "invalid-id";
        ProductDto updateData = new ProductDto("name", "desc", "sku", 10, 5.0, "location");

        when(mockRepo.findById(nonExistentId)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> mockService.updateProduct(nonExistentId, updateData))
                .isInstanceOf(InvalidRequestException.class)
                .hasMessage("The Product ID is invalid. It can not be edit.");

        verify(mockRepo).findById(nonExistentId);
        verify(mockRepo, never()).save(any());
        verifyNoMoreInteractions(mockRepo, mockIdService);
    }


}