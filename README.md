# Inventario de Refacciones

Sistema web para la administración de inventario de refacciones desarrollado como una arquitectura cliente-servidor utilizando **Angular 21**, **NestJS**, **PostgreSQL** y **Docker**.

La aplicación permite administrar el inventario mediante operaciones CRUD, ofreciendo una interfaz moderna y una API REST desacoplada para la gestión de los datos.

---

# Tecnologías utilizadas

## Frontend

- Angular 21
- TypeScript
- Tailwind CSS
- Toastify JS

## Backend

- NestJS
- TypeORM
- PostgreSQL
- class-validator
- class-transformer

## Infraestructura

- Docker
- Docker Compose
- Nginx

---

# Arquitectura del sistema

```text
                 Angular 21
                      │
                      │ HTTP
                      ▼
               NestJS REST API
                      │
                  TypeORM ORM
                      │
                      ▼
                PostgreSQL 16
```

---

# Funcionalidades implementadas

- Registro de nuevas refacciones.
- Consulta del inventario.
- Edición de refacciones.
- Eliminación de registros.
- Búsqueda por nombre.
- Filtrado por categoría.
- Validación de datos en cliente y servidor.
- Control de stock.
- Indicador visual de stock bajo.
- Notificaciones visuales mediante Toastify.
- Persistencia de datos en PostgreSQL.
- API REST desarrollada con NestJS.
- Contenedorización completa mediante Docker.

---

# Decisiones técnicas

## Arquitectura desacoplada

El proyecto fue dividido en dos aplicaciones independientes:

- Frontend desarrollado con Angular.
- Backend desarrollado con NestJS.

Ambas aplicaciones se comunican mediante una API REST.

---

## Persistencia de datos

La aplicación utiliza PostgreSQL como gestor de base de datos.

El acceso a los datos se realiza mediante **TypeORM**, permitiendo trabajar con entidades y repositorios sin escribir consultas SQL para las operaciones básicas.

Los identificadores de cada refacción son administrados automáticamente por PostgreSQL mediante `@PrimaryGeneratedColumn()`.

---

## Variables de entorno

La configuración del backend se realiza mediante variables de entorno utilizando:

- `@nestjs/config`
- `@nestjs/typeorm`

Esto permite desacoplar la configuración del código fuente y facilitar el despliegue en distintos entornos.

---

## Validaciones

Las solicitudes recibidas por el backend son validadas utilizando:

- class-validator
- class-transformer

Se valida, entre otros aspectos:

- Nombre obligatorio.
- SKU obligatorio.
- Precio mayor o igual a cero.
- Stock mayor o igual a cero.

---

## Comunicación entre aplicaciones

El frontend y el backend se ejecutan en puertos distintos.

```
Angular
http://localhost:4200

↓

NestJS
http://localhost:3000/api

↓

PostgreSQL
```

Para permitir la comunicación entre ambas aplicaciones se habilitó CORS únicamente para el frontend autorizado.

---

## Optimización del renderizado

La tabla del inventario utiliza la nueva sintaxis de Angular:

```ts
@for (refaccion of refacciones; track refaccion.id)
```

Esto permite que Angular actualice únicamente las filas modificadas en lugar de volver a renderizar toda la tabla.

---

## Server Side Rendering

Durante la creación del proyecto **no** se habilitó Server Side Rendering (SSR), ya que se trata de una aplicación interna orientada a la administración del inventario y no requiere posicionamiento SEO ni generación de contenido estático.

---

# Principios aplicados

Durante el desarrollo se siguieron los siguientes criterios:

- Arquitectura cliente-servidor.
- Separación entre frontend y backend.
- Organización modular del backend.
- Componentes reutilizables en Angular.
- Validaciones tanto en cliente como en servidor.
- Persistencia mediante PostgreSQL.
- Configuración mediante variables de entorno.
- Contenedorización utilizando Docker.
- Interfaz responsiva desarrollada con Tailwind CSS.

---

# Requisitos

Para ejecutar el proyecto únicamente es necesario tener instalado:

- Docker
- Docker Compose

---

# Instalación

Clonar el repositorio.

```bash
git clone <URL_DEL_REPOSITORIO>
```

Entrar al proyecto.

```bash
cd inventario-refacciones
```

Levantar toda la aplicación.

```bash
docker compose up --build
```

---

# Servicios

Una vez iniciados los contenedores estarán disponibles:

| Servicio | Dirección |
|----------|-----------|
| Frontend | http://localhost:4200 |
| Backend | http://localhost:3000/api |
| API Refacciones | http://localhost:3000/api/refacciones |

---

# Desarrollo sin Docker

## Backend

```bash
cd backend
npm install
npm run start:dev
```

## Frontend

```bash
cd frontend
npm install
npm start
```

---

# Variables de entorno

El backend utiliza un archivo `.env` con la siguiente estructura:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432

DB_USERNAME=inventario_app
DB_PASSWORD=********

DB_DATABASE=inventario_refacciones
```

Cuando la aplicación se ejecuta mediante Docker Compose estas variables son configuradas automáticamente.

---

# Estructura del proyecto

```text
inventario-refacciones
│
├── backend
│   ├── src
│   ├── Dockerfile
│   └── .dockerignore
│
├── frontend
│   ├── src
│   ├── Dockerfile
│   └── .dockerignore
│
├── docker-compose.yaml
│
└── README.md
```

---

# Mejoras adicionales

El sistema fue diseñado para permitir nuevas funcionalidades sin modificar la arquitectura actual.

Entre las mejoras consideradas se encuentran:

- Implementar un estado **Agotado** cuando el stock llegue a cero.
- Dashboard con métricas generales del inventario.
- Tabla dedicada a productos con stock bajo para facilitar el reabastecimiento.
- Autocompletado de categorías utilizando las categorías previamente registradas.
- Catálogo independiente de categorías para evitar duplicados.
- Iconografía profesional utilizando Lucide Angular.
- Confirmaciones visuales mediante diálogos personalizados en sustitución de ventanas nativas.
- Ordenamiento y paginación del inventario.
- Historial de movimientos de entrada y salida.
- Gestión de proveedores.
- Exportación de reportes a PDF y Excel.
- Autenticación y autorización de usuarios.
- Auditoría de cambios realizados por usuario.
- Modo claro y modo oscuro.

---

# Autor

**Eros Cárdenas**

Prueba técnica desarrollada utilizando Angular, NestJS, PostgreSQL y Docker.