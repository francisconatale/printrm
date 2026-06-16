package com.printrm.studio.domain.finanzas;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "transacciones")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Transaccion {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    private TipoTransaccion tipo;

    private Double monto;
    
    public enum TipoTransaccion {
        INGRESO, EGRESO, REEMBOLSO
    }
}
