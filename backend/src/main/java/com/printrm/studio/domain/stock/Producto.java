package com.printrm.studio.domain.stock;

import com.printrm.studio.domain.biblioteca.PiezaSTL;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.SQLDelete;

@Entity
@Table(name = "productos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@SQLDelete(sql = "UPDATE productos SET deleted = true WHERE id = ?")
public class Producto {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nombre;

    @ManyToMany
    @JoinTable(
        name = "producto_partes",
        joinColumns = @JoinColumn(name = "producto_id"),
        inverseJoinColumns = @JoinColumn(name = "pieza_id")
    )
    @Builder.Default
    private List<PiezaSTL> partes = new ArrayList<>();

    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Lote> lotes = new ArrayList<>();

    @Column(nullable = false)
    @Builder.Default
    private Integer cantidadStock = 0;

    private Double precioSugerido;

    @CreationTimestamp
    private LocalDateTime creadoEn;

    @UpdateTimestamp
    private LocalDateTime actualizadoEn;

    @Builder.Default
    @Column(nullable = false)
    private Boolean deleted = false;
}
