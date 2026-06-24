package com.printrm.studio.config;

import io.cucumber.spring.CucumberContextConfiguration;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;

@CucumberContextConfiguration
@SpringBootTest
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
public class CucumberSpringConfiguration {
    // Esta clase integra Cucumber con Spring Boot.
    // Solo con existir y tener estas anotaciones, le dice a Cucumber que levante el contexto de Spring
    // para que en tus clases de Steps puedas usar @Autowired en Repositories y Services.
}
