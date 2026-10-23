<p align="center">
  <img src="frontend/public/logo.png" alt="Printrm Logo" width="120" />
</p>

<h1 align="center">Printrm Studio</h1>

<p align="center">
  All-in-one management, cost calculation, and production tracking platform for 3D printing studios and makers.
</p>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#configuration">Configuration</a>
</p>

---

## Overview

**Printrm Studio** is a unified desktop-first management suite tailored specifically for 3D printing businesses. It streamlines the entire fabrication lifecycle—from interactive 3D model inspection and precision cost calculation to customer orders, production scheduling, inventory management, and financial ledger accounting.

---

## Key Features

- **Precision Cost Calculator**: Calculates actual unit costs by factoring in energy consumption (kWh), filament weight and type, machine wear/depreciation per operating hour, additional hardware/supplies, failure risk margins, and target profit multipliers.
- **Interactive 3D STL Viewer**: Built-in Three.js / React Three Fiber canvas supporting real-time model rotation, inspection, and automatic preview capture.
- **STL Model Library**: Centralized storage for 3D files with attached print profiles, dimensions, print times, and thumbnail rendering.
- **Production Schedule**: Real-time tracking of active print jobs, queue management, and material adjustments for partial or total print failures (*mermas*).
- **Orders & Client Management**: Complete customer relationship workflow with order status lifecycle tracking (Quoted, In Production, Ready, Delivered), linked production jobs, and payment records.
- **Inventory & Stock Tracking**: Catalog for finished goods, component assemblies (bill of materials), lot tracking, and automatic stock depletion upon dispatch.
- **Point of Sale (POS)**: Fast checkout interface for immediate stock sales, receipts, and refund handling.
- **Financial Ledger & Metrics**: Double-entry transaction journal with automated revenue/expense logging, category filtering, date range queries, and net operational balance calculations.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, TanStack Query v5, Lucide Icons, Sonner |
| **3D Rendering** | Three.js, `@react-three/fiber`, `@react-three/drei` |
| **Backend** | Java 17, Spring Boot 3.3, Spring Data JPA, Hibernate, SQLite JDBC |
| **Testing** | JUnit 5, Cucumber BDD |
| **Design System** | Studio Tight UI tokens based on CSS variables (desktop-first) |

---

## Project Structure

```text
printrm/
├── backend/                  # Spring Boot application
│   ├── src/
│   │   ├── main/             # Application controllers, services, entities
│   │   └── test/             # Unit and Cucumber integration tests
│   ├── build.gradle          # Gradle build and dependency configuration
│   ├── gradlew               # Gradle Unix wrapper
│   ├── gradlew.bat           # Gradle Windows wrapper
│   └── studio.db             # Local SQLite database file
├── frontend/                 # React single-page application (SPA)
│   ├── public/               # Static assets (logo, sample files)
│   ├── src/
│   │   ├── components/       # Layout, shell, navigation, and reusable UI primitives
│   │   ├── features/         # Domain modules (calculo, pedidos, stock, finanzas, etc.)
│   │   ├── hooks/            # Custom React hooks (health check, mutations, modals)
│   │   └── lib/              # API client and date/formatting utilities
│   ├── package.json          # Frontend dependencies and scripts
│   ├── tailwind.config.js    # Tailwind styling tokens
│   └── vite.config.ts        # Vite build configuration
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher (para ejecución local sin Docker)
- **Java JDK**: Version 17 or higher (para ejecución local sin Docker)
- **Docker & Docker Compose** (para despliegue en contenedores)
- **Git**

### Opción 1: Ejecutar con Docker Compose (Recomendado)

Levanta frontend y backend con un solo comando:

```bash
docker compose up -d --build
```

- **Frontend (Web):** [http://localhost:5173](http://localhost:5173) (Nginx sirviendo el build de React y enrutando `/api/` al backend)
- **Backend (API):** [http://localhost:8082](http://localhost:8082) (o el puerto configurado en `BACKEND_PORT`)
- **Healthcheck:** [http://localhost:8082/api/health](http://localhost:8082/api/health) o [http://localhost:5173/api/health](http://localhost:5173/api/health)
- **Persistencia:** La base de datos SQLite y los modelos STL subidos se persisten automáticamente en el volumen Docker `printly-backend-data`.

Para detener los servicios:
```bash
docker compose down
```

### Opción 2: Ejecución Local en Modo Desarrollo

#### 1. Run the Backend

The backend uses an embedded SQLite database, requiring zero external database setup.

```bash
cd backend
./gradlew bootRun
```

On Windows:
```cmd
cd backend
gradlew.bat bootRun
```

The API server will start on `http://localhost:8080/api`.

> [!NOTE]
> Database persistence defaults to `studio.db` in the `backend/` directory. Schema updates are automatically applied on startup via Hibernate DDL.

### 2. Run the Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## Configuration

Backend settings can be adjusted in [`backend/src/main/resources/application.properties`](backend/src/main/resources/application.properties):

| Property | Default | Purpose |
|---|---|---|
| `server.port` | `8080` | Backend HTTP port |
| `spring.datasource.url` | `jdbc:sqlite:studio.db` | SQLite database file location |
| `spring.servlet.multipart.max-file-size` | `50MB` | Maximum allowed STL file upload size |
| `studio.base-path` | `.` | Root storage directory for uploaded files |

Frontend environment variables can be set via `.env` in `frontend/`:

```env
VITE_API_URL=http://localhost:8080/api
```

> [!TIP]
> When uploading STL files in the **Calculadora** or **Biblioteca** sections, ensure the model has valid geometry to allow automatic volume estimation and 3D bounding calculations.
