# 🌍 API de Gestión de Países

Backend desarrollado en Node.js y PostgreSQL para administrar información de países, PIB y acciones de auditoría sobre los registros.

**¡Ahora con VERSIONAMIENTO DE API implementado!** 🚀

## 📋 Tabla de Contenidos

- [Versiones de la API](#versiones-de-la-api)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
- [Ejecución](#ejecución)
- [Prueba de Versiones](#prueba-de-versiones)
- [Endpoints](#endpoints)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)

---

## 🎯 Versiones de la API

### **Versión 1 (v1)** - Estable ✅
- `GET /api/v1/paises` - Listado de países
- `POST /api/v1/paises` - Crear país
- `DELETE /api/v1/paises/:nombre` - Eliminar país

### **Versión 2 (v2)** - Nueva con Mejoras 🚀
- `GET /api/v2/paises` - Listado con metadata mejorada
- `POST /api/v2/paises` - Crear país con respuesta detallada
- `DELETE /api/v2/paises/:nombre` - Eliminar con confirmación
- `GET /api/v2/paises/continente/:continente` - **NUEVO: Búsqueda por continente**

**Documentación detallada:** [VERSIONES.md](./VERSIONES.md)

---

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

---

## 📦 Instalación

1. **Instala las dependencias**:

```bash
npm install
```

Esto instalará:
- `express` - Framework web
- `cors` - Middleware para CORS
- `dotenv` - Manejo de variables de entorno
- `pg` - Cliente de PostgreSQL
- `node-fetch` - Para pruebas de versionamiento
- `nodemon` (devDependency) - Reinicio automático en desarrollo

---

## ⚙️ Configuración de Variables de Entorno

1. **Crea el archivo `.env`**:

```bash
cp .env.example .env
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

---

## 🗄️ Configuración de Base de Datos

### Crear nueva base de datos

1. **Conéctate a PostgreSQL**:

```bash
psql -U postgres
```

2. **Crea la base de datos**:

```sql
CREATE DATABASE eva7;
\q
```

3. **Ejecuta el script de inicialización**:

```bash
psql -U postgres -d eva7 -f database/init.sql
```

---

## 🚀 Ejecución

### Modo Desarrollo

Para desarrollo con reinicio automático:

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:4000` con las siguientes salidas:

```
API escuchando en http://localhost:4000
Endpoints disponibles:
  v1: http://localhost:4000/api/v1/paises
  v2: http://localhost:4000/api/v2/paises (nuevas funcionalidades)
```

### Modo Producción

```bash
npm start
```

---

## 🧪 Prueba de Versiones

### Ejecutar script de comparación

```bash
npm run test:versions
```

Este script mostrará:
- ✅ Respuesta de V1 (formato simple)
- 🚀 Respuesta de V2 (formato mejorado)
- 🆕 Nueva funcionalidad de búsqueda por continente
- 📊 Comparación detallada entre versiones

### Pruebas manuales

```bash
# Probar V1
curl http://localhost:4000/api/v1/paises

# Probar V2
curl http://localhost:4000/api/v2/paises

# Probar nueva funcionalidad V2
curl http://localhost:4000/api/v2/paises/continente/America
```

---

## 🌐 Endpoints

### **Versión 1**

#### Obtener Países (con paginación)
```http
GET /api/v1/paises?limit=10&offset=0
```

**Respuesta V1:**
```json
{
  "ok": true,
  "data": [
    {
      "nombre": "Argentina",
      "continente": "América del Sur",
      "poblacion": 45376763,
      "pib_2019": 477742000000,
      "pib_2020": 389200000000
    }
  ]
}
```

#### Crear País
```http
POST /api/v1/paises
Content-Type: application/json

{
  "nombre": "Chile",
  "continente": "América del Sur",
  "poblacion": 19116201,
  "pib_2019": 282800000000,
  "pib_2020": 252700000000
}
```

#### Eliminar País
```http
DELETE /api/v1/paises/:nombre
```

### **Versión 2**

#### Obtener Países (con metadata mejorada)
```http
GET /api/v2/paises?limit=10&offset=0
```

**Respuesta V2:**
```json
{
  "success": true,
  "result": {
    "countries": [
      {
        "nombre": "Argentina",
        "continente": "América del Sur",
        "poblacion": 45376763,
        "pib_2019": 477742000000,
        "pib_2020": 389200000000
      }
    ],
    "pagination": {
      "total": 5,
      "limit": 10,
      "offset": 0,
      "hasMore": false
    },
    "timestamp": "2025-01-15T10:30:00.000Z",
    "version": "2.0"
  }
}
```

#### Búsqueda por Continente (NUEVO)
```http
GET /api/v2/paises/continente/America
```

---

## 📁 Estructura del Proyecto

```
eva7/
├── database/
│   └── init.sql                    # Script de inicialización de DB
├── queries/
│   └── *.sql                       # Consultas SQL
├── src/
│   ├── config.js                   # Configuración y variables de entorno
│   ├── db.js                       # Conexión a base de datos
│   ├── index.js                    # Punto de entrada con versionamiento
│   ├── controllers/
│   │   ├── paises.controller.js    # Controlador V1
│   │   └── paises.v2.controller.js # Controlador V2
│   └── routes/
│       ├── paises.routes.js        # Rutas V1
│       └── paises.v2.routes.js    # Rutas V2
├── test-versions.js                # Script de prueba de versiones
├── VERSIONES.md                    # Documentación detallada de versiones
├── .env.example                   # Plantilla de variables de entorno
├── package.json                   # Dependencias del proyecto
└── readme.md                      # Este archivo
```

---

## 🔧 Tecnologías Utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web minimalista
- **PostgreSQL** - Base de datos relacional
- **pg** - Cliente PostgreSQL para Node.js
- **dotenv** - Manejo de variables de entorno
- **cors** - Middleware para habilitar CORS
- **node-fetch** - Cliente HTTP para pruebas
- **nodemon** - Herramienta de desarrollo

---

## 💡 Características Adicionales

### Versionamiento de API 🚀
- **Compatibilidad hacia atrás**: V1 sigue funcionando
- **Evolución controlada**: V2 introduce cambios sin romper V1
- **Migración gradual**: Clientes eligen cuándo migrar
- **Mejoras continuas**: V2 añade funcionalidades

### Paginación
Implementación con `LIMIT` y `OFFSET` para obtener registros en bloques de forma ordenada y eficiente.

### Manejo de Transacciones
Todas las operaciones de escritura se ejecutan dentro de transacciones:
- `BEGIN` - Inicio de transacción
- `COMMIT` - Confirmación de cambios
- `ROLLBACK` - Revertir cambios en caso de error

### Sistema de Auditoría
Cada operación de inserción y eliminación queda registrada automáticamente en la tabla de auditoría para trazabilidad completa.

---

## 🎓 Guía de Migración

### **De V1 a V2:**

**1. Actualizar URLs:**
```javascript
// Antes
fetch('http://localhost:4000/api/v1/paises')

// Después  
fetch('http://localhost:4000/api/v2/paises')
```

**2. Adaptar formato:**
```javascript
// V1
const countries = response.data;

// V2
const countries = response.result.countries;
const pagination = response.result.pagination;
```

**3. Usar nuevas funcionalidades:**
```javascript
// Búsqueda por continente (solo V2)
fetch('http://localhost:4000/api/v2/paises/continente/America')
  .then(res => res.json())
  .then(data => console.log(data.result.countries));
```

---

## 👤 Autor

**Claudio Cataldo**

---

## 📄 Licencia

Este proyecto es de uso académico/educativo.

---

**Versión actual recomendada: V2** 🚀

Para más detalles sobre versionamiento, consulta [VERSIONES.md](./VERSIONES.md)