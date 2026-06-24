Feature: Flujo de integración de Pedidos y Producción
  Como encargado del taller
  Quiero que el sistema soporte el ciclo de vida real de un pedido
  Para poder controlar mermas, repeticiones de piezas y entregas exitosas

  Scenario: Cliente realiza un pedido que sufre mermas en producción pero se completa
    Given que existe una pieza STL en la biblioteca
    And existe un producto asociado a esa pieza
    And existe un cliente llamado "Juansito"
    When el cliente "Juansito" pide 3 unidades de ese producto
    And el pedido se manda a fabricar
    And durante la producción se registra una merma de 1 unidad y 2 se fabrican con éxito
    And se produce 1 unidad más para compensar la merma
    Then el pedido puede confirmarse y registrarse como completado
