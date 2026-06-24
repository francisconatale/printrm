package com.printrm.studio.utils;

import com.printrm.studio.domain.biblioteca.PiezaSTL;
import com.printrm.studio.domain.biblioteca.PiezaSTLRepository;
import com.printrm.studio.domain.perfil.FilamentProfile;
import com.printrm.studio.domain.perfil.FilamentProfileRepository;
import com.printrm.studio.domain.stock.Producto;
import com.printrm.studio.domain.stock.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class TestDataFactory {

    @Autowired
    private FilamentProfileRepository filamentProfileRepository;
    
    @Autowired
    private PiezaSTLRepository piezaSTLRepository;
    
    @Autowired
    private ProductoRepository productoRepository;

    public FilamentProfile crearFilamentoPLA() {
        return crearFilamentoPLA(2000.0);
    }

    public FilamentProfile crearFilamentoPLA(Double precioPorKg) {
        FilamentProfile filament = FilamentProfile.builder()
                .nombre("Filamento Test PLA")
                .material("PLA")
                .filamentoPorKg(precioPorKg)
                .build();
        return filamentProfileRepository.save(filament);
    }

    public PiezaSTL crearPiezaBase(FilamentProfile filament) {
        return crearPiezaBase(filament, 100.0, "2h 30m", 100.0);
    }

    public PiezaSTL crearPiezaBase(FilamentProfile filament, Double pesoGramos, String tiempoEstimado, Double costoBase) {
        PiezaSTL pieza = PiezaSTL.builder()
                .nombre("Pieza Test")
                .filePath("test.stl")
                .pesoGramos(pesoGramos)
                .tiempoEstimado(tiempoEstimado)
                .filamentoPreferido(filament)
                .costoBase(costoBase)
                .build();
        return piezaSTLRepository.save(pieza);
    }

    public Producto crearProductoSimple(PiezaSTL pieza) {
        return crearProductoSimple(pieza, 150.0);
    }

    public Producto crearProductoSimple(PiezaSTL pieza, Double precioSugerido) {
        Producto prod = Producto.builder()
                .nombre("Producto Test")
                .partes(new ArrayList<>(List.of(pieza)))
                .precioSugerido(precioSugerido)
                .build();
        return productoRepository.save(prod);
    }

    public Producto crearProductoVacio(Double precioSugerido) {
        Producto prod = Producto.builder()
                .nombre("Producto Vacio")
                .partes(new ArrayList<>())
                .precioSugerido(precioSugerido)
                .build();
        return productoRepository.save(prod);
    }
}
