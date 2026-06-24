package com.printrm.studio.domain.biblioteca;

import com.printrm.studio.domain.perfil.FilamentProfile;
import com.printrm.studio.domain.perfil.Perfil;
import com.printrm.studio.domain.perfil.PrintProfile;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "piezas_stl")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE piezas_stl SET deleted = true WHERE id = ?")
public class PiezaSTL {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String filePath;

    // Metadatos extraídos opcionalmente
    private Double volumenCm3;
    private Double pesoGramos;
    private String tiempoEstimado;
    private Double costoBase;
    private Double costoError;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String imagenBase64;

    // Perfiles de preferencia (Opcionales)
    @ManyToOne
    @JoinColumn(name = "perfil_impresora_id")
    private Perfil perfilPreferido;

    @ManyToOne
    @JoinColumn(name = "perfil_filamento_id")
    private FilamentProfile filamentoPreferido;

    @ManyToOne
    @JoinColumn(name = "perfil_impresion_id")
    private PrintProfile impresionPreferida;

    @CreationTimestamp
    private LocalDateTime creadoEn;

    @UpdateTimestamp
    private LocalDateTime actualizadoEn;

    @Builder.Default
    @Column(nullable = false)
    private Boolean deleted = false;
}
