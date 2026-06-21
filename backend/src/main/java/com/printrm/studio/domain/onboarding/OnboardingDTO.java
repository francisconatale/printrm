package com.printrm.studio.domain.onboarding;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OnboardingDTO {
    private String nombreUsuario;
    private String nombreEmprendimiento;
    private Boolean completado;
}
