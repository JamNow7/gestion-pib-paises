# 🌎 Sistema de Gestión de Países

Sistema Full Stack para la administración de información de países, desarrollado con **Node.js**, **Express**, **PostgreSQL** y **Angular 19**.

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Características](#-características)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Documentación](#-documentación)
- [Solución de Problemas](#-solución-de-problemas)
- [Autor](#-autor)

---

## 🎯 Descripción del Proyecto

Este sistema permite administrar información completa de países, incluyendo datos geográficos, demográficos y económicos (PIB). Ofrece una interfaz web moderna para la gestión integral de países mediante una API REST robusta con sistema de auditoría integrado.

### Funcionalidades Principales

- **Gestión Completa de Países**: Listado, creación y eliminación de registros
- **Información Detallada**: Continente, población, PIB 2019 y PIB 2020
- **Sistema de Paginación**: Navegación eficiente para grandes volúmenes de datos
- **Auditoría de Operaciones**: Registro automático de todas las transacciones
- **Interfaz Moderna**: UI responsiva desarrollada con Angular Material
- **Integridad de Datos**: Manejo de transacciones ACID con PostgreSQL

---

## ✨ Características

### Backend (eva7)

- ✅ API REST para operaciones CRUD completas
- ✅ PostgreSQL como motor de base de datos relacional
- ✅ Manejo de transacciones (BEGIN / COMMIT / ROLLBACK)
- ✅ Paginación eficiente mediante LIMIT/OFFSET
- ✅ Sistema de auditoría automático de operaciones
- ✅ Configuración CORS para solicitudes cross-origin
- ✅ Variables de entorno con archivo .env

### Frontend (eva7front)

- ✅ Angular 19 con arquitectura modular
- ✅ Angular Material para componentes UI
- ✅ TypeScript para tipado estático
- ✅ Variables de entorno configurables
- ✅ Diseño responsivo y adaptable
- ✅ Formularios reactivos
- ✅ Programación reactiva con RxJS

---

## 🛠️ Tecnologías Utilizadas

### Backend

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| Node.js | 18+ | Runtime environment |
| Express | Latest | Framework web minimalista |
| PostgreSQL | 12+ | Base de datos relacional |
| pg | Latest | Cliente PostgreSQL para Node.js |
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

---

## 📁 Estructura del Proyecto

```
gestion-pib-paises/
│
├── eva7/                     # Backend Node.js + Express + PostgreSQL
│   ├── src/                  # Código fuente del servidor
│   ├── database/             # Scripts de base de datos
│   ├── queries/              # Consultas SQL
│   ├── .env.example          # Plantilla de configuración
│   └── readme.md             # Documentación backend
│
├── eva7front/                # Frontend Angular 19
│   ├── src/                  # Código fuente de la aplicación
│   ├── public/               # Archivos estáticos
│   ├── .env.example          # Plantilla de configuración
│   └── README.md             # Documentación frontend
│
└── docs/                     # Documentación y capturas
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
curl http://localhost:4000/paises

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
  apiEndpoint: '/paises',
  fullApiUrl: 'http://localhost:4000/paises'
};
```

---

## 📚 Documentación

Para información específica de cada componente:

- **Backend**: [`eva7/readme.md`](eva7/readme.md)
- **Frontend**: [`eva7front/README.md`](eva7front/README.md)

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