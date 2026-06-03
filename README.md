# 🌎 Sistema de Gestión de Países con API Versionada

Sistema Full Stack para la administración de información de países, desarrollado con **Node.js**, **Express**, **PostgreSQL** y **Angular 19**.

**¡NOW WITH API VERSIONING!** 🚀 Implementation following **Fundamentos-de-API-REST** patterns.

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Sistema de Versionamiento](#-sistema-de-versionamiento)
- [Características](#-características)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Uso del Sistema](#-uso-del-sistema)
- [Documentación](#-documentación)
- [Solución de Problemas](#-solución-de-problemas)
- [Autor](#-autor)

---

## 🎯 Descripción del Proyecto

Este sistema permite administrar información completa de países, incluyendo datos geográficos, demográficos y económicos (PIB). Ofrece una interfaz web moderna para la gestión integral de países mediante una **API REST versionada** con sistema de auditoría integrado.

### Funcionalidades Principales

- **🌍 Gestión Completa de Países**: Listado, creación y eliminación de registros
- **📊 Información Detallada**: Continente, población, PIB 2019 y PIB 2020
- **📖 Sistema de Paginación**: Navegación eficiente para grandes volúmenes de datos
- **📝 Auditoría de Operaciones**: Registro automático de todas las transacciones
- **🎨 Interfaz Moderna**: UI responsiva desarrollada con Angular Material
- **🔒 Integridad de Datos**: Manejo de transacciones ACID con PostgreSQL
- **🚀 API Versionada**: Sistema profesional de versionamiento V1/V2

---

## 🔄 Sistema de Versionamiento

El proyecto implementa un **sistema de versionamiento de API** siguiendo los patrones de **Fundamentos-de-API-REST**, permitiendo evolución controlada y compatibilidad hacia atrás.

### **Versiones Disponibles**

#### **V1 (Estable)** - Formato Simple
- `GET /api/v1/paises` - Listado de países
- `POST /api/v1/paises` - Crear país
- `DELETE /api/v1/paises/:nombre` - Eliminar país

#### **V2 (Mejorada)** - Formato Optimizado
- `GET /api/v2/paises` - Listado con metadata mejorada
- `POST /api/v2/paises` - Crear país con respuesta detallada
- `DELETE /api/v2/paises/:nombre` - Eliminar con confirmación
- `GET /api/v2/paises/continente/:continente` - **NUEVO: Búsqueda por continente**

### **Características del Versionamiento**

- ✅ **Compatibilidad hacia atrás**: V1 sigue funcionando perfectamente
- ✅ **Evolución controlada**: V2 introduce mejoras sin romper V1
- ✅ **Selector dinámico**: Cambio entre versiones desde el frontend
- ✅ **Formatos diferentes**: Respuestas adaptadas a cada versión
- ✅ **Nuevas funcionalidades**: V2 incluye características exclusivas

### **Diferencias de Formato**

**V1 Response:**
```json
{
  "ok": true,
  "data": [{ "nombre": "Chile", "poblacion": 19000000 }]
}
```

**V2 Response:**
```json
{
  "success": true,
  "result": {
    "countries": [{ "nombre": "Chile", "poblacion": 19000000 }],
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

### **Uso del Frontend**

El frontend incluye un **selector de versión** que permite:
- Cambiar entre V1 y V2 con un clic
- Ver diferencias en tiempo real
- Acceder a funcionalidades exclusivas de V2
- Persistencia de la versión seleccionada

---

## ✨ Características

### Backend (eva7)

- ✅ **API Versionada**: Sistema V1/V2 con URLs diferenciadas
- ✅ **REST Completo**: Operaciones CRUD en ambas versiones
- ✅ **PostgreSQL**: Motor de base de datos relacional
- ✅ **Transacciones ACID**: Manejo (BEGIN / COMMIT / ROLLBACK)
- ✅ **Paginación Eficiente**: Mediante LIMIT/OFFSET
- ✅ **Auditoría Automática**: Registro de todas las operaciones
- ✅ **Configuración CORS**: Solicitudes cross-origin
- ✅ **Variables de Entorno**: Archivo .env para configuración

### Frontend (eva7front)

- ✅ **Selector de Versión**: Cambio dinámico V1/V2 en la UI
- ✅ **Angular 19**: Arquitectura modular y moderna
- ✅ **Angular Material**: Componentes UI profesionales
- ✅ **TypeScript**: Tipado estático para robustez
- ✅ **Búsqueda por Continente**: Funcionalidad exclusiva V2
- ✅ **Diseño Responsivo**: Adaptable a diferentes pantallas
- ✅ **Formularios Reactivos**: Validación y gestión eficiente
- ✅ **Programación Reactiva**: RxJS para flujos de datos
- ✅ **Banderas Nacionales**: Identificación visual de países

---

## 🛠️ Tecnologías Utilizadas

### Backend

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| Node.js | 18+ | Runtime environment |
| Express | Latest | Framework web minimalista |
| PostgreSQL | 12+ | Base de datos relacional |
| pg | Latest | Cliente PostgreSQL para Node.js |
| node-fetch | Latest | Cliente HTTP para pruebas |
| dotenv | Latest | Manejo de variables de entorno |
| cors | Latest | Middleware para CORS |

### Frontend

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| Angular | 19 | Framework web moderno |
| TypeScript | 5.7 | Superset de JavaScript |
| Angular Material | Latest | Biblioteca de componentes UI |
| RxJS | 7.8 | Programación reactiva |
| flag-icons | Latest | Iconos de banderas nacionales |
| HttpClient | Latest | Cliente para llamadas API |

---

## 📁 Estructura del Proyecto

```
gestion-pib-paises/
│
├── eva7/                              # Backend Node.js + Express + PostgreSQL
│   ├── src/
│   │   ├── index.js                   # Punto de entrada con versionamiento
│   │   ├── config.js                  # Configuración general
│   │   ├── db.js                      # Conexión a base de datos
│   │   ├── controllers/
│   │   │   ├── paises.controller.js   # Controlador V1
│   │   │   └── paises.v2.controller.js # Controlador V2
│   │   └── routes/
│   │       ├── paises.routes.js       # Rutas V1
│   │       └── paises.v2.routes.js   # Rutas V2
│   ├── database/                      # Scripts de base de datos
│   ├── queries/                       # Consultas SQL
│   ├── test-versions.js              # Script de prueba de versiones
│   ├── VERSIONES.md                   # Documentación de versiones
│   ├── .env.example                   # Plantilla de configuración
│   └── readme.md                      # Documentación backend
│
├── eva7front/                         # Frontend Angular 19
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.component.ts/html/scss
│   │   │   ├── api-version-selector/   # Componente selector de versión
│   │   │   ├── buscar-pais-continente/ # Búsqueda V2 por continente
│   │   │   ├── paises/                 # Listado principal
│   │   │   ├── crear-pais/             # Creación de países
│   │   │   └── services/
│   │   │       └── countries.services.ts # Servicio con multi-versión
│   │   ├── environments/
│   │   │   ├── environment.ts          # Configuración desarrollo
│   │   │   └── environment.prod.ts     # Configuración producción
│   │   └── ...
│   ├── public/                        # Archivos estáticos
│   ├── .env.example                   # Plantilla de configuración
│   └── README.md                      # Documentación frontend
│
└── docs/                              # Documentación y capturas
    ├── api-version-2.png              # 🆕 Sistema de versionamiento
    ├── listado-paises.png
    ├── creacion-pais.png
    ├── pais-agregado.png
    └── eliminacion-pais.png
```

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v18 o superior)
- **PostgreSQL** (v12 o superior)
- **Angular CLI** (última versión)

```bash
# Instalar Angular CLI globalmente
npm install -g @angular/cli
```

---

## 🚀 Instalación y Configuración

### 1. Configuración del Backend

```bash
# Navegar al directorio del backend
cd eva7

# Instalar dependencias
npm install

# Crear archivo de configuración
cp .env.example .env

# Editar .env con tus credenciales de PostgreSQL
# Luego, crear la base de datos
createdb eva7

# Iniciar el servidor en modo desarrollo
npm run dev
```

El backend estará disponible en: `http://localhost:4000`

### 2. Configuración del Frontend

```bash
# Navegar al directorio del frontend
cd eva7front

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
ng serve
```

El frontend estará disponible en: `http://localhost:4200`

### 3. Verificación de Instalación

```bash
# Verificar que el backend esté funcionando
curl "http://localhost:4000/api/v1/paises?limit=2"

# Abrir en el navegador
open http://localhost:4200
```

---

## ⚙️ Configuración

### Backend (.env)

```env
DB_USER=postgres
DB_PASSWORD=tu_contraseña_aqui
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=eva7
PORT=4000
```

### Frontend (environment.ts)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:4000',
  apiEndpoint: '/api/v1/paises',
  fullApiUrl: 'http://localhost:4000/api/v1/paises',
  apiVersion: 'v1',
  availableVersions: ['v1', 'v2']
};
```

---

## 🎮 Uso del Sistema

### **Capturas de Pantalla**

#### Selector de Versión y Búsqueda V2

![API Version 2](docs/api-version-2.png)

*Figura 1: Sistema de versionamiento con selector V1/V2 y funcionalidad de búsqueda por continente*

### **Iniciar los Servicios**

**Backend:**
```bash
cd eva7
npm install
npm run dev
```
*Disponible en: `http://localhost:4000`*

**Frontend:**
```bash
cd eva7front
npm install
ng serve
```
*Disponible en: `http://localhost:4200`*

### **Probar el Versionamiento**

**Vía navegador:**
1. Abrir `http://localhost:4200`
2. Usar el selector de versión en la parte superior
3. Cambiar entre V1 (azul) y V2 (naranja)

**Vía terminal:**
```bash
# Probar V1
curl "http://localhost:4000/api/v1/paises?limit=2"

# Probar V2
curl "http://localhost:4000/api/v2/paises?limit=2"

# Probar nueva funcionalidad V2
curl "http://localhost:4000/api/v2/paises/continente/America"

# Script automático de comparación
cd eva7
npm run test:versions
```

### **Diferencias en el Frontend**

**V1 (Azul):**
- Listado de países con formato simple
- Operaciones CRUD básicas
- Búsqueda por continente deshabilitada

**V2 (Naranja):**
- Listado con metadata mejorada
- Operaciones CRUD con respuestas detalladas
- **¡Búsqueda por continente HABILITADA!**

---

## 📚 Documentación

Para información específica de cada componente:

- **Backend**: [`eva7/readme.md`](eva7/readme.md) - Configuración y uso del backend
- **Frontend**: [`eva7front/README.md`](eva7front/README.md) - Configuración y uso del frontend
- **Versiones**: [`eva7/VERSIONES.md`](eva7/VERSIONES.md) - Documentación detallada del sistema de versionamiento

### **Documentación de Versiones**

El archivo `VERSIONES.md` contiene:
- Diferencias detalladas entre V1 y V2
- Guía de migración de versiones
- Formatos de respuesta comparados
- Políticas de deprecación
- Roadmap de versiones futuras

---

## 🔧 Solución de Problemas

### El backend no inicia

1. Verificar que PostgreSQL esté ejecutándose
2. Revisar las credenciales en el archivo `.env`
3. Confirmar que la base de datos `eva7` exista
4. Verificar que el puerto 4000 no esté en uso

```bash
# Verificar status de PostgreSQL
pg_isready

# Crear base de datos si no existe
createdb eva7
```

### El frontend no conecta con el backend

1. Confirmar que el backend esté ejecutándose
2. Verificar la configuración de CORS
3. Revisar la URL configurada en `environment.ts`
4. Abrir las DevTools del navegador para ver errores de red

---

## 🤝 Contribución

Este proyecto fue desarrollado con fines académicos y de aprendizaje.

Las sugerencias, mejoras y contribuciones son bienvenidas.

---

## 👤 Autor

**Claudio Cataldo**

- GitHub: [JamNow7](https://github.com/JamNow7)

---

## 📄 Licencia

Este proyecto es de uso académico y educativo.

---

<div align="center">

**⭐ Si encuentras útil este proyecto, considera darle una estrella en GitHub**

</div>