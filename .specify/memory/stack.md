# Technical Stack - printrm (Speckit Decision Document)

Este documento centraliza el stack tecnológico oficial del proyecto para guiar las próximas implementaciones de Historial y Exportación.

## Frontend Stack (Studio Edition)

| Componente | Tecnología | Uso / Rol |
| :--- | :--- | :--- |
| **Framework** | React 18 (Vite) | SPA Engine |
| **Lenguaje** | TypeScript | Tipado estricto para lógica financiera |
| **Styling** | Tailwind CSS 3.4 | Utility-first con tokens de Studio |
| **UI Components** | shadcn/ui + Radix UI | Componentes base (Modales, Selects) |
| **State Management** | TanStack Query v5 | Sincronización con Backend (Perfiles, Slicing) |
| **Icons** | Lucide React | Iconografía monocromática Ink |
| **Forms** | React Hook Form + Zod | Validación de inputs financieros |
| **Routing** | React Router v6 | Navegación entre Calculadora/Historial |
| **Verification** | Vitest | Tests unitarios para utilidades de cálculo |

### Design Tokens (Studio Constitution)
- **Bordes:** Exactamente `0.5px` (Hairline).
- **Colores:** Monocromáticos (Ink: `#1d1d1f`, Canvas: `#ffffff`, Parchment: `#f5f5f7`).
- **Tipografía:** Inter (Sans) con pesos `400` y `600`. JetBrains Mono para valores monetarios.

---

## Backend Stack (Motor & Persistence)

| Componente | Tecnología | Uso / Rol |
| :--- | :--- | :--- |
| **Runtime** | Java 17 | Lenguaje principal |
| **Framework** | Spring Boot 3.3 | REST API y lógica de negocio |
| **Database** | SQLite 3.45 | Persistencia local (Perfiles e Historial) |
| **ORM** | Hibernate (JPA) | Abstracción de base de datos |
| **Slicer Motor** | PrusaSlicer (CLI) | Motor de laminado 3D (Wrapper nativo) |
| **Dependency Mgmt** | Gradle | Gestión de builds y dependencias |
| **JRE Generation** | jlink | Generación de JRE ligero para portabilidad |

---

## Next Decisions (Phase 003: Historial)

1. **Persistencia del Historial:** Se utilizará JPA con SQLite para almacenar los últimos 50 cálculos.
2. **Generación de CSV:** Se implementará una utilidad nativa en Java para exportar datos, asegurando compatibilidad UTF-8 para Excel.
3. **Compartir WhatsApp:** Lógica de cliente (Frontend) para construir URLs de WhatsApp con el resumen formateado.
4. **Performance:** El motor de cálculo seguirá operando de forma asíncrona para no bloquear la UI durante el slicing.
