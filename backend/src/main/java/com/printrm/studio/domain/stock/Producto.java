package com.printrm.studio.domain.stock;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "productos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Producto {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String nombre;
    private Integer cantidadStock;
}
