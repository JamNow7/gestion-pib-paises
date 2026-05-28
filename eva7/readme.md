# Backend Evaluación Países

Backend desarrollado en Node.js y PostgreSQL para administrar información de países, PIB y acciones de auditoría sobre los registros.

## 📋 Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
- [Configuración de Base de Datos](#configuración-de-base-de-datos)
- [Ejecución](#ejecución)
- [Endpoints](#endpoints)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)

## 🛠️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v18 o superior) - [Descargar](https://nodejs.org/)
- **npm** (viene incluido con Node.js)
- **PostgreSQL** (v12 o superior) - [Descargar](https://www.postgresql.org/download/)

Verifica las instalaciones:

```bash
node --version
npm --version
psql --version
```

## 📦 Instalación

1. **Clona el repositorio** (o navega al directorio del proyecto):

```bash
cd /ruta/a/tu/proyecto/eva7
```

2. **Instala las dependencias**:

```bash
npm install
```

Esto instalará:
- `express` - Framework web
- `cors` - Middleware para CORS
- `dotenv` - Manejo de variables de entorno
- `pg` - Cliente de PostgreSQL
- `nodemon` (devDependency) - Reinicio automático en desarrollo

## ⚙️ Configuración de Variables de Entorno

1. **Crea el archivo `.env`**:

```bash
touch .env
```

2. **Configura las variables de entorno** en el archivo `.env`:

```env
# Configuración de Base de Datos PostgreSQL
DB_USER=postgres
DB_PASSWORD=tu_contraseña_aqui
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=eva7

# Puerto del Servidor Backend
PORT=4000
```

**Importante:** Reemplaza los valores con tus credenciales reales de PostgreSQL.

## 🗄️ Configuración de Base de Datos

### Opción 1: Usar base de datos existente

Si ya tienes una base de datos PostgreSQL configurada, simplemente asegúrate de que las credenciales en `.env` sean correctas.

### Opción 2: Crear nueva base de datos

1. **Conéctate a PostgreSQL**:

```bash
psql -U postgres
```

2. **Crea la base de datos**:

```sql
CREATE DATABASE eva7;
\q
```

3. **Ejecuta el script de inicialización** (si existe):

```bash
psql -U postgres -d eva7 -f database/init.sql
```

## 🚀 Ejecución

### Modo Desarrollo

Para desarrollo con reinicio automático:

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:4000` y se reiniciará automáticamente ante cambios.

### Modo Producción

Para ejecutar en producción:

```bash
npm start
```

**Verificación:** Deberías ver el mensaje:
```
Servidor escuchando en el puerto 4000
```

### Probar que el servidor está funcionando

```bash
curl http://localhost:4000/paises
```

## 🌐 Endpoints

El backend expone los siguientes endpoints:

### Obtener Países (con paginación)
```http
GET /paises?limit=10&offset=0
```

**Parámetros:**
- `limit` (opcional) - Cantidad de registros a retornar (default: 10)
- `offset` (opcional) - Cantidad de registros a saltar (default: 0)

**Respuesta:**
```json
[
  {
    "nombre": "Argentina",
    "continente": "América del Sur",
    "poblacion": 45376763,
    "pib_2019": 477742000000,
    "pib_2020": 389200000000
  }
]
```

### Crear País
```http
POST /paises
Content-Type: application/json

{
  "nombre": "Chile",
  "continente": "América del Sur",
  "poblacion": 19116201,
  "pib_2019": 282800000000,
  "pib_2020": 252700000000
}
```

### Eliminar País
```http
DELETE /paises/:nombre
```

## 📁 Estructura del Proyecto

```
eva7/
├── database/
│   └── init.sql           # Script de inicialización de DB
├── queries/
│   └── *.sql              # Consultas SQL
├── src/
│   ├── config.js          # Configuración y variables de entorno
│   ├── db.js              # Conexión a base de datos
│   ├── index.js           # Punto de entrada de la aplicación
│   ├── controllers/       # Lógica de controladores
│   └── routes/            # Definición de rutas
├── .env                   # Variables de entorno (no versionar)
├── .gitignore            # Archivos ignorados por Git
├── package.json           # Dependencias del proyecto
└── readme.md             # Este archivo
```

## 🔧 Tecnologías Utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web minimalista
- **PostgreSQL** - Base de datos relacional
- **pg** - Cliente PostgreSQL para Node.js
- **dotenv** - Manejo de variables de entorno
- **cors** - Middleware para habilitar CORS
- **nodemon** - Herramienta de desarrollo

## 💡 Características Adicionales

### Paginación
En lugar de usar cursores (`pg-cursor`), se implementó paginación con `LIMIT` y `OFFSET`, lo que permite obtener registros en bloques de forma ordenada y eficiente.

### Manejo de Transacciones
Todas las operaciones de escritura (inserción, eliminación) se ejecutan dentro de transacciones usando:
- `BEGIN` - Inicio de transacción
- `COMMIT` - Confirmación de cambios
- `ROLLBACK` - Revertir cambios en caso de error

Esto garantiza la integridad de los datos y evita cambios parciales.

### Sistema de Auditoría
Cada operación de inserción y eliminación queda registrada automáticamente en la tabla de auditoría para trazabilidad completa.

## 👤 Autor

**Claudio Cataldo**

## 📄 Licencia

Este proyecto es de uso académico/educativo.
