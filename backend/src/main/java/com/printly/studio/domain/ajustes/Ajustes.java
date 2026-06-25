package com.printly.studio.domain.ajustes;

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

    @Column(name = "precio_kwh")
    private Double preciokWh;

    @Column(name = "margen_error")
    private Double margenError;
}
