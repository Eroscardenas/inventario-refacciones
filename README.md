# Inventario de Refacciones

Sistema web para administrar el inventario de refacciones de un taller.

## Tecnologías
- Angular 21
- Tailwind CSS
- NestJS
- TypeORM
- PostgreSQL

## Funciones
- Registrar refacciones
- Editar refacciones
- Eliminar refacciones
- Buscar por nombre
- Filtrar por categoría
- Control de stock
- Indicador de stock bajo
- Notificaciones visuales

## Requisitos
- Node.js
- npm
- PostgreSQL

## Configuración

### Backend
cd backend
npm install

Configurar las variables de entorno tomando como referencia:

backend/.env.example

### Frontend
cd frontend
npm install

## Ejecutar

Terminal 1:
cd backend
npm run start:dev

Terminal 2:
cd frontend
npm start

Frontend:
http://localhost:4200

API:
http://localhost:3000/api

## Compilar

Backend:
cd backend
npm run build

Frontend:
cd frontend
npm run build