# 🌎 Sistema de Gestión de Países

Proyecto Full Stack desarrollado con Node.js, Express, PostgreSQL y Angular 19.

Permite administrar países mediante una API REST y una interfaz web moderna, incluyendo creación, eliminación, paginación y auditoría de operaciones.

## 📋 Tabla de Contenidos

- Descripción del Proyecto
- Capturas de Pantalla
- Estructura del Proyecto
- Características
- Tecnologías Utilizadas
- Inicio Rápido
- Documentación Detallada
- Configuración
- Contribución
- Autor

---

## 🎯 Descripción del Proyecto

Este proyecto permite administrar información de países de manera completa, incluyendo datos geográficos, demográficos y económicos. Ofrece una interfaz moderna para listar, crear y eliminar países, con un backend robusto que maneja transacciones y auditoría.

### Funcionalidades Principales

- Gestión de Países: Listado, creación y eliminación de países
- Información Completa: Continente, población, PIB 2019 y PIB 2020
- Paginación: Navegación eficiente de grandes volúmenes de datos
- Sistema de Auditoría: Registro automático de todas las operaciones
- Interfaz Moderna: UI responsiva con Angular Material
- Manejo de Transacciones: Integridad de datos garantizada

---

## 📸 Capturas de Pantalla

### Listado de Países

Listado de Países

### Creación de País

Creación de País

### País Agregado Correctamente

País Agregado

### Eliminación de un País

Eliminación de un País

---

## 📁 Estructura del Proyecto

## 📁 Estructura del Proyecto


Evaluacion7
│
├── eva7                     # Backend Node.js + Express + PostgreSQL
│   ├── src
│   ├── database
│   ├── queries
│   ├── readme.md
│   └── .env.example
│
├── eva7front                # Frontend Angular 19
│   ├── src
│   ├── public
│   ├── README.md
│   └── .env.example
│
└── docs                     # Capturas de pantalla
    ├── listado-paises.png
    ├── creacion-pais.png
    ├── pais-agregado.png
    └── eliminacion-pais.png

---

## ✨ Características

### Backend (eva7)

- ✅ REST API para operaciones CRUD
- ✅ PostgreSQL como base de datos relacional
- ✅ Manejo de transacciones (BEGIN / COMMIT / ROLLBACK)
- ✅ Paginación eficiente mediante LIMIT/OFFSET
- ✅ Auditoría automática de operaciones
- ✅ Configuración CORS
- ✅ Variables de entorno mediante .env

### Frontend (eva7front)

- ✅ Angular 19
- ✅ Angular Material
- ✅ TypeScript
- ✅ Variables de entorno
- ✅ Diseño responsivo
- ✅ Formularios reactivos
- ✅ Programación reactiva con RxJS

---

## 🛠️ Tecnologías Utilizadas

### Backend

- Node.js
- Express
- PostgreSQL
- pg
- dotenv
- cors

### Frontend

- Angular 19
- TypeScript 5.7
- Angular Material
- RxJS 7.8
- flag-icons

---

## 🚀 Inicio Rápido

### Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- Node.js (v18 o superior)
- PostgreSQL (v12 o superior)
- Angular CLI

bash npm install -g @angular/cli 

### 1. Backend

bash cd eva7  npm install  cp .env.example .env  # Editar .env con las credenciales de PostgreSQL  createdb eva7  npm run dev 

Backend disponible en:

text http://localhost:4000 

### 2. Frontend

bash cd eva7front  npm install  ng serve 

Frontend disponible en:

text http://localhost:4200 

### Verificación

bash curl http://localhost:4000/paises 

Abrir en navegador:

text http://localhost:4200 

---

## 📚 Documentación Detallada

Para información específica de cada componente:

- Backend: eva7/readme.md
- Frontend: eva7front/README.md

### Archivos de Configuración

- eva7/.env.example
- eva7front/.env.example

---

## ⚙️ Configuración

### Backend (.env)

env DB_USER=postgres DB_PASSWORD=tu_contraseña_aqui DB_HOST=localhost DB_PORT=5432 DB_DATABASE=eva7 PORT=4000 

### Frontend (environment.ts)

typescript export const environment = {   production: false,   apiUrl: 'http://localhost:4000',   apiEndpoint: '/paises',   fullApiUrl: 'http://localhost:4000/paises' }; 

---

## 🔧 Solución de Problemas

### Backend no inicia

1. Verificar que PostgreSQL esté ejecutándose.
2. Revisar las credenciales del archivo .env.
3. Confirmar que la base de datos eva7 exista.

### Frontend no conecta con backend

1. Confirmar que el backend esté ejecutándose.
2. Verificar configuración de CORS.
3. Revisar la URL configurada en environment.ts.

---

## 🤝 Contribución

Proyecto desarrollado con fines académicos y de aprendizaje.

Las sugerencias y mejoras son bienvenidas.

---

## 👤 Autor

Claudio Cataldo

GitHub: https://github.com/JamNow7

---

## 📄 Licencia

Proyecto de uso académico y educativo.

---

## 🎯 Próximos Pasos

bash # Backend cd eva7 && npm run dev  # Frontend cd eva7front && ng serve 

Abrir:

text http://localhost:4200 

¡Listo! Ya puedes gestionar países desde la interfaz w