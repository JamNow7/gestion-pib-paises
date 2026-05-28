# Frontend Gestión de Países - Angular

Aplicación front-end desarrollada en Angular 19 para listar, crear y administrar países con información de continente, población y PIB.

## 📋 Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Dependencias del Backend](#dependencias-del-backend)
- [Instalación](#instalación)
- [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
- [Ejecución](#ejecución)
- [Funcionalidades](#funcionalidades)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Solución de Problemas](#solución-de-problemas)

## 🛠️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v18 o superior) - [Descargar](https://nodejs.org/)
- **npm** (viene incluido con Node.js) o **yarn**
- **Angular CLI** - Instalar globalmente:
  ```bash
  npm install -g @angular/cli
  ```

Verifica las instalaciones:

```bash
node --version
npm --version
ng version
```

## 🔗 Dependencias del Backend

**⚠️ IMPORTANTE:** Esta aplicación frontend depende del backend para funcionar correctamente.

### Backend Requerido

El backend debe estar ejecutándose en `http://localhost:4000` antes de iniciar el frontend.

**Repositorio del backend:** `/ruta/al/backend/eva7`

### Pasos Previos Obligatorios

1. **Asegúrate de que el backend esté configurado**:
   - Base de datos PostgreSQL ejecutándose
   - Variables de entorno configuradas
   - Backend compilado y listo

2. **Inicia el backend primero**:
   ```bash
   cd /ruta/al/backend/eva7
   npm run dev
   ```
   El backend debería mostrar: `Servidor escuchando en el puerto 4000`

3. **Verifica que el backend esté funcionando**:
   ```bash
   curl http://localhost:4000/paises
   ```

## ⚙️ Configuración de Variables de Entorno

Este proyecto utiliza el sistema nativo de variables de entorno de Angular mediante archivos TypeScript.

### Archivos de Configuración

Las variables de entorno se encuentran en `/src/environments/`:

- **`environment.ts`** - Configuración para desarrollo
- **`environment.prod.ts`** - Configuración para producción

### Configuración por Defecto (Desarrollo)

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:4000',
  apiEndpoint: '/paises',
  fullApiUrl: 'http://localhost:4000/paises'
};
```

### Configuración de Producción

```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.ejemplo.com',    // Reemplaza con tu URL real
  apiEndpoint: '/paises',
  fullApiUrl: 'https://api.ejemplo.com/paises'  // Reemplaza con tu URL real
};
```

### ⚠️ IMPORTANTE: ¿Por qué Angular NO usa archivos `.env`?

**Si vienes de otros frameworks como Node.js/Express, esto puede confundirte inicialmente.**

#### Diferencia clave entre Backend y Frontend:

**🔧 BACKEND (Node.js/Express):**
- ✅ **SÍ usa archivos `.env`**
- ✅ Funciona porque Node.js ejecuta en el servidor
- ✅ Las variables se leen en **runtime** (cuando el servidor arranca)
- ✅ Las credenciales quedan protegidas en el servidor

**🎯 FRONTEND (Angular):**
- ❌ **NO usa archivos `.env`** (y no debería)
- ✅ Usa archivos TypeScript en `/src/environments/`
- ✅ Las variables se resuelven en **build-time** (cuando compilas)
- ✅ El código JavaScript final tiene los valores "compilados"

#### ¿Por qué Angular funciona así?

1. **Seguridad:** Angular corre en el navegador del cliente
   - Todo el código JavaScript es visible para el usuario
   - No hay forma de ocultar credenciales en el frontend
   - Usar `.env` daría falsa seguridad de protección

2. **Optimización:** 
   - Las variables se resuelven al compilar
   - El bundle final es más pequeño y eficiente
   - No hay procesamiento adicional en runtime

3. **Type-Safe:**
   - Las variables están tipadas en TypeScript
   - Tu IDE ofrece IntelliSense y validación
   - Errores se detectan en tiempo de compilación

#### ¿Entonces cómo protejo credenciales sensibles en Angular?

**La respuesta correcta:** **No pongas credenciales sensibles en el frontend.**

Las credenciales (API keys, tokens, etc.) deben:
- Estar en el backend (Node.js) ✅
- Usarse en servidor con archivos `.env` ✅
- El frontend hace peticiones al backend ✅
- El backend se comunica con servicios externos ✅

#### Sistema Nativo de Angular (Lo que hemos implementado):

```bash
# Desarrollo
ng serve
# Usa: src/environments/environment.ts
# URL: http://localhost:4000/paises

# Producción  
ng build --configuration production
# Usa: src/environments/environment.prod.ts
# URL: https://api.ejemplo.com/paises
```

**Este es el sistema CORRECTO y PROFESIONAL para Angular.**

### Cómo Cambiar la URL del Backend

**Para desarrollo:**
1. Edita `src/environments/environment.ts`
2. Modifica `apiUrl` y `fullApiUrl`
3. Reinicia el servidor: `ng serve`

**Para producción:**
1. Edita `src/environments/environment.prod.ts`
2. Modifica `apiUrl` y `fullApiUrl`
3. Reconstruye: `ng build --configuration production`

### Uso en el Código

Las variables de entorno se importan directamente en los servicios:

```typescript
import { environment } from '../../environments/environment';

// Se utiliza en el código
private apiUrl = environment.fullApiUrl;
```

## 📦 Instalación

1. **Navega al directorio del proyecto**:

```bash
cd /ruta/a/tu/proyecto/eva7front/eva7front
```

2. **Instala las dependencias**:

```bash
npm install
```

Esto instalará todas las dependencias necesarias incluyendo:
- Angular 19 framework
- Angular Material para componentes UI
- RxJS para programación reactiva
- Otras dependencias de desarrollo

## 🚀 Ejecución

### Modo Desarrollo

Para desarrollo con recarga en caliente:

```bash
ng serve
```

O usando el script de npm:

```bash
npm start
```

**Acceso:** Abre tu navegador en `http://localhost:4200/`

**Nota:** Este comando usa automáticamente `environment.ts` (desarrollo)

### Modo Producción

Para construir para producción:

```bash
ng build --configuration production
```

Los archivos compilados estarán en `/dist/eva7front/`

**Nota:** Este comando usa automáticamente `environment.prod.ts` (producción)

### Opciones Adicionales

```bash
# Puerto personalizado
ng serve --port 4300

# Modo SSL
ng serve --ssl

# Abrir automáticamente en el navegador
ng serve --open

# Usar configuración específica
ng serve --configuration production
```

## ✨ Funcionalidades

### Gestión de Países

- ✅ **Listado de países** con información completa
- ✅ **Paginación** para navegar grandes volúmenes de datos
- ✅ **Creación de nuevos países** mediante formulario validado
- ✅ **Eliminación de países** con confirmación
- ✅ **Banderas de países** usando flag-icons
- ✅ **Mapa de referencia** visual

### Características Técnicas

- **Variables de Entorno** - Sistema nativo de Angular para configuración
- **Angular Material** - Componentes UI modernos
- **Reactive Forms** - Formularios reactivos con validación
- **RxJS** - Programación reactiva para manejo de datos
- **Flexbox Layout** - Diseño responsivo
- **TypeScript** - Tipado estático para mayor seguridad

## 📁 Estructura del Proyecto

```
eva7front/
├── src/
│   ├── app/
│   │   ├── crear-pais/        # Componente de formulario de creación
│   │   ├── paises/            # Componente de listado y gestión
│   │   ├── services/          # Servicios para comunicación con API
│   │   │   └── countries.services.ts
│   │   ├── app.component.*    # Componente principal
│   │   ├── app.config.ts      # Configuración de la aplicación
│   │   └── app.routes.ts      # Definición de rutas
│   ├── environments/          # 🔧 Configuración de entornos
│   │   ├── environment.ts     # Variables de desarrollo
│   │   └── environment.prod.ts # Variables de producción
│   ├── assets/                # Archivos estáticos
│   ├── styles.scss            # Estilos globales
│   └── main.ts                # Punto de entrada
├── public/                    # Archivos públicos
├── angular.json               # Configuración de Angular CLI
├── package.json               # Dependencias del proyecto
├── tsconfig.json              # Configuración de TypeScript
└── README.md                  # Este archivo
```

## 🧪 Tecnologías Utilizadas

### Framework y Core
- **Angular 19** - Framework de desarrollo web
- **TypeScript 5.7** - Superset de JavaScript con tipado
- **RxJS 7.8** - Programación reactiva

### UI y Estilos
- **Angular Material 19** - Biblioteca de componentes UI
- **Angular CDK 19** - Componentes de desarrollo
- **flag-icons 7.5** - Banderas de países

### Herramientas de Desarrollo
- **Angular CLI** - Herramienta de línea de comandos
- **Angular DevKit** - Herramientas de desarrollo
- **Karma & Jasmine** - Framework de testing
- **Environment Files** - Sistema de variables de entorno nativo

## 🔧 Solución de Problemas

### Problema: "Cannot GET /paises" o errores de conexión

**Causa:** El backend no está ejecutándose o está en el puerto incorrecto.

**Solución:**
1. Verifica que el backend esté corriendo: `curl http://localhost:4000/paises`
2. Inicia el backend: `cd /ruta/backend && npm run dev`
3. Verifica la configuración de variables de entorno en `/src/environments/environment.ts`
4. Verifica la configuración de CORS en el backend

### Problema: "CORS policy error"

**Causa:** El backend no tiene CORS configurado correctamente.

**Solución:**
Verifica que el backend tenga configurada la opción:
```javascript
origin: "http://localhost:4200"
```

### Problema: Variables de entorno no funcionan

**Causa:** Los cambios en variables de entorno requieren reinicio del servidor.

**Solución:**
1. Modifica el archivo environment correspondiente
2. Reinicia completamente el servidor: `ng serve`
3. Para producción, reconstruye: `ng build --configuration production`

### Problema: Errores al compilar

**Solución:**
1. Limpia la caché de Angular: `ng cache clean`
2. Elimina node_modules: `rm -rf node_modules`
3. Reinstala: `npm install`

### Problema: Puerto 4200 ya está en uso

**Solución:**
```bash
ng serve --port 4300
# o termina el proceso que usa el puerto 4200
```

### Problema: Error "Cannot find module '../../environments/environment'"

**Causa:** Los archivos de entorno no existen o están mal configurados.

**Solución:**
1. Verifica que existan los archivos: `ls src/environments/`
2. Deberían existir: `environment.ts` y `environment.prod.ts`
3. Si no existen, cópialos de la plantilla o créalos manualmente

## 📝 Notas de Desarrollo

### Sistema de Variables de Entorno

- **Implementación nativa de Angular** - No requiere configuración adicional
- **Type-safe** - Las variables son tipadas en TypeScript
- **Build-time** - Las variables se compilan durante el build
- **Entorno automático** - Angular selecciona el archivo correcto según el comando

### Cambios Recientes

- ✅ **Sistema de variables de entorno** - Implementado correctamente
- ✅ **Configuración dinámica del backend** - URL configurable por entorno
- ✅ **Angular Material** - UI moderna y consistente
- ✅ **Reactive Forms** - Manejo robusto de formularios
- ✅ **Layout con Flexbox** - Diseño responsivo

## 👤 Autor

**Claudio Cataldo**

## 📄 Licencia

Este proyecto es de uso académico/educativo.
