package com.printly.studio.domain.stock;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("ProductoService — FIFO Inventory Tests")
class ProductoServiceFIFOTest {

    @Autowired
    private ProductoService productoService;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private LoteRepository loteRepository;

    private ProductoResponseDTO producto;

    @BeforeEach
    void setUp() {
        loteRepository.deleteAll();
        productoRepository.deleteAll();

        ProductoRequestDTO dto = new ProductoRequestDTO();
        dto.setNombre("Test Product");
        dto.setCantidadStock(0);
        producto = productoService.save(dto);
    }

    @Test
    @DisplayName("addStock() creates a new lot and updates total stock")
    void addStock_createsLot() {
        productoService.addStock(UUID.fromString(producto.getId()), 10, 50.0);
        
        Producto updated = productoRepository.findById(UUID.fromString(producto.getId())).orElseThrow();
        assertThat(updated.getCantidadStock()).isEqualTo(10);
        
        List<Lote> lotes = loteRepository.findAll();
        assertThat(lotes).hasSize(1);
        assertThat(lotes.get(0).getCantidadOriginal()).isEqualTo(10);
        assertThat(lotes.get(0).getCantidadActual()).isEqualTo(10);
        assertThat(lotes.get(0).getCostoUnitario()).isEqualTo(50.0);
    }

    @Test
    @DisplayName("addStock() merges with latest lot if cost is the same")
    void addStock_mergesSameCost() {
        productoService.addStock(UUID.fromString(producto.getId()), 10, 50.0);
        productoService.addStock(UUID.fromString(producto.getId()), 5, 50.0);
        
        Producto updated = productoRepository.findById(UUID.fromString(producto.getId())).orElseThrow();
        assertThat(updated.getCantidadStock()).isEqualTo(15);
        
        List<Lote> lotes = loteRepository.findAll();
        assertThat(lotes).hasSize(1);
        assertThat(lotes.get(0).getCantidadOriginal()).isEqualTo(15);
        assertThat(lotes.get(0).getCantidadActual()).isEqualTo(15);
    }

    @Test
    @DisplayName("addStock() creates new lot if cost is different")
    void addStock_createsNewLotIfCostDiffers() {
        productoService.addStock(UUID.fromString(producto.getId()), 10, 50.0);
        productoService.addStock(UUID.fromString(producto.getId()), 5, 60.0);
        
        List<Lote> lotes = loteRepository.findAll();
        assertThat(lotes).hasSize(2);
    }

    @Test
    @DisplayName("updateStock with delta < 0 consumes from oldest lot first (FIFO)")
    void updateStock_consumesFIFO() throws InterruptedException {
        // Add first lot (oldest)
        productoService.addStock(UUID.fromString(producto.getId()), 10, 10.0);
        Thread.sleep(100); // Ensure different timestamps if precision is low
        // Add second lot
        productoService.addStock(UUID.fromString(producto.getId()), 20, 20.0);

        // Total stock should be 30
        assertThat(productoRepository.findById(UUID.fromString(producto.getId())).get().getCantidadStock()).isEqualTo(30);

        // Consume 15 units
        // It should consume 10 from the first lot and 5 from the second lot
        productoService.updateStock(producto.getId(), -15);

        Producto updated = productoRepository.findById(UUID.fromString(producto.getId())).get();
        assertThat(updated.getCantidadStock()).isEqualTo(15);

        List<Lote> lotes = loteRepository.findByProductoIdAndCantidadActualGreaterThanOrderByFechaCreacionAsc(UUID.fromString(producto.getId()), -1);
        // We look for all lots to check their actual quantity
        
        // Note: findByProductoIdAndCantidadActualGreaterThanOrderByFechaCreacionAsc(id, 0) only returns lots with stock > 0
        // Let's use findAll or a custom query for testing
        List<Lote> allLotes = loteRepository.findAll();
        allLotes.sort((l1, l2) -> l1.getFechaCreacion().compareTo(l2.getFechaCreacion()));

        assertThat(allLotes).hasSize(2);
        
        // First lot should be empty
        assertThat(allLotes.get(0).getCantidadActual()).isEqualTo(0);
        assertThat(allLotes.get(0).getCostoUnitario()).isEqualTo(10.0);

        // Second lot should have 15 remaining (20 - 5)
        assertThat(allLotes.get(1).getCantidadActual()).isEqualTo(15);
        assertThat(allLotes.get(1).getCostoUnitario()).isEqualTo(20.0);
    }

    @Test
    @DisplayName("updateStock with delta > 0 adds a new lot")
    void updateStock_positiveDeltaAddsLot() {
        productoService.updateStock(producto.getId(), 5);
        
        List<Lote> lotes = loteRepository.findAll();
        assertThat(lotes).hasSize(1);
        assertThat(lotes.get(0).getCantidadActual()).isEqualTo(5);
        assertThat(lotes.get(0).getCostoUnitario()).isEqualTo(0.0); // Default cost
    }
}
