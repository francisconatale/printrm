Feature: Devolución de ventas directas (POS)
  Como encargado del taller
  Quiero poder devolver productos de forma parcial
  Para que la caja refleje correctamente las devoluciones

  Background:
    Given un balance inicial de 1000 en caja
    And un producto "Llavero Test" con precio 500
    And stock de 10 unidades fabricadas con costo 100 cada una

  Scenario: Devolución parcial actualiza la caja correctamente
    When se venden 2 unidades del producto
    Then el balance de caja aumentó en 1000
    And el stock del producto es 8
    When se devuelve 1 unidad del producto
    Then el balance de caja se redujo en 500
    And el stock del producto volvió a 9

  Scenario: No permite devolución duplicada
    Given una venta de 2 unidades del producto
    When se devuelven 2 unidades del producto
    Then la devolución se procesa correctamente
    When se intenta devolver 2 unidades del mismo producto nuevamente
    Then el sistema rechaza la devolución por exceder las unidades disponibles
    And el balance de caja no se modifica respecto al paso anterior
