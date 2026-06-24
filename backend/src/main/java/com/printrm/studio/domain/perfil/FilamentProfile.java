package com.printrm.studio.domain.perfil;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "filament_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SQLDelete(sql = "UPDATE filament_profiles SET deleted = true WHERE id = ?")
public class FilamentProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 50)
    private String nombre;

    @Column(length = 20)
    private String material;

    @Column(name = "filamento_por_kg")
    private Double filamentoPorKg;

    private Double density; // g/cm³

    private Double diameter; // mm

    @Column(length = 7)
    private String colour; // #HEX

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
