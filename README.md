# Evaluación Países - Proyecto Completo Full-Stack

Sistema completo para gestión de países desarrollado con arquitectura full-stack: Node.js (backend) y Angular (frontend).

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#descripción-del-proyecto)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Inicio Rápido](#inicio-rápido)
- [Documentación Detallada](#documentación-detallada)
- [Configuración](#configuración)
- [Contribución](#contribución)
- [Autor](#autor)

---

## 🎯 Descripción del Proyecto

Este proyecto permite administrar información de países de manera completa, incluyendo datos geográficos, demográficos y económicos. Ofrece una interfaz moderna para listar, crear y eliminar países, con un backend robusto que maneja transacciones y auditoría.

### Funcionalidades Principales

- **Gestión de Países**: Listado, creación y eliminación de países
- **Información Completa**: Continente, población, PIB 2019 y PIB 2020
- **Paginación**: Navegación eficiente de grandes volúmenes de datos
- **Sistema de Auditoría**: Registro automático de todas las operaciones
- **Interfaz Moderna**: UI responsiva con Angular Material
- **Manejo de Transacciones**: Integridad de datos garantizada

---

## 📁 Estructura del Proyecto

```
Evaluacion7/
├── eva7/              # Backend Node.js + Express + PostgreSQL
│   ├── src/           # Código fuente del backend
│   ├── database/      # Scripts de base de datos
│   ├── queries/       # Consultas SQL
│   ├── readme.md      # Documentación del backend
│   └── .env.example   # Variables de entorno ejemplo
│
└── eva7front/         # Frontend Angular 19
    ├── src/           # Código fuente del frontend
    ├── public/        # Archivos públicos
    ├── README.md      # Documentación del frontend
    └── .env.example   # Variables de entorno ejemplo
```

---

## ✨ Características

### Backend (eva7)
- ✅ **REST API**: Endpoints para operaciones CRUD
- ✅ **PostgreSQL**: Base de datos relacional robusta
- ✅ **Transacciones**: Manejo de BEGIN/COMMIT/ROLLBACK
- ✅ **Paginación**: LIMIT/OFFSET para navegación eficiente
- ✅ **Auditoría**: Registro automático de operaciones
- ✅ **CORS**: Configurado para comunicación con frontend
- ✅ **Variables de Entorno**: Configuración segura con .env

### Frontend (eva7front)
- ✅ **Angular 19**: Última versión del framework
- ✅ **Angular Material**: Componentes UI modernos
- ✅ **TypeScript**: Tipado estático para mayor seguridad
- ✅ **Variables de Entorno**: Sistema nativo de Angular
- ✅ **Responsive Design**: Adaptativo a diferentes dispositivos
- ✅ **Reactive Forms**: Formularios con validación
- ✅ **RxJS**: Programación reactiva

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web minimalista
- **PostgreSQL** - Base de datos relacional
- **pg** - Cliente PostgreSQL para Node.js
- **dotenv** - Manejo de variables de entorno
- **cors** - Middleware para CORS

### Frontend
- **Angular 19** - Framework de desarrollo web
- **TypeScript 5.7** - Superset de JavaScript con tipado
- **Angular Material** - Biblioteca de componentes UI
- **RxJS 7.8** - Programación reactiva
- **flag-icons** - Banderas de países

---

## 🚀 Inicio Rápido

### Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v18 o superior)
- **PostgreSQL** (v12 o superior)
- **Angular CLI** (instalar globalmente: `npm install -g @angular/cli`)

### Instalación y Configuración

#### 1. **Backend**

```bash
# Navegar al directorio del backend
cd eva7

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL

# Crear base de datos PostgreSQL
createdb eva7

# Iniciar backend (desarrollo)
npm run dev
```

El backend se iniciará en `http://localhost:4000`

#### 2. **Frontend**

```bash
# Navegar al directorio del frontend (en nueva terminal)
cd eva7front

# Instalar dependencias
npm install

# Configurar URL del backend (si es necesario)
# Editar src/environments/environment.ts

# Iniciar frontend
ng serve
```

El frontend estará disponible en `http://localhost:4200`

### Verificación

```bash
# Verificar backend
curl http://localhost:4000/paises

# Abrir navegador
open http://localhost:4200
```

---

## 📚 Documentación Detallada

Para documentación completa de cada componente, consulta:

- **[Backend README](eva7/readme.md)** - Documentación completa del backend
- **[Frontend README](eva7front/README.md)** - Documentación completa del frontend

### Documentación Adicional

- **Variables de Entorno Backend**: [eva7/.env.example](eva7/.env.example)
- **Variables de Entorno Frontend**: [eva7front/.env.example](eva7front/.env.example)

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

### Frontend (environments/environment.ts)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:4000',
  apiEndpoint: '/paises',
  fullApiUrl: 'http://localhost:4000/paises'
};
```

---

## 🔧 Solución de Problemas

### Backend no inicia

1. **Verificar PostgreSQL**: Asegúrate de que PostgreSQL esté ejecutándose
2. **Verificar credenciales**: Revisa el archivo `.env`
3. **Verificar base de datos**: Asegúrate de que la base de datos `eva7` exista

### Frontend no conecta con backend

1. **Backend iniciado**: Verifica que el backend esté corriendo en `http://localhost:4000`
2. **CORS configurado**: El backend debe tener CORS configurado para `http://localhost:4200`
3. **URL correcta**: Verifica la configuración en `src/environments/environment.ts`

### Más problemas

Consulta la documentación específica:
- [Backend: Solución de Problemas](eva7/readme.md#solución-de-problemas)
- [Frontend: Solución de Problemas](eva7front/README.md#solución-de-problemas)

---

## 🤝 Contribución

Este proyecto es de uso académico/educativo. Para sugerencias o mejoras, por favor contacta al autor.

---

## 👤 Autor

**Claudio Cataldo**

---

## 📄 Licencia

Este proyecto es de uso académico/educativo.

---

## 🎯 Próximos Pasos

Una vez configurado:

1. **Backend**: `cd eva7 && npm run dev` (inicia en puerto 4000)
2. **Frontend**: `cd eva7front && ng serve` (inicia en puerto 4200)
3. **Navegador**: Abre `http://localhost:4200`
4. **¡Listo!** Comienza a gestionar países

---

**¡Gracias por usar este proyecto!** 🎉
