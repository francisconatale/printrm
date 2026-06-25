package com.printly.studio.domain.stock;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "lotes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Lote {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @Column(nullable = false)
    private Integer cantidadOriginal;

    @Column(nullable = false)
    private Integer cantidadActual;

    @Column(nullable = false)
    private Double costoUnitario;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;
}
