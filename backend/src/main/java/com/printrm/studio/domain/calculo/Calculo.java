package com.printrm.studio.domain.calculo;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

import com.printrm.studio.domain.clientes.Cliente;

@Entity
@Table(name = "calculos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Calculo {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp;

    @Column(name = "perfil_id")
    private UUID perfilId;

    @Column(name = "perfil_nombre")
    private String perfilNombre;

    // Input fields
    private Integer horas;
    @Column(name = "minutos_adicionales")
    private Integer minutosAdicionales;
    private Double gramos;
    @Column(name = "insumos_extra")
    private Double insumosExtra;

    // Result fields
    @Column(name = "costo_energia")
    private Double costoEnergia;
    @Column(name = "costo_filamento")
    private Double costoFilamento;
    private Double subtotal;
    @Column(name = "costo_base")
    private Double costoBase;

    @Column(name = "precio_venta")
    private Double precioVenta;
}

