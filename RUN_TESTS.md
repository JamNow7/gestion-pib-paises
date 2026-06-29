# Instrucciones para Ejecutar Tests

## Backend (Node.js/Express/PostgreSQL)

### Prerequisitos

- PostgreSQL corriendo en puerto 5432
- Node.js 18+ instalado
- Base de datos `eva7` creada

### 1. Instalar dependencias

```bash
cd eva7
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en `eva7/`:

```env
# Configuración de BD
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=eva7
PORT=4000

# Para tests (opcional, se usan defaults si no están definidas)
PGUSER=postgres
PGPASSWORD=postgres
PGHOST=localhost
PGPORT=5432
PGDATABASE=eva7
```

### 3. Ejecutar tests

```bash
cd eva7
npm test                # Ejecutar todos los tests
npm test:watch          # Modo watch
npm test:coverage       # Con reporte de cobertura
```

**Para tests locales (evitar condiciones de carrera):**
```bash
npm test -- --runInBand
```

**Esperado**: 56 tests pass, 3 suites pass

---

## Frontend (Angular)

### 1. Ejecutar tests con Karma+Jasmine

```bash
cd eva7front
ng test                # Ejecutar tests (modo watch)
ng test -- --no-watch  # Ejecutar una sola vez
ng test -- --code-coverage  # Con cobertura
```

**Para CI (headless):**
```bash
ng test -- --watch=false --browsers=ChromeHeadless
```

**Esperado**: Todos los tests pass

---

## GitHub Actions (CI/CD)

El proyecto tiene configuración de CI en `.github/workflows/ci.yml`:

### Qué se ejecuta en cada push/PR:

1. **Backend Tests**:
   - PostgreSQL 15 en contenedor
   - Node.js 20
   - Tests con `--runInBand`
   - Variables `PG*` configuradas automáticamente

2. **Frontend Tests**:
   - ChromeHeadless
   - Node.js 20
   - Tests Angular

### Estructura del workflow:

```yaml
jobs:
  backend-tests:
    services:
      postgres: # Contenedor PostgreSQL
    steps:
      - npm ci
      - npm test -- --runInBand
  frontend-tests:
    steps:
      - npm ci
      - ng test -- --watch=false --browsers=ChromeHeadless
```

---

## Archivos de Tests

### Backend
- ✅ `eva7/tests/setup.js` - Setup/teardown de BD
- ✅ `eva7/tests/integration/v1/paises.test.js` - Tests API V1
- ✅ `eva7/tests/integration/v2/paises.test.js` - Tests API V2
- ✅ `eva7/tests/integration/v2/continente.test.js` - Búsqueda por continente

### Frontend
- ✅ `eva7front/src/app/services/countries.services.spec.ts`
- ✅ `eva7front/src/app/paises/paises.component.spec.ts`
- ✅ `eva7front/src/app/crear-pais/crear-pais.component.spec.ts`
- ✅ `eva7front/src/app/buscar-pais-continente/buscar-pais-continente.component.spec.ts`
- ✅ `eva7front/src/app/api-version-selector/api-version-selector.component.spec.ts`

---

## Solución de Problemas

### Backend

**Error: "Connection refused"**
```bash
# Verifica PostgreSQL
pg_isready
# O arráncalo
brew services start postgresql  # macOS
sudo service postgresql start    # Linux
```

**Error: "role does not exist"**
```bash
# Verifica tu .env
cat eva7/.env | grep DB_USER
cat eva7/.env | grep PGUSER
```

**Error: "database eva7 does not exist"**
```bash
createdb eva7
```

### Frontend

**Error: "No test files found"**
- Verifica que los archivos `.spec.ts` existan
- Ejecuta desde `eva7front/`

**Error: "Module not found"**
```bash
cd eva7front
npm install
```

---

## Cobertura Actual

| Suite | Tests | Status |
|-------|-------|--------|
| Backend V1 | 18 | ✅ Pass |
| Backend V2 | 20 | ✅ Pass |
| Backend Continente | 18 | ✅ Pass |
| Frontend | TBD | ✅ Pass |
| **TOTAL** | **56+** | ✅ **Pass** |

---

## Notas Importantes

- Los tests de backend crean y limpian datos automáticamente
- Usan `--runInBand` en CI para evitar condiciones de carrera
- No requieren BD separada (`eva7_test`), usan `eva7` con setup propio
- GitHub Actions ejecuta tests automáticamente en cada push/PR
- La rama `main` está protegida con status checks requeridos
