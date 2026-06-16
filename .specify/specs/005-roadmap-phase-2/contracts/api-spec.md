# API Contract: Phase 2 Endpoints

## Base Path: `/api/v1`

### 1. Clientes (CRM)

#### `GET /clientes`
- **Description**: Returns list of all clients.
- **Response**: `200 OK`
  ```json
  [
    {
      "id": "uuid",
      "nombre": "Juan Pérez",
      "email": "juan@example.com",
      "telefono": "+54 9 11 ...",
      "fechaCreacion": "ISO-8601"
    }
  ]
  ```

#### `POST /clientes`
- **Description**: Create a new client.
- **Request Body**:
  ```json
  {
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "telefono": "+54 9 ..."
  }
  ```

### 2. Biblioteca (STL)

#### `GET /biblioteca`
- **Description**: Returns all stored pieces with metadata.

#### `POST /biblioteca`
- **Description**: Persists an analyzed STL piece.

### 3. Exportación (Sharing)

#### `POST /export/whatsapp`
- **Description**: Returns a pre-encoded URL for WhatsApp sharing based on a calculation snapshot.
- **Request Body**: `{ "calculoId": "uuid" }`
- **Response**: `{ "url": "https://wa.me/..." }`
