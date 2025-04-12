# Backend
~A great repository for the Backend~


# Instalar node js:

Descargar msi : https://nodejs.org/en/download/

Luego el comando "node -v" en terminal

Luego correr el powershell como administrador y correr el comando "Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned"

Luego el comando "npm -v"

# Instalar typescript

Correr los siguientes comandos: 

npm install -D typescript
npm install -D ts-node
npm install -D nodemon
npm i express body-parser cookie-parser compression cors
npm i -D @types/express @types/body-parser @types/cookie-parser @types/compression @types/cors

# Instalar PostgreSQL

npm install pg @types/pg dotenv

# Prueba de test-db

npx ts-node src/test-db/testdb.ts

# Workflow for user/admin register

```mermaid
sequenceDiagram
    participant Mobile
    participant Web
    participant US as User Service
    participant MW as Middleware
    participant DB as Database

    %% Mobile User Registration Flow
    rect rgb(0, 0, 0)
    Note over Mobile,DB: Mobile User Registration Flow
    Mobile->>US: POST /auth/register
    Note right of Mobile: Firebase Token in body
    activate US
    
    US->>MW: Validate Firebase Token
    MW-->>US: Token Valid
    
    US->>DB: Check if user exists
    DB-->>US: User not found
    US->>DB: Create user
    DB-->>US: User created
    US-->>Mobile: 201 - User registered
    deactivate US
    end

    %% Web Admin Registration Flow
    rect rgb(0, 0, 0)
    Note over Web,DB: Web Admin Registration Flow
    Web->>US: POST /admin/register
    Note right of Web: Firebase Token in body + JWT admin token in header
    activate US
    
    US->>MW: Validate JWT Admin Token
    MW-->>US: Admin Role Valid
    US->>MW: Validate Firebase Token
    MW-->>US: Token Valid
    
    alt Not Admin Role
        US-->>Web: 403 - Forbidden
    else Is Admin
        US->>DB: Check if admin exists
        DB-->>US: Admin not found
        US->>DB: Create admin
        DB-->>US: Admin created
        US-->>Web: 201 - Admin registered
    end
    deactivate US
    end
```

## Esquema de Usuario: Validaciones de Registro

Este esquema define los campos requeridos para el registro de un usuario general (usuario de mobile) y de un administrador (usuario de web), así como sus reglas de validación para garantizar consistencia y seguridad en los datos.

## Campos requeridos

| Campo       | Tipo    | Reglas de Validación                                                                 |
|-------------|---------|---------------------------------------------------------------------------------------|
| `email`     | String  | - Debe ser un correo válido<br>- Debe terminar en `@ucr.ac.cr`<br>- **Requerido**       |
| `password`  | String  | - Mínimo 6 caracteres<br>- Máximo 15 caracteres<br>- Debe incluir:<br>&nbsp;&nbsp;&nbsp;• Al menos una letra mayúscula<br>&nbsp;&nbsp;&nbsp;• Al menos una letra minúscula<br>&nbsp;&nbsp;&nbsp;• Al menos un número<br>- **Requerido** |
| `full_name` | String  | - Mínimo 3 caracteres<br>- Máximo 25 caracteres<br>- Solo letras (incluyendo acentos) y espacios<br>- **Requerido** |

No se requiere source: web | mobile por el momento ya que se tendrán 2 endpoints para cada funcionalidad:

# User Management API

## Registration Endpoints

### Register User
`POST /user/auth/register`

#### Request
```json
{
  "email": "usuario@ucr.ac.cr",      // Required, must be @ucr.ac.cr
  "full_name": "Juan Pérez",         // Required, 3-25 chars, letters & spaces
  "profile_picture": "http://...",   // Optional URL
  "firebaseToken": "token123..."     // Required
}
```

#### Headers
No special headers required

#### Response
```json
// Success (201)
{
  "status": 201,
  "message": "User registered successfully."
}

// Error (400, 401, 409, 500)
{
  "status": 400,
  "message": "Validation error",
  "details": ["El correo debe ser institucional de la UCR"]
}
```

### Register Admin
`POST /admin/auth/register`

#### Request
```json
{
  "email": "admin@ucr.ac.cr",       // Required, must be @ucr.ac.cr
  "full_name": "Admin User",        // Required, 3-25 chars, letters & spaces
  "profile_picture": "http://...",  // Optional URL
  "firebaseToken": "token123..."    // Required
}
```

#### Headers
```http
Authorization: Bearer <jwt-token>    // Required, must contain admin role
```


### Códigos de estado esperados

| Código | Tipo de error                       | Descripción                                                                 |
|--------|-------------------------------------|-----------------------------------------------------------------------------|
| 400    | Bad Request                         | Alguno de los campos no cumple con las validaciones establecidas (Yup).    |
| 401    | Unauthorized                        | Token de Firebase inválido o ausente.                                      |
| 403    | Forbidden                           | El usuario autenticado no tiene permisos para crear un nuevo admin.        |
| 409    | Conflict                            | El correo ya existe en la base de datos (usuario o admin duplicado).       |
| 500    | Internal Server Error               | Error inesperado del servidor (por ejemplo, error de conexión a DB, etc).  |

---

### Ejemplo de error 400 (Validación)

```json
{
  "status": 400,
  "message": "Validation Error",
  "details": ["El correo debe ser institucional de la UCR"]
}
```
### Ejemplo de exito 2001

```json
{
  "status": 201,
  "message": "User/Admin registered successfully."
}
```