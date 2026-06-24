package com.printrm.studio.steps;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import static org.junit.jupiter.api.Assertions.assertTrue;

// Al tener CucumberSpringConfiguration en el classpath, podés inyectar servicios aquí
// import org.springframework.beans.factory.annotation.Autowired;
// import com.printrm.studio.domain.pedidos.PedidoService;

public class EjemploSteps {

    // @Autowired
    // private PedidoService pedidoService;

    @Given("un sistema con estado inicial")
    public void un_sistema_con_estado_inicial() {
        // Inicializar datos o mocks (ej. crear cliente en BD)
        System.out.println("-> Ejecutando Given: Setup inicial");
    }

    @When("realizo una acción {string}")
    public void realizo_una_accion(String accion) {
        // Ejecutar la lógica de negocio usando los Services
        System.out.println("-> Ejecutando When con acción: " + accion);
    }

    @Then("el resultado debe ser exitoso")
    public void el_resultado_debe_ser_exitoso() {
        // Validar el resultado con assertions
        System.out.println("-> Ejecutando Then: Validando resultados");
        assertTrue(true, "El resultado fue exitoso");
    }
}
