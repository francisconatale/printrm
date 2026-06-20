package com.printrm.studio.domain.pedidos;

import com.printrm.studio.domain.stock.Producto;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "items_pedido")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemPedido {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id")
    private Producto producto;

    @Column(nullable = false)
    private Integer cantidad;

    @Builder.Default
    private Integer cantidadMerma = 0;

    @Column(nullable = false)
    private Double subtotal;

    public void calcularSubtotal() {
        if (producto != null && cantidad != null) {
            this.subtotal = (producto.getPrecioSugerido() != null ? producto.getPrecioSugerido() : 0.0) * cantidad;
        } else {
            this.subtotal = 0.0;
        }
    }
}
