# Instrucciones para Ejecutar Tests

## Backend (Node.js/Express/PostgreSQL)

### 1. Instalar dependencias de testing

```bash
cd eva7
npm install --save-dev jest supertest @types/jest
```

### 2. Configurar base de datos de pruebas

```bash
# Crear BD de pruebas
psql -U postgres -c "CREATE DATABASE eva7_test;"

# O si prefieres usar un nombre diferente, actualiza:
# eva7/.env.test o la variable TEST_DB_DATABASE
```

### 3. Configurar variables de entorno para tests

Crea un archivo `.env.test` o agrega a tu `.env`:

```env
# Configuración de BD para tests
TEST_DB_USER=postgres
TEST_DB_PASSWORD=tu_contraseña
TEST_DB_HOST=localhost
TEST_DB_PORT=5432
TEST_DB_DATABASE=eva7_test

# Configuración de BD normal (para desarrollo)
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=eva7
```

### 4. Ejecutar tests

```bash
cd eva7
npm test                # Ejecutar todos los tests
npm test:watch          # Modo watch
npm test:coverage       # Con reporte de cobertura
```

**Esperado**: Todos los tests pasan, cobertura >80%

---

## Frontend (Angular)

### 1. Ejecutar tests con Karma+Jasmine (ya configurado)

```bash
cd eva7front
ng test                # Ejecutar tests (modo watch)
ng test -- --no-watch  # Ejecutar una sola vez
ng test -- --code-coverage  # Con cobertura
```

**Esperado**: Todos los tests pasan, cobertura >70%

---

## Archivos Creados

### Backend
- ✅ `eva7/jest.config.js` - Configuración de Jest
- ✅ `eva7/tests/setup.js` - Setup de BD de pruebas
- ✅ `eva7/tests/integration/v1/paises.test.js` - Tests API V1
- ✅ `eva7/tests/integration/v2/paises.test.js` - Tests API V2
- ✅ `eva7/tests/integration/v2/continente.test.js` - Tests búsqueda por continente

### Frontend
- ✅ `eva7front/src/app/services/countries.services.spec.ts` - Tests del servicio
- ✅ `eva7front/src/app/paises/paises.component.spec.ts` - Tests de listado
- ✅ `eva7front/src/app/crear-pais/crear-pais.component.spec.ts` - Tests de creación
- ✅ `eva7front/src/app/buscar-pais-continente/buscar-pais-continente.component.spec.ts` - Tests de búsqueda
- ✅ `eva7front/src/app/api-version-selector/api-version-selector.component.spec.ts` - Tests de selector de versión

---

## Solución de Problemas

### Backend

**Error: "Cannot find module 'jest'"**
```bash
npm install --save-dev jest supertest @types/jest
```

**Error: "Database eva7_test does not exist"**
```bash
psql -U postgres -c "CREATE DATABASE eva7_test;"
```

**Error: "Connection refused"**
- Verifica que PostgreSQL esté corriendo
- Verifica las credenciales en `.env`

### Frontend

**Error: "No test files found"**
- Verifica que los archivos `.spec.ts` existan
- Verifica estar en el directorio correcto

**Error: "Module not found"**
```bash
cd eva7front
npm install
```

---

## Cobertura Esperada

| Componente | Cobertura Mínima |
|------------|-----------------|
| Backend (Controllers) | 80% |
| Frontend (Services) | 70% |
| Frontend (Components) | 70% |

---

## Notas

- Los tests de backend requieren PostgreSQL corriendo
- Los tests crean y limplan datos automáticamente en la BD de pruebas
- La BD de pruebas se limpia después de cada test
- Los tests del frontend usan mocks, no requieren backend corriendo
