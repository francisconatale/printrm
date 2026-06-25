package com.printly.studio.domain.produccion;

import com.printly.studio.domain.pedidos.ItemPedido;
import com.printly.studio.domain.stock.Producto;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "ordenes_produccion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrdenProduccion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_pedido_id")
    private ItemPedido itemPedido;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = true)
    private Producto producto;

    @Column(nullable = false)
    private Integer cantidad;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoProduccion estado;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TipoOrigen origen = TipoOrigen.STOCK_INTERNO;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaInicio;

    private LocalDateTime fechaFin;

    public enum EstadoProduccion {
        COLA, IMPRIMIENDO, COMPLETADO, CANCELADO, MERMA
    }

    public enum TipoOrigen {
        PEDIDO_CLIENTE, STOCK_INTERNO
    }
}
