package com.printrm.studio.domain.perfil;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "perfiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Perfil {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 50)
    private String nombre;

    @CreationTimestamp
    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @UpdateTimestamp
    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;

    @Column(name = "filamento_por_kg")
    private Double filamentoPorKg;

    @Column(name = "precio_kwh")
    private Double preciokWh;

    @Column(name = "modelo_impresora")
    private String modeloImpresora;

    @Column(name = "consumo_w")
    private Double consumoW;

    @Column(name = "vida_util_horas")
    private Double vidaUtilHoras;

    @Column(name = "costo_repuestos")
    private Double costoRepuestos;

    @Column(name = "margen_error")
    private Double margenError;

    // Slicer Configuration
    @Column(name = "print_config")
    private String printConfig;

    @Column(name = "filament_config")
    private String filamentConfig;

    @Column(name = "printer_config")
    private String printerConfig;
}

