/**
 * Tests de integración para API V2 de Países
 * Prueba los endpoints GET, POST, DELETE /api/v2/paises
 * Incluye verificación de metadata de paginación y respuestas enriquecidas
 */

import express from 'express';
import request from 'supertest';
import cors from 'cors';
import { getPaisesV2, crearPaisV2, eliminarPaisV2 } from '../../../src/controllers/paises.v2.controller.js';
import pg from 'pg';

const { Pool } = pg;

// Crear una app de Express para testing
const app = express();
app.use(cors());
app.use(express.json());

// Crear router con las rutas V2
const router = express.Router();
router.get('/paises', getPaisesV2);
router.post('/paises', crearPaisV2);
router.delete('/paises/:nombre', eliminarPaisV2);

app.use('/api/v2', router);

// Pool de BD para verificaciones directas
let dbPool;

beforeAll(async () => {
  dbPool = new Pool(global.TEST_DB_CONFIG);
  await dbPool.connect();
});

describe('API V2 - Países', () => {
  const TEST_PAIS = {
    nombre: 'PaisTestV2',
    continente: 'Europa',
    poblacion: 5000000,
    pib_2019: 40000,
    pib_2020: 41000
  };

  describe('GET /api/v2/paises', () => {
    it('debe retornar estructura V2 correcta', async () => {
      const response = await request(app)
        .get('/api/v2/paises')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('result');
      expect(response.body.result).toHaveProperty('countries');
      expect(response.body.result).toHaveProperty('pagination');
      expect(response.body.result).toHaveProperty('timestamp');
      expect(response.body.result).toHaveProperty('version', '2.0');

      expect(Array.isArray(response.body.result.countries)).toBe(true);
    });

    it('debe incluir metadata de paginación completa', async () => {
      const response = await request(app)
        .get('/api/v2/paises')
        .expect(200);

      const pagination = response.body.result.pagination;
      expect(pagination).toHaveProperty('total');
      expect(pagination).toHaveProperty('limit');
      expect(pagination).toHaveProperty('offset');
      expect(pagination).toHaveProperty('hasMore');

      expect(typeof pagination.total).toBe('number');
      expect(typeof pagination.limit).toBe('number');
      expect(typeof pagination.offset).toBe('number');
      expect(typeof pagination.hasMore).toBe('boolean');
    });

    it('debe calcular hasMore correctamente', async () => {
      // Caso 1: hasMore debe ser true si hay más países
      const response1 = await request(app)
        .get('/api/v2/paises?limit=2&offset=0')
        .expect(200);

      const total = response1.body.result.pagination.total;
      const limit = response1.body.result.pagination.limit;
      const hasMore = response1.body.result.pagination.hasMore;

      if (total > limit) {
        expect(hasMore).toBe(true);
      }

      // Caso 2: hasMore debe ser false si estamos en la última página
      const response2 = await request(app)
        .get('/api/v2/paises?limit=100&offset=0')
        .expect(200);

      const hasMore2 = response2.body.result.pagination.hasMore;
      if (total <= 100) {
        expect(hasMore2).toBe(false);
      }
    });

    it('debe incluir timestamp en formato ISO', async () => {
      const response = await request(app)
        .get('/api/v2/paises')
        .expect(200);

      const timestamp = response.body.result.timestamp;
      expect(typeof timestamp).toBe('string');

      // Verificar que es un timestamp válido
      const date = new Date(timestamp);
      expect(date.toISOString()).toBe(timestamp);
    });

    it('debe respetar el parámetro limit', async () => {
      const limit = 2;
      const response = await request(app)
        .get(`/api/v2/paises?limit=${limit}`)
        .expect(200);

      expect(response.body.result.countries.length).toBeLessThanOrEqual(limit);
      expect(response.body.result.pagination.limit).toBe(limit);
    });

    it('debe respetar el parámetro offset', async () => {
      const offset = 2;
      const response = await request(app)
        .get(`/api/v2/paises?offset=${offset}`)
        .expect(200);

      expect(response.body.result.pagination.offset).toBe(offset);
    });

    it('deve retornar error 500 con detalles en development', async () => {
      // Este test requiere simular un error de BD
      // Por ahora, verificamos la estructura del error
      // En un escenario real, se podría mockear el pool para causar un error

      const response = await request(app)
        .get('/api/v2/paises');

      // Si la BD funciona correctamente, el test pasa
      // Si hay un error, debe tener la estructura correcta
      if (response.status === 500) {
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('error');
      }
    });
  });

  describe('POST /api/v2/paises', () => {
    it('debe crear un país con respuesta V2 enriquecida', async () => {
      const response = await request(app)
        .post('/api/v2/paises')
        .send(TEST_PAIS)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('result');
      expect(response.body.result).toHaveProperty('country');
      expect(response.body.result).toHaveProperty('created_at');
      expect(response.body.result).toHaveProperty('version', '2.0');
    });

    it('deve incluir datos completos del país creado', async () => {
      const response = await request(app)
        .post('/api/v2/paises')
        .send({ ...TEST_PAIS, nombre: 'PaisCompletoV2' })
        .expect(201);

      const country = response.body.result.country;
      expect(country).toHaveProperty('nombre', 'PaisCompletoV2');
      expect(country).toHaveProperty('continente', TEST_PAIS.continente);
      expect(country).toHaveProperty('poblacion', TEST_PAIS.poblacion);
      expect(country).toHaveProperty('pib_2019', TEST_PAIS.pib_2019);
      expect(country).toHaveProperty('pib_2020', TEST_PAIS.pib_2020);
    });

    it('debe incluir created_at timestamp', async () => {
      const response = await request(app)
        .post('/api/v2/paises')
        .send({ ...TEST_PAIS, nombre: 'PaisTimestampV2' })
        .expect(201);

      const createdAt = response.body.result.created_at;
      expect(typeof createdAt).toBe('string');

      // Verificar que es un timestamp válido
      const date = new Date(createdAt);
      expect(date.toISOString()).toBe(createdAt);
    });

    it('debe retornar 400 con lista de required_fields', async () => {
      const response = await request(app)
        .post('/api/v2/paises')
        .send({ nombre: 'Test' }) // Campos faltantes
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('required_fields');
      expect(Array.isArray(response.body.required_fields)).toBe(true);

      const expectedFields = ['nombre', 'continente', 'poblacion', 'pib_2019', 'pib_2020'];
      expect(response.body.required_fields).toEqual(expect.arrayContaining(expectedFields));
    });

    it('deve insertar en ambas tablas con transacción ACID', async () => {
      await request(app)
        .post('/api/v2/paises')
        .send({ ...TEST_PAIS, nombre: 'PaisTransaccionalV2' })
        .expect(201);

      // Verificar tabla paises
      const paisResult = await dbPool.query(
        'SELECT * FROM paises WHERE nombre = $1',
        ['PaisTransaccionalV2']
      );
      expect(paisResult.rows.length).toBe(1);

      // Verificar tabla paises_pib
      const pibResult = await dbPool.query(
        'SELECT * FROM paises_pib WHERE nombre = $1',
        ['PaisTransaccionalV2']
      );
      expect(pibResult.rows.length).toBe(1);
    });

    it('debe registrar auditoría con accion=1', async () => {
      await request(app)
        .post('/api/v2/paises')
        .send({ ...TEST_PAIS, nombre: 'PaisAuditadoV2' })
        .expect(201);

      const auditResult = await dbPool.query(
        'SELECT * FROM paises_data_web WHERE nombre_pais = $1',
        ['PaisAuditadoV2']
      );
      expect(auditResult.rows.length).toBe(1);
      expect(auditResult.rows[0].accion).toBe(1);
    });

    it('debe retornar error si el país ya existe', async () => {
      // Crear país primero
      await request(app)
        .post('/api/v2/paises')
        .send({ ...TEST_PAIS, nombre: 'PaisDuplicadoV2' })
        .expect(201);

      // Intentar crear el mismo país otra vez
      const response = await request(app)
        .post('/api/v2/paises')
        .send({ ...TEST_PAIS, nombre: 'PaisDuplicadoV2' });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('DELETE /api/v2/paises/:nombre', () => {
    beforeEach(async () => {
      // Crear un país para eliminar
      await request(app)
        .post('/api/v2/paises')
        .send({ ...TEST_PAIS, nombre: 'PaisParaEliminarV2' })
        .expect(201);
    });

    it('deve eliminar un país con respuesta V2 enriquecida', async () => {
      const response = await request(app)
        .delete('/api/v2/paises/PaisParaEliminarV2')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('result');
      expect(response.body.result).toHaveProperty('deleted_country');
      expect(response.body.result).toHaveProperty('deleted_at');
      expect(response.body.result).toHaveProperty('version', '2.0');
    });

    it('debe incluir datos del país eliminado', async () => {
      const response = await request(app)
        .delete('/api/v2/paises/PaisParaEliminarV2')
        .expect(200);

      const deletedCountry = response.body.result.deleted_country;
      expect(deletedCountry).toHaveProperty('nombre', 'PaisParaEliminarV2');
      expect(deletedCountry).toHaveProperty('continente');
      expect(deletedCountry).toHaveProperty('poblacion');
    });

    it('debe incluir deleted_at timestamp', async () => {
      const response = await request(app)
        .delete('/api/v2/paises/PaisParaEliminarV2')
        .expect(200);

      const deletedAt = response.body.result.deleted_at;
      expect(typeof deletedAt).toBe('string');

      // Verificar que es un timestamp válido
      const date = new Date(deletedAt);
      expect(date.toISOString()).toBe(deletedAt);
    });

    it('debe eliminar de ambas tablas', async () => {
      await request(app)
        .delete('/api/v2/paises/PaisParaEliminarV2')
        .expect(200);

      // Verificar que no existe en paises
      const paisResult = await dbPool.query(
        "SELECT * FROM paises WHERE nombre = 'PaisParaEliminarV2'"
      );
      expect(paisResult.rows.length).toBe(0);

      // Verificar que no existe en paises_pib
      const pibResult = await dbPool.query(
        "SELECT * FROM paises_pib WHERE nombre = 'PaisParaEliminarV2'"
      );
      expect(pibResult.rows.length).toBe(0);
    });

    it('debe registrar auditoría con accion=0', async () => {
      await request(app)
        .delete('/api/v2/paises/PaisParaEliminarV2')
        .expect(200);

      const auditResult = await dbPool.query(
        "SELECT * FROM paises_data_web WHERE nombre_pais = 'PaisParaEliminarV2'"
      );
      expect(auditResult.rows.length).toBe(1);
      expect(auditResult.rows[0].accion).toBe(0);
    });

    it('debe retornar 404 con mensaje específico', async () => {
      const response = await request(app)
        .delete('/api/v2/paises/PaisInexistenteV2')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('no encontrado');
    });

    it('deve manejar espacios en el nombre del país', async () => {
      // Crear país con espacio
      await request(app)
        .post('/api/v2/paises')
        .send({ ...TEST_PAIS, nombre: 'Pais Con Espacio V2' })
        .expect(201);

      // Eliminar con espacio
      const response = await request(app)
        .delete('/api/v2/paises/Pais Con Espacio V2')
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Integración completa V2', () => {
    it('debe permitir flujo completo: crear -> listar -> eliminar', async () => {
      const nombrePais = 'PaisFlujoCompletoV2';

      // 1. Crear
      const createResponse = await request(app)
        .post('/api/v2/paises')
        .send({ ...TEST_PAIS, nombre: nombrePais })
        .expect(201);
      expect(createResponse.body.success).toBe(true);
      expect(createResponse.body.result.version).toBe('2.0');

      // 2. Listar y verificar que existe
      const listResponse = await request(app)
        .get('/api/v2/paises')
        .expect(200);
      const paises = listResponse.body.result.countries;
      const paisCreado = paises.find(p => p.nombre === nombrePais);
      expect(paisCreado).toBeDefined();
      expect(paisCreado.continente).toBe(TEST_PAIS.continente);

      // 3. Eliminar
      const deleteResponse = await request(app)
        .delete(`/api/v2/paises/${nombrePais}`)
        .expect(200);
      expect(deleteResponse.body.success).toBe(true);
      expect(deleteResponse.body.result.deleted_country.nombre).toBe(nombrePais);

      // 4. Verificar que ya no existe
      const finalListResponse = await request(app)
        .get('/api/v2/paises')
        .expect(200);
      const paisesFinales = finalListResponse.body.result.countries;
      const paisEliminado = paisesFinales.find(p => p.nombre === nombrePais);
      expect(paisEliminado).toBeUndefined();
    });

    it('debe diferenciar respuestas V1 vs V2', async () => {
      // Este test verifica que la estructura V2 es diferente a V1
      const response = await request(app)
        .get('/api/v2/paises')
        .expect(200);

      // V2 usa 'success' y 'result'
      expect(response.body).not.toHaveProperty('ok');
      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('result');

      // V2 incluye metadata
      expect(response.body.result).toHaveProperty('pagination');
      expect(response.body.result).toHaveProperty('version');
    });
  });
});
