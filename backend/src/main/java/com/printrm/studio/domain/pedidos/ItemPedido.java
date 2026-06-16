package com.printrm.studio.domain.pedidos;

import com.printrm.studio.domain.calculo.Calculo;
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
    @JoinColumn(name = "calculo_id", nullable = false)
    private Calculo calculo;

    @Column(nullable = false)
    private Integer cantidad;

    @Builder.Default
    private Integer cantidadMerma = 0;

    @Column(nullable = false)
    private Double subtotal;

    public void calcularSubtotal() {
        if (calculo != null && cantidad != null) {
            this.subtotal = calculo.getPrecioVenta() * cantidad;
        }
    }
}
