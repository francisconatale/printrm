package com.printrm.studio.domain.perfil;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "print_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SQLDelete(sql = "UPDATE print_profiles SET deleted = true WHERE id = ?")
public class PrintProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 50)
    private String nombre;

    @Column(name = "layer_height")
    private Double layerHeight;

    private Integer perimeters;

    @Column(name = "fill_density", length = 10)
    private String fillDensity;

    @Column(name = "speed_print")
    private Double speedPrint;

    @CreationTimestamp
    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @UpdateTimestamp
    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;

    @Builder.Default
    @Column(nullable = false)
    private Boolean deleted = false;
}
