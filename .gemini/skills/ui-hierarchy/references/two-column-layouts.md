# Layouts de dos columnas — Inputs + Resultados

El patrón más común en apps de cálculo, análisis, o configuración: el usuario ingresa datos a la izquierda y ve resultados a la derecha.

## El error más frecuente

Tratar ambas columnas como iguales. El usuario viene a ver el resultado. Los inputs son el camino, no el destino.

## Principio base

```
COLUMNA IZQUIERDA = zona de trabajo (inputs, parámetros)
COLUMNA DERECHA   = zona de resultado (el por qué abrieron la pantalla)

→ La columna derecha debe "ganar" visualmente.
→ La columna izquierda debe siente como un panel/sidebar, no como contenido principal.
```

## Layout recomendado (Tailwind)

```jsx
<div className="grid grid-cols-[1fr_380px] gap-8 min-h-screen p-8">
  {/* Columna izquierda — panel de trabajo */}
  <div className="bg-muted/40 rounded-2xl p-6 space-y-8">
    {/* contenido del formulario/parámetros */}
  </div>
  
  {/* Columna derecha — resultado sticky */}
  <div className="sticky top-8 h-fit">
    <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
      {/* NIVEL 1: el resultado principal */}
      <div className="text-center py-4">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
          Precio sugerido
        </p>
        <p className="text-5xl font-black text-foreground">
          $ 1.393,48
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Multiplicador 3x
        </p>
      </div>
      
      {/* Separador */}
      <hr className="border-border" />
      
      {/* NIVEL 2: desglose */}
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.label} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{item.label}</span>
            <span className="font-medium">{item.value}</span>
          </div>
        ))}
      </div>
      
      {/* CTA pegado al resultado */}
      <button className="w-full bg-foreground text-background rounded-xl py-3 text-sm font-semibold">
        Guardar en Historial
      </button>
    </div>
  </div>
</div>
```

## Jerarquía interna de la columna de resultados

```
PRECIO / RESULTADO PRINCIPAL        ← 48-64px, font-black
  label descriptivo pequeño         ← 11-12px, uppercase, muted
  sub-info (ej: "Multiplicador 3x") ← 13px, muted

──── separador ────

Costo Energía        $ 0,00          ← 13-14px ambos
Costo Filamento    $ 410,85
Desgaste Máquina    $ 11,42

──── separador ────

Costo Base        $ 464,49           ← 14px, font-semibold (subtotal)

────────────────────────────────────

[   Guardar en Historial   ]         ← botón full-width
```

## Columna izquierda — estructura interna

```
TÍTULO DE SECCIÓN                    ← 11px uppercase tracking-widest muted
  Input principal (el más importante) ← más grande o con más espacio
  Inputs secundarios                  ← tamaño estándar
  
  [opciones rápidas: 3X | 4X | 5X]   ← chips pequeños, no botones grandes

TÍTULO SECCIÓN 2
  ...
```

## Cuándo usar sticky vs no sticky

- **Sticky** (recomendado): cuando los parámetros son muchos y el usuario scrollea
- **No sticky**: cuando toda la pantalla entra en una sola vista sin scroll

## Señal de alerta

Si el usuario tiene que scrollear para ver el resultado después de cambiar un parámetro → implementar sticky obligatoriamente.
