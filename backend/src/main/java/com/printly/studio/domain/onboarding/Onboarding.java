package com.printly.studio.domain.onboarding;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "onboarding")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Onboarding {
    @Id
    private Long id;

    @Column(name = "nombre_usuario", length = 100)
    private String nombreUsuario;

    @Column(name = "nombre_emprendimiento", length = 100)
    private String nombreEmprendimiento;

    @Column(nullable = false)
    private Boolean completado;

    @Column(name = "completado_en")
    private LocalDateTime completadoEn;
}
