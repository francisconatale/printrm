package com.printrm.studio.domain.finanzas;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "transacciones")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Transaccion {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    private TipoTransaccion tipo;

    @Enumerated(EnumType.STRING)
    private CategoriaTransaccion categoria;

    private Double monto;
    private Integer cantidad;
    private Double precioUnitario;

    private boolean devueltoTotalmente;
    private String descripcion;
    private UUID pedidoId;
    private UUID grupoId;
    private UUID productoId;

    @CreationTimestamp
    private LocalDateTime fecha;
    
    public enum TipoTransaccion {
        INGRESO, EGRESO, REEMBOLSO
    }

    public enum CategoriaTransaccion {
        MATERIAL, ENERGIA, VENTA, MERMA, REPUESTO, OTRO
    }
}
