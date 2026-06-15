# Pantallas con muchos números y métricas

## El problema específico de los números

Los valores numéricos grandes naturalmente atraen el ojo. Cuando hay varios números prominentes, el cerebro no sabe cuál leer primero.

## Regla de oro: un número manda

Por pantalla, hay UN número que importa más que todos los demás. Ese número debe tener:
- Al menos el doble del tamaño de los números secundarios
- Más espacio en blanco alrededor
- Un label pequeño que lo contextualice (nunca del mismo tamaño)

## Escala tipográfica para números

```
NÚMERO PROTAGONISTA:    text-5xl / text-6xl  (48-60px) — font-black o font-bold
SUBTOTAL / RESULTADO:   text-2xl / text-3xl  (24-30px) — font-semibold
ÍTEMS DE DESGLOSE:      text-sm / text-base  (14-16px) — font-medium
LABELS DE ÍTEMS:        text-sm              (14px)    — font-normal, color muted
METADATA / UNIDADES:    text-xs              (12px)    — font-normal, color muted

⚠️ Nunca usar text-2xl para más de 2-3 números en la misma pantalla.
```

## Badges y pills de estado (ej: "MARGEN ERROR: 10%")

```jsx
// MAL: badge con mismo peso visual que labels de costos
<span className="text-sm font-bold">MARGEN ERROR: 10%</span>

// BIEN: badge contenido que no compite
<span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
  Margen error 10%
</span>
```

## Agrupar números relacionados

Los números que pertenecen al mismo grupo visual deben estar juntos con separación interna consistente, y separados del siguiente grupo con más espacio:

```
Costo Energía      $ 0,00      ┐
Costo Filamento  $ 410,85      │ grupo "costos directos"
Desgaste Máquina  $ 11,42      ┘

                               ← espacio mayor aquí (gap-4 o más)

Costo Base       $ 464,49      → subtotal del grupo (slightly bolder)
```

## Cuándo usar líneas divisoras

- ✅ Para separar grupos temáticos (costos vs. precio final)
- ✅ Para separar el CTA del contenido
- ❌ Para separar cada ítem individualmente (genera ruido)
- ❌ Si ya hay espacio suficiente entre grupos (el espacio ES el divisor)

## Números negativos y cero

- El $ 0,00 en "Costo Energía" puede deprimirse visualmente con `text-muted-foreground`
  para que no compita con valores que sí importan
- Considerar `—` en vez de `$ 0,00` si el cero es el caso por defecto

## Pattern: desglose colapsable

Si hay más de 5-6 ítems de desglose, considerar colapsar los secundarios:

```jsx
<div>
  <p className="text-5xl font-black">$ 1.393,48</p>
  
  {/* Total visible siempre */}
  <div className="flex justify-between text-sm mt-4">
    <span className="text-muted-foreground">Costo Base</span>
    <span className="font-medium">$ 464,49</span>
  </div>
  
  {/* Desglose expandible */}
  <button 
    onClick={() => setExpanded(!expanded)}
    className="text-xs text-muted-foreground mt-2 flex items-center gap-1"
  >
    Ver desglose {expanded ? '↑' : '↓'}
  </button>
  
  {expanded && (
    <div className="space-y-2 mt-2">
      {/* ítems individuales */}
    </div>
  )}
</div>
```
