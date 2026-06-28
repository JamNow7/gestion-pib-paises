/**
 * Tests de integración para API V1 de Países
 * Prueba los endpoints GET, POST, DELETE /api/v1/paises
 */

import express from 'express';
import request from 'supertest';
import cors from 'cors';
import { getPaises, crearPais, eliminarPais } from '../../../src/controllers/paises.controller.js';
import pg from 'pg';

const { Pool } = pg;

// Crear una app de Express para testing
const app = express();
app.use(cors());
app.use(express.json());

// Crear router con las rutas V1
const router = express.Router();
router.get('/paises', getPaises);
router.post('/paises', crearPais);
router.delete('/paises/:nombre', eliminarPais);

app.use('/api/v1', router);

// Pool de BD para verificaciones directas
let dbPool;

beforeAll(async () => {
  // Reutilizar el pool global inicializado en tests/setup.js
  dbPool = global.testPool || global.dbPool;
});

describe('API V1 - Países', () => {
  const TEST_PAIS = {
    nombre: 'PaisTestV1',
    continente: 'Europa',
    poblacion: 5000000,
    pib_2019: 40000,
    pib_2020: 41000
  };

  describe('GET /api/v1/paises', () => {
    it('debe retornar array de países con estructura correcta', async () => {
      const response = await request(app)
        .get('/api/v1/paises')
        .expect(200);

      expect(response.body).toHaveProperty('ok', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);

      // Verificar estructura de un país
      const pais = response.body.data[0];
      expect(pais).toHaveProperty('nombre');
      expect(pais).toHaveProperty('continente');
      expect(pais).toHaveProperty('poblacion');
      expect(pais).toHaveProperty('pib_2019');
      expect(pais).toHaveProperty('pib_2020');
    });

    it('debe respetar el parámetro limit', async () => {
      const limit = 2;
      const response = await request(app)
        .get(`/api/v1/paises?limit=${limit}`)
        .expect(200);

      expect(response.body.data.length).toBeLessThanOrEqual(limit);
    });

    it('debe respetar el parámetro offset', async () => {
      // Primero obtener todos
      const allResponse = await request(app).get('/api/v1/paises');
      const allPaises = allResponse.body.data;

      // Obtener con offset
      const offset = 1;
      const offsetResponse = await request(app)
        .get(`/api/v1/paises?offset=${offset}`)
        .expect(200);

      // El primer país con offset debe ser diferente al primero sin offset
      if (allPaises.length > offset) {
        expect(offsetResponse.body.data[0].nombre).not.toBe(allPaises[0].nombre);
      }
    });

    it('debe usar valores por defecto cuando no se proveen limit/offset', async () => {
      const response = await request(app)
        .get('/api/v1/paises')
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('POST /api/v1/paises', () => {
    it('debe crear un país exitosamente', async () => {
      const response = await request(app)
        .post('/api/v1/paises')
        .send(TEST_PAIS)
        .expect(201);

      expect(response.body).toHaveProperty('ok', true);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain(TEST_PAIS.nombre);

      // Verificar que se insertó en la BD
      const dbResult = await dbPool.query(
        'SELECT * FROM paises WHERE nombre = $1',
        [TEST_PAIS.nombre]
      );
      expect(dbResult.rows.length).toBe(1);
      expect(dbResult.rows[0].continente).toBe(TEST_PAIS.continente);
    });

    it('debe insertar en ambas tablas (paises y paises_pib)', async () => {
      await request(app)
        .post('/api/v1/paises')
        .send({ ...TEST_PAIS, nombre: 'PaisTransaccional' });

      // Verificar tabla paises
      const paisResult = await dbPool.query(
        'SELECT * FROM paises WHERE nombre = $1',
        ['PaisTransaccional']
      );
      expect(paisResult.rows.length).toBe(1);

      // Verificar tabla paises_pib
      const pibResult = await dbPool.query(
        'SELECT * FROM paises_pib WHERE nombre = $1',
        ['PaisTransaccional']
      );
      expect(pibResult.rows.length).toBe(1);
    });

    it('debe registrar en tabla de auditoría (paises_data_web)', async () => {
      await request(app)
        .post('/api/v1/paises')
        .send({ ...TEST_PAIS, nombre: 'PaisAuditado' });

      const auditResult = await dbPool.query(
        'SELECT * FROM paises_data_web WHERE nombre_pais = $1',
        ['PaisAuditado']
      );
      expect(auditResult.rows.length).toBe(1);
      expect(auditResult.rows[0].accion).toBe(1); // 1 = creación
    });

    it('debe retornar 400 si faltan campos requeridos', async () => {
      const casosIncompletos = [
        {}, // Todos faltan
        { nombre: 'Test', continente: 'Europa' }, // Faltan población y PIB
        { nombre: 'Test', poblacion: 1000 }, // Falta continente
        { continente: 'Europa', poblacion: 1000, pib_2019: 100, pib_2020: 100 }, // Falta nombre
      ];

      for (const caso of casosIncompletos) {
        const response = await request(app)
          .post('/api/v1/paises')
          .send(caso);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('ok', false);
      }
    });

    it('debe retornar error si el país ya existe', async () => {
      // Crear país primero
      await request(app)
        .post('/api/v1/paises')
        .send({ ...TEST_PAIS, nombre: 'PaisDuplicado' });

      // Intentar crear el mismo país otra vez
      const response = await request(app)
        .post('/api/v1/paises')
        .send({ ...TEST_PAIS, nombre: 'PaisDuplicado' });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('ok', false);
    });

    it('debe hacer rollback si falla la segunda inserción', async () => {
      // Este test verifica la transacción ACID
      // Simulamos un error intentando insertar un PIB inválido
      const paisConPibInvalido = {
        nombre: 'PaisRollback',
        continente: 'Europa',
        poblacion: 1000000,
        pib_2019: 'invalido', // Esto causará error
        pib_2020: 100
      };

      const response = await request(app)
        .post('/api/v1/paises')
        .send(paisConPibInvalido);

      expect(response.status).toBe(500);

      // Verificar que no se insertó nada
      const result = await dbPool.query(
        "SELECT * FROM paises WHERE nombre = 'PaisRollback'"
      );
      expect(result.rows.length).toBe(0);
    });
  });

  describe('DELETE /api/v1/paises/:nombre', () => {
    beforeEach(async () => {
      // Crear un país para eliminar
      await request(app)
        .post('/api/v1/paises')
        .send({ ...TEST_PAIS, nombre: 'PaisParaEliminar' });
    });

    it('debe eliminar un país existente', async () => {
      const response = await request(app)
        .delete('/api/v1/paises/PaisParaEliminar')
        .expect(200);

      expect(response.body).toHaveProperty('ok', true);
      expect(response.body.message).toContain('eliminado');

      // Verificar que se eliminó de la BD
      const result = await dbPool.query(
        "SELECT * FROM paises WHERE nombre = 'PaisParaEliminar'"
      );
      expect(result.rows.length).toBe(0);
    });

    it('debe eliminar de ambas tablas (paises y paises_pib)', async () => {
      await request(app).delete('/api/v1/paises/PaisParaEliminar');

      // Verificar que no existe en paises
      const paisResult = await dbPool.query(
        "SELECT * FROM paises WHERE nombre = 'PaisParaEliminar'"
      );
      expect(paisResult.rows.length).toBe(0);

      // Verificar que no existe en paises_pib
      const pibResult = await dbPool.query(
        "SELECT * FROM paises_pib WHERE nombre = 'PaisParaEliminar'"
      );
      expect(pibResult.rows.length).toBe(0);
    });

    it('debe registrar en tabla de auditoría con accion=0', async () => {
      await request(app).delete('/api/v1/paises/PaisParaEliminar');

      const auditResult = await dbPool.query(
        "SELECT * FROM paises_data_web WHERE nombre_pais = 'PaisParaEliminar'"
      );
      expect(auditResult.rows.length).toBe(1);
      expect(auditResult.rows[0].accion).toBe(0); // 0 = eliminación
    });

    it('debe retornar 404 si el país no existe', async () => {
      const response = await request(app)
        .delete('/api/v1/paises/PaisInexistente')
        .expect(404);

      expect(response.body).toHaveProperty('ok', false);
      expect(response.body.message).toContain('no encontrado');
    });

    it('debe manejar espacios en el nombre del país', async () => {
      // Crear país con espacio
      await request(app)
        .post('/api/v1/paises')
        .send({ ...TEST_PAIS, nombre: 'Pais Con Espacio' });

      // Eliminar con espacio
      const response = await request(app)
        .delete('/api/v1/paises/Pais Con Espacio')
        .expect(200);

      expect(response.body.ok).toBe(true);
    });
  });

  describe('Integración completa V1', () => {
    it('debe permitir flujo completo: crear -> listar -> eliminar', async () => {
      const nombrePais = 'PaisFlujoCompleto';

      // 1. Crear
      const createResponse = await request(app)
        .post('/api/v1/paises')
        .send({ ...TEST_PAIS, nombre: nombrePais })
        .expect(201);
      expect(createResponse.body.ok).toBe(true);

      // 2. Listar y verificar que existe
      const listResponse = await request(app)
        .get('/api/v1/paises')
        .expect(200);
      const paises = listResponse.body.data;
      const paisCreado = paises.find(p => p.nombre === nombrePais);
      expect(paisCreado).toBeDefined();
      expect(paisCreado.continente).toBe(TEST_PAIS.continente);

      // 3. Eliminar
      const deleteResponse = await request(app)
        .delete(`/api/v1/paises/${nombrePais}`)
        .expect(200);
      expect(deleteResponse.body.ok).toBe(true);

      // 4. Verificar que ya no existe
      const finalListResponse = await request(app)
        .get('/api/v1/paises')
        .expect(200);
      const paisesFinales = finalListResponse.body.data;
      const paisEliminado = paisesFinales.find(p => p.nombre === nombrePais);
      expect(paisEliminado).toBeUndefined();
    });
  });
});
