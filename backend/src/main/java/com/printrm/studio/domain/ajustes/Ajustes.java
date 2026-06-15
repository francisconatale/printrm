package com.printrm.studio.domain.ajustes;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ajustes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ajustes {
    @Id
    private Long id;

    @UpdateTimestamp
    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;

    @Column(name = "filamento_por_kg")
    private Double filamentoPorKg;

    @Column(name = "precio_kwh")
    private Double preciokWh;

    @Column(name = "vida_util_horas")
    private Double vidaUtilHoras;

    @Column(name = "costo_repuestos")
    private Double costoRepuestos;

    @Column(name = "margen_error")
    private Double margenError;
}
